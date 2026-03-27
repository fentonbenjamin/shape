import { readFile } from "node:fs/promises";
import process from "node:process";
import { shape } from "../lib/shape";
import type { ShapeProfile } from "../lib/types";

interface CliOptions {
  file?: string;
  profile?: ShapeProfile;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--file" && next) {
      options.file = next;
      index += 1;
      continue;
    }

    if (arg === "--profile" && next) {
      if (next === "narrative_segment_v0" || next === "concept_blob_v0") {
        options.profile = next;
      } else {
        throw new Error(`Unsupported profile: ${next}`);
      }
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      process.stdout.write(
        [
          "Usage: npm run shape:local -- [--file path] [--profile narrative_segment_v0|concept_blob_v0]",
          "",
          "Examples:",
          "  cat notes.txt | npm run shape:local",
          "  npm run shape:local -- --file ./notes.txt --profile concept_blob_v0",
          "",
        ].join("\n")
      );
      process.exit(0);
    }
  }

  return options;
}

async function readInput(file?: string): Promise<string> {
  if (file) {
    return readFile(file, "utf8");
  }

  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const rawText = await readInput(options.file);

  if (!rawText.trim()) {
    throw new Error("No input provided. Pipe text into stdin or pass --file.");
  }

  const result = await shape(rawText, options.profile, "local");
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
