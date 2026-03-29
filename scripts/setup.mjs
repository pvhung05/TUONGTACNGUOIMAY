import { copyFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { syncBackend } from "./backend-exec.mjs";

const root = process.cwd();
const frontendDir = path.join(root, "nextjs-frontend");
const backendDir = path.join(root, "fastapi_backend");

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}

function ensureEnv(target, example) {
  if (!existsSync(target) && existsSync(example)) {
    copyFileSync(example, target);
    console.log(`Created ${path.relative(root, target)} from example`);
  }
}

ensureEnv(
  path.join(frontendDir, ".env.local"),
  path.join(frontendDir, ".env.example"),
);
ensureEnv(path.join(backendDir, ".env"), path.join(backendDir, ".env.example"));

console.log("Installing frontend dependencies...");
if (!run("npm", ["install", "--prefix", "nextjs-frontend"], root)) {
  process.exit(1);
}

console.log("Syncing backend dependencies...");
if (!syncBackend(backendDir)) {
  console.log("");
  console.log("Backend sync failed. Install uv: https://docs.astral.sh/uv/");
  console.log("Or: pip install uv   then run: npm run setup:backend");
} else {
  console.log("Backend dependencies synced.");
}

console.log("");
console.log("Setup complete.");
console.log("Recommended next steps:");
console.log("1. npm run dev:db");
console.log("2. npm run dev");
