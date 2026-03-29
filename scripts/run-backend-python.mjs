import path from "node:path";
import { runBackendPython } from "./backend-exec.mjs";

const backendDir = path.join(process.cwd(), "fastapi_backend");
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run-backend-python.mjs <python args...>");
  process.exit(1);
}
const code = runBackendPython(args, backendDir);
if (code !== 0) {
  console.error("");
  console.error("Run: npm run setup:backend");
  process.exit(code || 1);
}
