# ⚡ RAG Assist — Technical Documentation Assistant

An intelligent Retrieval-Augmented Generation (RAG) assistant designed to ingest, index, and query technical documentation with low-latency, context-grounded responses powered by Groq and vector search.

---

## 📌 Overview

**rag_assist** bridges the gap between static technical manuals and interactive developer workflows. By processing documentation into embeddings and using semantic search to augment prompt context, the system provides accurate, hallucination-resistant answers with precise citations.

### ✨ Key Features
* **Semantic Document Retrieval:** Fast vector search across ingested technical documentation and code references.
* **Ultra-Fast LLM Inference:** Powered by Groq for near-instant responses.
* **Decoupled Architecture:** Clean separation between data ingestion, backend API handling, and the interactive frontend.
* **Zero-Hallucination Grounding:** Prompts strictly anchored to retrieved document chunks with context attribution.

---

## 🏗️ System Architecture

```text
  [ Technical Docs / PDFs / Markdown ]
                 │
                 ▼
       ┌───────────────────┐
       │ Ingestion Pipeline│ (Chunking & Embedding Generation)
       └─────────┬─────────┘
                 │
                 ▼
       ┌───────────────────┐
       │  Vector Database  │
       └─────────┬─────────┘
                 │
                 │ (Semantic Context)
                 ▼
[ User ] ──► [ Frontend UI ] ──► [ Backend Server ] ──► [ Groq LLM API ]
                                                               │
                                      ◄────────────────────────┘
```
```
 rag_assist/
├── backend/
│   ├── ingestion.py        # Document parsing, chunking, and embedding script
│   ├── server.py           # Core API & RAG query handling
│   ├── requirements.txt    # Backend dependencies
│   └── .env.example        # Environment variable template
├── frontend/
│   ├── app.py              # User interface (Streamlit / Web client)
│   └── requirements.txt    # Frontend dependencies
├── .gitignore              # Ignored files (venv, .env, large models)
└── README.md
```
## 🛠️Prerequisites
```bash
git clone [https://github.com/ysstbl/rag_assist.git](https://github.com/ysstbl/rag_assist.git)
cd rag_assist
```
##Environment Configuration
Create a .env file in the backend/ directory (and frontend/ if applicable):
```bash
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Vector Database Configuration (if using Pinecone / Cloud DB)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_env
PINECONE_INDEX_NAME=rag-assist-docs

# Server Configuration
PORT=8000
HOST=0.0.0.0
```
## Setup & Ingestion
Set up a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```
Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```
## Run the Ingestion Pipeline
Ingest your source documents into the vector database:
```bash
python ingestion.py
```
## Running the Application
Start the Backend API:
```bash
cd backend
python server.py
```
## Launch the Frontend:
In a new terminal window:
```bash
cd frontend
pip install -r requirements.txt
python -m streamlit run app.py
```
Open http://localhost:8501 (or your local frontend port) in your browser to interact with the assistant.
