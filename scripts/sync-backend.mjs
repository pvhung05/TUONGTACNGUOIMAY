import path from "node:path";
import { syncBackend } from "./backend-exec.mjs";

const backendDir = path.join(process.cwd(), "fastapi_backend");
if (!syncBackend(backendDir)) {
  console.error("");
  console.error("Could not sync backend. Install uv (https://docs.astral.sh/uv/)");
  console.error("or: pip install uv   then run this script again.");
  process.exit(1);
}
