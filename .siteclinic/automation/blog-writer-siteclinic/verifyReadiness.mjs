import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const REPO_ROOT = path.resolve(process.env.SITECLINIC_AUTOMATION_REPO_ROOT || DEFAULT_REPO_ROOT);
const SCHEDULE_PATH = path.join(REPO_ROOT, "src", "blog-schedule.json");
const DRAFT_DIR = path.join(REPO_ROOT, ".siteclinic", "automation", "blog-writer-siteclinic", "drafts");
const SCHEDULER_WEEKDAYS = new Set([2, 4]);
const SCHEDULER_LABEL = "Tuesday/Thursday 1:13 AM America/Los_Angeles";

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) {
      continue;
    }
    const key = current.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function getTodayInTimeZone(timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

function parseDateOnly(dateText) {
  return new Date(`${dateText}T12:00:00Z`);
}

function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function weekdayLabel(dateText) {
  return parseDateOnly(dateText).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
}

function parseFrontMatter(source) {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return {};
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return {};
  }

  const attributes = {};
  for (const line of normalized.slice(4, endIndex).split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) {
      attributes[key] = value;
    }
  }

  return attributes;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function buildQueueIndex(queue) {
  const byDate = new Map();
  const groupedSlugs = new Map();

  for (const item of queue) {
    const targetDate = item.target_date;
    if (typeof targetDate !== "string" || targetDate.length === 0) continue;
    if (!groupedSlugs.has(targetDate)) {
      groupedSlugs.set(targetDate, []);
    }
    groupedSlugs.get(targetDate).push(item.slug);
    if (!byDate.has(targetDate)) {
      byDate.set(targetDate, item);
    }
  }

  const duplicates = [];
  for (const [targetDate, slugs] of groupedSlugs) {
    if (slugs.length > 1) {
      duplicates.push({ targetDate, slugs });
    }
  }

  return { byDate, duplicates };
}

function buildScheduledDates(fromDate, slots) {
  const start = parseDateOnly(fromDate);
  const dates = [];

  for (let offset = 0; offset < 90 && dates.length < slots; offset += 1) {
    const candidate = new Date(start);
    candidate.setUTCDate(start.getUTCDate() + offset);

    if (!SCHEDULER_WEEKDAYS.has(candidate.getUTCDay())) {
      continue;
    }

    dates.push(formatDateOnly(candidate));
  }

  return dates;
}

async function main() {
  const args = parseArgs(process.argv);
  const slotCount = Number(args.slots ?? "4");
  if (!Number.isInteger(slotCount) || slotCount <= 0) {
    throw new Error("--slots must be a positive integer");
  }

  const fromDate = args.from ?? getTodayInTimeZone("America/Los_Angeles");
  const schedule = JSON.parse(await fs.readFile(SCHEDULE_PATH, "utf8"));
  const queue = Array.isArray(schedule.queue) ? schedule.queue : [];
  const published = Array.isArray(schedule.published) ? schedule.published : [];
  const { byDate: queueByDate, duplicates: duplicateQueueDates } =
    buildQueueIndex(queue);
  const publishedByDate = new Map(
    published
      .map((item) => [item.target_date ?? item.published, item])
      .filter(([dateText]) => typeof dateText === "string" && dateText.length > 0),
  );
  const scheduledDates = buildScheduledDates(fromDate, slotCount);

  const slots = [];
  const issues = [];

  for (const targetDate of scheduledDates) {
    const queuedItem = queueByDate.get(targetDate) ?? null;
    const publishedItem = publishedByDate.get(targetDate) ?? null;
    const effectiveSlug = queuedItem?.slug ?? publishedItem?.slug ?? null;
    const draftPath = effectiveSlug
      ? path.join(DRAFT_DIR, `${effectiveSlug}.md`)
      : null;
    const hasDraft = draftPath ? await fileExists(draftPath) : false;
    let imageStatus = null;

    let status = "ready";
    if (publishedItem) {
      status = "published";
    } else if (!queuedItem) {
      status = "missing-queue";
      issues.push({
        type: "missing-queue",
        targetDate,
        message: `No queued Site Clinic article exists for scheduled slot ${targetDate}.`,
      });
    } else if (!hasDraft) {
      status = "missing-draft";
      issues.push({
        type: "missing-draft",
        targetDate,
        slug: queuedItem.slug,
        message: `Queued slug ${queuedItem.slug} has no staged draft for scheduled slot ${targetDate}.`,
      });
    }

    if (draftPath && hasDraft) {
      const draftSource = await fs.readFile(draftPath, "utf8");
      const attributes = parseFrontMatter(draftSource);
      const missingImageFields = [
        ["image_url", attributes.image_url],
        ["image_alt", attributes.image_alt],
        ["image_source", attributes.image_source],
        ["image_license", attributes.image_license],
      ]
        .filter(([, value]) => typeof value !== "string" || value.length === 0)
        .map(([key]) => key);

      imageStatus = {
        ready: missingImageFields.length === 0,
        image: typeof attributes.image_url === "string" ? attributes.image_url : null,
        missing: missingImageFields,
      };
    }

    slots.push({
      targetDate,
      weekday: weekdayLabel(targetDate),
      status,
      slug: queuedItem?.slug ?? publishedItem?.slug ?? null,
      title: queuedItem?.title ?? publishedItem?.title ?? null,
      draftPath: draftPath && hasDraft ? path.relative(REPO_ROOT, draftPath) : null,
      hasDraft,
      imageStatus,
    });
  }

  for (const item of queue) {
    if (!SCHEDULER_WEEKDAYS.has(parseDateOnly(item.target_date).getUTCDay())) {
      issues.push({
        type: "schedule-mismatch",
        targetDate: item.target_date,
        slug: item.slug,
        message: `Queued slug ${item.slug} is set for ${weekdayLabel(item.target_date)}, which is outside the scheduler cadence.`,
      });
    }

    if (item.target_date < fromDate) {
      issues.push({
        type: "overdue-queue-item",
        targetDate: item.target_date,
        slug: item.slug,
        message: `Queued slug ${item.slug} is still scheduled in the past.`,
      });
    }
  }

  for (const { targetDate, slugs } of duplicateQueueDates) {
    issues.push({
      type: "duplicate-target-date",
      targetDate,
      slugs,
      message: `Multiple queued slugs (${slugs.join(", ")}) share target date ${targetDate}.`,
    });
  }

  const result = {
    success: issues.length === 0,
    lane: "blog-writer-siteclinic",
    scheduleLabel: SCHEDULER_LABEL,
    repoRoot: REPO_ROOT,
    fromDate,
    slotsChecked: slotCount,
    slots,
    issues,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!result.success) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(
    `${JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }, null, 2)}\n`,
  );
  process.exit(1);
});
