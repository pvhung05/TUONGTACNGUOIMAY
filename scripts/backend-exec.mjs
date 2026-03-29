import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const shell = process.platform === "win32";

/**
 * Path to Python inside fastapi_backend/.venv if it exists.
 */
export function venvPython(backendDir) {
  const win = path.join(backendDir, ".venv", "Scripts", "python.exe");
  const unix = path.join(backendDir, ".venv", "bin", "python");
  if (process.platform === "win32" && existsSync(win)) return win;
  if (existsSync(unix)) return unix;
  return null;
}

/**
 * Run `pythonArgs` in fastapi_backend (e.g. ['-m','uvicorn',...] or ['watcher.py']).
 * Tries: .venv python → uv run python → python -m uv run → py -m uv run (Windows).
 * @returns {number} exit code (0 = success)
 */
export function runBackendPython(pythonArgs, backendDir) {
  const py = venvPython(backendDir);
  if (py) {
    const r = spawnSync(py, pythonArgs, { cwd: backendDir, stdio: "inherit" });
    return r.status ?? 1;
  }

  const uvRun = ["run", "python", ...pythonArgs];
  const attempts = [
    () => spawnSync("uv", uvRun, { cwd: backendDir, stdio: "inherit", shell }),
    () =>
      spawnSync("python", ["-m", "uv", ...uvRun], {
        cwd: backendDir,
        stdio: "inherit",
        shell,
      }),
  ];
  if (process.platform === "win32") {
    attempts.push(() =>
      spawnSync("py", ["-m", "uv", ...uvRun], {
        cwd: backendDir,
        stdio: "inherit",
        shell,
      }),
    );
  }

  for (const attempt of attempts) {
    const r = attempt();
    if (r.status === 0) return 0;
  }
  return 1;
}

/**
 * Sync backend deps: uv sync, or python -m uv sync, or py -m uv sync.
 * @returns {boolean}
 */
export function syncBackend(backendDir) {
  const attempts = [
    () => spawnSync("uv", ["sync"], { cwd: backendDir, stdio: "inherit", shell }),
    () =>
      spawnSync("python", ["-m", "uv", "sync"], {
        cwd: backendDir,
        stdio: "inherit",
        shell,
      }),
  ];
  if (process.platform === "win32") {
    attempts.push(() =>
      spawnSync("py", ["-m", "uv", "sync"], {
        cwd: backendDir,
        stdio: "inherit",
        shell,
      }),
    );
  }

  for (const attempt of attempts) {
    const r = attempt();
    if (r.status === 0) return true;
  }
  return false;
}
