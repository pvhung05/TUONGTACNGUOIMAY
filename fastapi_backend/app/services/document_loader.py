from pathlib import Path
from typing import List
import fitz  # PyMuPDF
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class ASLDocumentLoader:
    def __init__(self):
        self.directory = Path(settings.RAG_ASL_DIR)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.RAG_CHUNK_SIZE,
            chunk_overlap=settings.RAG_CHUNK_OVERLAP,
        )

    def load_documents(self) -> List[Document]:
        documents = []
        if not self.directory.exists():
            logger.warning(f"ASL directory not found: {self.directory}")
            return documents

        for file_path in self.directory.glob("*"):
            if file_path.suffix.lower() == ".pdf":
                documents.extend(self._load_pdf(file_path))
            elif file_path.suffix.lower() == ".txt":
                documents.extend(self._load_txt(file_path))
            else:
                logger.info(f"Skipping unsupported file type: {file_path}")

        chunks = self.text_splitter.split_documents(documents)
        logger.info(f"Loaded {len(chunks)} chunks from ASL directory.")
        return chunks

    def _load_pdf(self, file_path: Path) -> List[Document]:
        documents = []
        try:
            with fitz.open(file_path) as doc:
                for i, page in enumerate(doc):
                    text = page.get_text()
                    if text.strip():
                        documents.append(
                            Document(
                                page_content=text,
                                metadata={
                                    "source": file_path.name,
                                    "page": i + 1,
                                    "type": "asl_knowledge"
                                }
                            )
                        )
        except Exception as e:
            logger.error(f"Error loading PDF {file_path}: {e}")
        return documents

    def _load_txt(self, file_path: Path) -> List[Document]:
        documents = []
        try:
            text = file_path.read_text(encoding="utf-8")
            if text.strip():
                documents.append(
                    Document(
                        page_content=text,
                        metadata={
                            "source": file_path.name,
                            "type": "asl_knowledge"
                        }
                    )
                )
        except Exception as e:
            logger.error(f"Error loading TXT {file_path}: {e}")
        return documents
