import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const handbookRoot = resolve(extensionDir, "../../..");
const handbookContextPath = resolve(handbookRoot, "AGENTS.md");

export default function theAgentEraHandbook(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    if (existsSync(handbookContextPath)) {
      ctx.ui.notify("The Agent-Era Handbook loaded", "info");
    } else {
      ctx.ui.notify(
        `The Agent-Era Handbook not found: ${handbookContextPath}`,
        "warning",
      );
    }
  });

  pi.on("before_agent_start", async (event, ctx) => {
    if (!existsSync(handbookContextPath)) {
      ctx.ui.notify(
        `The Agent-Era Handbook not found: ${handbookContextPath}`,
        "warning",
      );
      return;
    }

    const content = readFileSync(handbookContextPath, "utf8").trim();
    if (!content) return;

    return {
      systemPrompt: `${event.systemPrompt}\n\n# The Agent-Era Handbook\n\n${content}`,
    };
  });
}
