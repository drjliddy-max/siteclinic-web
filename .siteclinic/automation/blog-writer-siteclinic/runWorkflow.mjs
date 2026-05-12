import fs from "node:fs/promises";
import path from "node:path";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFile = promisify(execFileCallback);

const DEFAULT_REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const REPO_ROOT = path.resolve(process.env.SITECLINIC_AUTOMATION_REPO_ROOT || DEFAULT_REPO_ROOT);
const JOB_KEY = "blog-writer-siteclinic";
const SCHEDULE_PATH = path.join(REPO_ROOT, "src", "blog-schedule.json");
const DRAFT_DIR = path.join(REPO_ROOT, ".siteclinic", "automation", "blog-writer-siteclinic", "drafts");
const PROOF_DIR = path.join(REPO_ROOT, ".siteclinic", "automation", "blog-writer-siteclinic", "proofs");

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith("--")) {
      continue;
    }
    const key = part.slice(2);
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

function sanitizeFileSegment(value) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function formatIsoDateInTimezone(timeZone, inputDate = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(inputDate);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function selectQueuedPost(schedule, targetDate) {
  const matches = (schedule.queue || []).filter((item) => item.target_date === targetDate);
  if (matches.length === 0) {
    throw new Error(`No queued post found for targetDate ${targetDate}`);
  }
  if (matches.length > 1) {
    throw new Error(`Multiple queued posts found for targetDate ${targetDate}`);
  }
  return matches[0];
}

function selectPublishedPost(schedule, targetDate) {
  const matches = (schedule.published || []).filter((item) => item.target_date === targetDate);
  if (matches.length === 0) {
    return null;
  }
  if (matches.length > 1) {
    throw new Error(`Multiple published posts found for targetDate ${targetDate}`);
  }
  return matches[0];
}

function buildDraftPath(slug) {
  return path.join(DRAFT_DIR, `${slug}.md`);
}

function buildProofPath(idempotencyKey) {
  return path.join(PROOF_DIR, `${sanitizeFileSegment(idempotencyKey)}.json`);
}

function buildCommitMessage(proof) {
  return `Publish ${proof.slug} [${proof.idempotencyKey}]`;
}

async function git(args, cwd = REPO_ROOT) {
  return execFile("git", args, { cwd });
}

async function ensureCleanGitIdentity() {
  await git(["config", "user.name"]);
  await git(["config", "user.email"]);
}

async function getCurrentBranch() {
  const result = await git(["rev-parse", "--abbrev-ref", "HEAD"]);
  const branch = result.stdout.trim();
  if (!branch || branch === "HEAD") {
    throw new Error("Publishing requires a checked-out branch; detached HEAD is not supported");
  }
  return branch;
}

async function stageAndCommit({ proof, draftPath, proofPath }) {
  await ensureCleanGitIdentity();
  const branch = await getCurrentBranch();
  await git(["add", draftPath, SCHEDULE_PATH, proofPath]);
  const diff = await git(["diff", "--cached", "--name-only"]);
  const changedFiles = diff.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => path.relative(REPO_ROOT, path.resolve(REPO_ROOT, line)));

  if (changedFiles.length === 0) {
    return {
      changedFiles: [],
      commitSha: null,
    };
  }

  await git(["commit", "-m", buildCommitMessage(proof)]);
  const commit = await git(["rev-parse", "HEAD"]);
  await git(["push", "origin", `HEAD:${branch}`]);
  return {
    changedFiles,
    commitSha: commit.stdout.trim() || null,
  };
}

async function loadDraft(slug) {
  const draftPath = buildDraftPath(slug);
  if (!(await fileExists(draftPath))) {
    throw new Error(`Missing staged draft for slug ${slug} at ${path.relative(REPO_ROOT, draftPath)}`);
  }
  return draftPath;
}

function buildFailureProof({ inputs, error, proofOutputPath }) {
  return {
    proofVersion: 1,
    jobKey: inputs.jobKey || null,
    idempotencyKey: inputs.idempotencyKey || null,
    correlationId: inputs.correlationId || null,
    targetDate: inputs.targetDate || null,
    success: false,
    outcome: "failed",
    slug: null,
    changedFiles: [],
    queueDecision: null,
    proofOutputPath: proofOutputPath ? path.relative(REPO_ROOT, proofOutputPath) : null,
    completedAt: new Date().toISOString(),
    error: {
      message: error.message,
    },
  };
}

async function writeOutputProof(proofOutputPath, proof) {
  if (!proofOutputPath) {
    return;
  }
  await writeJson(proofOutputPath, proof);
}

