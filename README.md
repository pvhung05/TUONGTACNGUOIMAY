## Installation

Requires **Node.js** (npm), **Python 3.11+**, and **[uv](https://docs.astral.sh/uv/)** for the backend.

From the repo root:

```bash
npm install
npm run setup
npm run dev
```

- `npm run setup` installs frontend deps, syncs the backend with `uv`, and copies `.env` files from `.env.example` when missing.
- `npm run dev` starts the FastAPI backend and Next.js together (frontend: http://localhost:3000, API: http://localhost:8000).

Optional database: `npm run dev:db` (Docker).
