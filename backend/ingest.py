import os
import glob
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
# Remove this:
# from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Add this:
from langchain_huggingface import HuggingFaceEmbeddings

# Set your API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyB47A72Zbwq_yGB6daCQ2GXFSVEWv1EVQs"

# 1. Configure local directories (Adjust paths to your local folders)
DOC_CONFIGS = {
    "react": {
        "dir": "./react.dev",  # Update to your local path
        "pattern": "**/*.md*",
        "max_files": 50         # Limit for fast local ingestion
    },
    "css": {
        "dir": "./mdn-content/files/en-us/web/css",
        "pattern": "**/*.md",
        "max_files": 50
    },
    "javascript": {
        "dir": "./mdn-content/files/en-us/web/javascript",
        "pattern": "**/*.md",
        "max_files": 50
    },
}

# 2. Text Splitters
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "Header 1"), ("##", "Header 2"), ("###", "Header 3")],
    strip_headers=False
)

recursive_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", " ", ""]
)

# 3. Load & Process Documents
all_final_chunks = []

for tech_name, config in DOC_CONFIGS.items():
    docs_dir = config["dir"]
    if not os.path.exists(docs_dir):
        print(f"⚠️ Skipping {tech_name.upper()}: Directory '{docs_dir}' not found.")
        continue

    # Find matching files locally
    search_path = os.path.join(docs_dir, config["pattern"])
    matched_files = glob.glob(search_path, recursive=True)

    # Cap files for fast local ingestion
    selected_files = matched_files[:config["max_files"]]
    print(f"\n📂 Loading {len(selected_files)} files for {tech_name.upper()}...")

    tech_chunks = 0
    for file_path in selected_files:
        try:
            loader = TextLoader(file_path, encoding="utf-8")
            raw_docs = loader.load()

            for doc in raw_docs:
                header_splits = markdown_splitter.split_text(doc.page_content)
                chunks = recursive_splitter.split_documents(header_splits)

                for chunk in chunks:
                    chunk.metadata["source"] = file_path
                    chunk.metadata["technology"] = tech_name
                    all_final_chunks.append(chunk)
                    tech_chunks += 1
        except Exception as e:
            # Skip any unreadable or corrupted markdown files
            continue

    print(f"Generated {tech_chunks} chunks for {tech_name}.")

print(f"\nTotal chunks prepared across all technologies: {len(all_final_chunks)}")

# 4. Batch Embeddings to Cloud API
# Remove this:
# embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")

# Add this:
print("Loading local HuggingFace embeddings (No API limits!)...")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# --- ADD THIS INSTEAD ---
import time

DB_DIR = "./unified_tech_db"
print(f"\nInitializing Chroma database at {DB_DIR}...")
vectorstore = Chroma(
    collection_name="tech_documentation",
    embedding_function=embeddings,
    persist_directory=DB_DIR
)

# Upload in batches to avoid overwhelming the Google API
BATCH_SIZE = 100
total_batches = (len(all_final_chunks) + BATCH_SIZE - 1) // BATCH_SIZE

if len(all_final_chunks) == 0:
    print("Error: No chunks were created. Check your folder paths!")
else:
    for i in range(0, len(all_final_chunks), BATCH_SIZE):
        batch = all_final_chunks[i:i + BATCH_SIZE]
        batch_num = (i // BATCH_SIZE) + 1

        print(f"Uploading batch {batch_num}/{total_batches} ({len(batch)} chunks)...")
        vectorstore.add_documents(batch)

        # Pause for 2 seconds between batches to respect Google's rate limits
        time.sleep(2)

print("\n✅ Ingestion complete! Database saved successfully.")