export async function runSiteClinicBlogWriterPublishWorkflow({
  jobKey,
  idempotencyKey,
  correlationId,
  targetDate,
  proofOutputPath,
  pushChanges = true,
} = {}) {
  const inputs = { jobKey, idempotencyKey, correlationId, targetDate };
  try {
    if (jobKey !== JOB_KEY) {
      throw new Error(`jobKey must be ${JOB_KEY}`);
    }
    if (!idempotencyKey || !correlationId || !targetDate) {
      throw new Error("jobKey, idempotencyKey, correlationId, and targetDate are all required");
    }

    const proofPath = buildProofPath(idempotencyKey);
    const existingProof = (await fileExists(proofPath))
      ? await readJson(proofPath)
      : null;

    if (existingProof?.success) {
      if (existingProof.jobKey !== jobKey || existingProof.targetDate !== targetDate) {
        throw new Error(`idempotencyKey ${idempotencyKey} has already been used for a different request`);
      }

      const proof = {
        proofVersion: 1,
        jobKey,
        idempotencyKey,
        correlationId,
        targetDate,
        success: true,
        outcome: "duplicate-skipped",
        slug: existingProof.slug || null,
        changedFiles: [],
        queueDecision: "duplicate-proof-exists",
        publishedDate: existingProof.publishedDate || null,
        draftPath: existingProof.draftPath || null,
        repoProofPath: path.relative(REPO_ROOT, proofPath),
        articlePath: existingProof.articlePath || null,
        duplicateOf: path.relative(REPO_ROOT, proofPath),
        originalCorrelationId: existingProof.correlationId || null,
        originalCompletedAt: existingProof.completedAt || null,
        commitSha: existingProof.commitSha || null,
        completedAt: new Date().toISOString(),
      };
      await writeOutputProof(proofOutputPath, proof);
      return proof;
    }

    const schedule = await readJson(SCHEDULE_PATH);
    const queuedPost = selectPublishedPost(schedule, targetDate)
      ? null
      : selectQueuedPost(schedule, targetDate);
    const publishedPost = queuedPost ? null : selectPublishedPost(schedule, targetDate);
    if (publishedPost) {
      const draftPath = buildDraftPath(publishedPost.slug);
      if (!(await fileExists(draftPath))) {
        throw new Error(
          `Published post for targetDate ${targetDate} exists in schedule but draft file is missing for slug ${publishedPost.slug}`,
        );
      }

      const proof = {
        proofVersion: 1,
        jobKey,
        idempotencyKey,
        correlationId,
        targetDate,
        success: true,
        outcome: "duplicate-skipped",
        slug: publishedPost.slug,
        changedFiles: [],
        queueDecision: "already-published-target-date",
        publishedDate: publishedPost.published || publishedPost.target_date || null,
        draftPath: path.relative(REPO_ROOT, draftPath),
        repoProofPath: null,
        articlePath: path.relative(REPO_ROOT, draftPath),
        duplicateOf: null,
        originalCorrelationId: null,
        originalCompletedAt: null,
        commitSha: null,
        completedAt: new Date().toISOString(),
      };
      await writeOutputProof(proofOutputPath, proof);
      return proof;
    }

    const selectedQueuedPost = queuedPost ?? selectQueuedPost(schedule, targetDate);
    const draftPath = await loadDraft(selectedQueuedPost.slug);

    const publishDate = formatIsoDateInTimezone("America/Los_Angeles");

    const currentSchedule = structuredClone(schedule);
    const queueIndex = (currentSchedule.queue || []).findIndex(
      (entry) => entry.target_date === selectedQueuedPost.target_date,
    );
    if (queueIndex === -1) {
      throw new Error(
        `Queued post for ${selectedQueuedPost.target_date} (slug ${selectedQueuedPost.slug}) disappeared before publish`,
      );
    }

    const existingPublishedIndex = (currentSchedule.published || []).findIndex((entry) => entry.slug === selectedQueuedPost.slug);
    const articleExisted = existingPublishedIndex >= 0;
    const publishedEntry = {
      ...selectedQueuedPost,
      published: publishDate,
    };

    if (articleExisted) {
      currentSchedule.published[existingPublishedIndex] = publishedEntry;
    } else {
      currentSchedule.published = [publishedEntry, ...(currentSchedule.published || [])];
    }
    currentSchedule.queue.splice(queueIndex, 1);

    await writeJson(SCHEDULE_PATH, currentSchedule);

    const repoProof = {
      proofVersion: 1,
      jobKey,
      idempotencyKey,
      correlationId,
      targetDate,
      success: true,
      outcome: articleExisted ? "updated" : "created",
      slug: selectedQueuedPost.slug,
      changedFiles: [],
      queueDecision: "matched-target-date",
      publishedDate: publishDate,
      draftPath: path.relative(REPO_ROOT, draftPath),
      repoProofPath: path.relative(REPO_ROOT, proofPath),
      articlePath: path.relative(REPO_ROOT, draftPath),
      commitSha: null,
      completedAt: new Date().toISOString(),
    };

    await writeJson(proofPath, repoProof);

    const commitResult = pushChanges
      ? await stageAndCommit({ proof: repoProof, draftPath, proofPath })
      : {
        changedFiles: [
          path.relative(REPO_ROOT, draftPath),
          path.relative(REPO_ROOT, SCHEDULE_PATH),
          path.relative(REPO_ROOT, proofPath),
        ],
        commitSha: null,
      };

    const finalProof = {
      ...repoProof,
      changedFiles: commitResult.changedFiles,
      commitSha: commitResult.commitSha,
    };
    await writeJson(proofPath, finalProof);
    await writeOutputProof(proofOutputPath, finalProof);
    return finalProof;
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    const failureProof = buildFailureProof({
      inputs,
      error: typedError,
      proofOutputPath,
    });
    await writeOutputProof(proofOutputPath, failureProof);
    throw typedError;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const pushChanges = args.pushChanges === "false" ? false : args["no-push"] !== "true";
  const proof = await runSiteClinicBlogWriterPublishWorkflow({
    jobKey: args.jobKey,
    idempotencyKey: args.idempotencyKey,
    correlationId: args.correlationId,
    targetDate: args.targetDate,
    proofOutputPath: args.proofOutputPath,
    pushChanges,
  });
  if (!args.proofOutputPath) {
    process.stdout.write(`${JSON.stringify(proof, null, 2)}\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
