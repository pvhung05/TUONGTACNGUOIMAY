import path from "node:path";
import { runBackendPython } from "./backend-exec.mjs";

const backendDir = path.join(process.cwd(), "fastapi_backend");
const code = runBackendPython(["watcher.py"], backendDir);
if (code !== 0) {
  console.error("");
  console.error("Run: npm run setup:backend");
  process.exit(code || 1);
}
