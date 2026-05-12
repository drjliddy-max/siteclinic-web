import fs from "node:fs/promises";
import path from "node:path";

export interface BlogScheduleEntry {
  slug: string;
  title: string;
  keywords?: string[];
  cluster?: string;
  subdomain?: string;
  target_date: string;
  published?: string;
}

export interface BlogScheduleFile {
  schedule?: {
    lane?: string;
    site?: string;
    cadence?: string;
    timezone?: string;
    publish_hour?: number;
    publish_minute?: number;
  };
  published?: BlogScheduleEntry[];
  queue?: BlogScheduleEntry[];
}

const REPO_ROOT = path.resolve(process.cwd());
const SCHEDULE_PATH = path.join(REPO_ROOT, "src", "blog-schedule.json");
const DRAFT_DIR = path.join(
  REPO_ROOT,
  ".siteclinic",
  "automation",
  "blog-writer-siteclinic",
  "drafts",
);

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ENOENT"
  );
}

export async function readSchedule(): Promise<BlogScheduleFile> {
  try {
    const raw = await fs.readFile(SCHEDULE_PATH, "utf8");
    return JSON.parse(raw) as BlogScheduleFile;
  } catch (error) {
    if (isNotFound(error)) {
      return {};
    }
    throw error;
  }
}

export async function readDraft(slug: string): Promise<string | null> {
  const draftPath = path.join(DRAFT_DIR, `${slug}.md`);
  try {
    return await fs.readFile(draftPath, "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }
    throw error;
  }
}

export function isPublished(
  schedule: BlogScheduleFile,
  slug: string,
): BlogScheduleEntry | null {
  return schedule.published?.find((entry) => entry.slug === slug) ?? null;
}

export function listPublished(schedule: BlogScheduleFile): BlogScheduleEntry[] {
  const published = schedule.published ?? [];
  return [...published].sort((a, b) => {
    const left = a.published ?? a.target_date;
    const right = b.published ?? b.target_date;
    return right.localeCompare(left);
  });
}
