import os
from pathlib import Path
from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class ProjectIndexer:
    def __init__(self):
        # We assume fastapi_backend/app/services is current cwd or we run from fastapi_backend
        # Path resolution relative to the backend root directory
        self.root_dir = Path(__file__).resolve().parent.parent.parent.parent
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.RAG_CHUNK_SIZE,
            chunk_overlap=settings.RAG_CHUNK_OVERLAP,
        )

        # Directories and files to include
        self.include_extensions = {".ts", ".tsx", ".js", ".py", ".md", ".json"}
        self.ignore_dirs = {"node_modules", ".next", ".venv", "__pycache__", "rag_data", "alembic_migrations", "images", "stylesheets", "overrides", "local-shared-data"}

    def load_project_files(self) -> List[Document]:
        documents = []
        
        # Manually specify interesting paths to limit parsing size and focus on important context
        target_paths = [
            self.root_dir / "README.md",
            self.root_dir / "nextjs-frontend" / "ARCHITECTURE.md",
            self.root_dir / "nodejs-backend" / "API_GUIDE.md",
            self.root_dir / "nextjs-frontend" / "app",
            self.root_dir / "nextjs-frontend" / "components",
            self.root_dir / "nodejs-backend" / "src",
            self.root_dir / "fastapi_backend" / "app",
        ]

        for target in target_paths:
            if not target.exists():
                logger.warning(f"Target path does not exist: {target}")
                continue
            
            if target.is_file():
                docs = self._process_file(target)
                if docs:
                    documents.extend(docs)
            elif target.is_dir():
                for root, dirs, files in os.walk(target):
                    # Filter ignored directories in-place
                    dirs[:] = [d for d in dirs if d not in self.ignore_dirs and not d.startswith('.')]
                    for file in files:
                        file_path = Path(root) / file
                        if file_path.suffix.lower() in self.include_extensions:
                            docs = self._process_file(file_path)
                            if docs:
                                documents.extend(docs)

        chunks = self.text_splitter.split_documents(documents)
        logger.info(f"Loaded {len(chunks)} chunks from project files.")
        return chunks

    def _process_file(self, file_path: Path) -> List[Document]:
        try:
            content = file_path.read_text(encoding="utf-8")
            if not content.strip():
                return []
            
            # Determine category based on path
            category = "other"
            path_str = str(file_path)
            if "components" in path_str:
                category = "component"
            elif "app" in path_str and ("nextjs-frontend" in path_str):
                category = "frontend_page_or_route"
            elif "app" in path_str and ("fastapi_backend" in path_str):
                category = "fastapi_backend"
            elif "nodejs-backend" in path_str:
                category = "nodejs_backend"
            elif file_path.suffix == ".md":
                category = "documentation"
                
            return [Document(
                page_content=f"File: {file_path.relative_to(self.root_dir)}\n\n{content}",
                metadata={
                    "source": str(file_path.relative_to(self.root_dir)),
                    "type": "project_code",
                    "category": category
                }
            )]
        except Exception as e:
            logger.error(f"Error reading {file_path}: {e}")
            return []
