import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import type { GateConfig } from "./load-config";

const DEFAULT_STARTUP_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 500;
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "0.0.0.0"]);

function canAutoLaunch(baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).hostname;
    return LOCAL_HOSTS.has(host);
  } catch {
    return false;
  }
}

async function probe(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(baseUrl, { redirect: "manual" });
    return response.status > 0;
  } catch {
    return false;
  }
}

export async function ensureBaseUrlReady(config: GateConfig): Promise<() => Promise<void>> {
  if (await probe(config.baseUrl)) {
    return async () => {};
  }

  if (!canAutoLaunch(config.baseUrl)) {
    throw new Error(
      `gate baseUrl is unreachable: ${config.baseUrl}. Start the site manually or point baseUrl/GATE_BASE_URL at a reachable host.`,
    );
  }

  if (!config.launchCommand) {
    throw new Error(
      `gate baseUrl is unreachable: ${config.baseUrl}. Add "launchCommand" to gate.config.json so the gate can start the local site automatically.`,
    );
  }

  const parsedBaseUrl = new URL(config.baseUrl);
  const child = spawn(config.launchCommand, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOSTNAME: parsedBaseUrl.hostname,
      PORT: parsedBaseUrl.port || (parsedBaseUrl.protocol === "https:" ? "443" : "80"),
    },
    shell: true,
    stdio: "inherit",
  });

  const cleanup = async () => {
    if (child.exitCode !== null || child.killed) {
      return;
    }
    child.kill("SIGTERM");
    await delay(500);
    if (child.exitCode === null && !child.killed) {
      child.kill("SIGKILL");
    }
  };

  const timeoutMs = config.startupTimeoutMs ?? DEFAULT_STARTUP_TIMEOUT_MS;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await probe(config.baseUrl)) {
      return cleanup;
    }

    if (child.exitCode !== null) {
      throw new Error(
        `launchCommand exited before ${config.baseUrl} became ready (exit ${child.exitCode}).`,
      );
    }

    await delay(POLL_INTERVAL_MS);
  }

  await cleanup();
  throw new Error(
    `launchCommand did not make ${config.baseUrl} reachable within ${timeoutMs}ms.`,
  );
}
