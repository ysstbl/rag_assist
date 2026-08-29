import os
import glob
import time
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

# Load environment variables (Make sure PINECONE_API_KEY is in your .env file)
load_dotenv()

if not os.getenv("PINECONE_API_KEY"):
    raise ValueError("PINECONE_API_KEY environment variable not set. Please add it to your .env file.")

# 1. Configure local directories (Adjust paths to your local folders)
DOC_CONFIGS = {
    "react": {
        "dir": "./react.dev",  
        "pattern": "**/*.md*",
        "max_files": 50         
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

# 4. Embeddings & Pinecone Upload
print("Loading local HuggingFace embeddings...")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

index_name = "tech-documentation" # Ensure this matches your Pinecone dashboard exactly
print(f"\nConnecting to Pinecone index '{index_name}'...")

vectorstore = PineconeVectorStore(
    index_name=index_name,
    embedding=embeddings
)

# Upload in batches to ensure reliable network payloads to Pinecone
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

        # Brief pause to respect rate limits on Pinecone's free tier
        time.sleep(1)

print("\n✅ Ingestion complete! Vectors successfully uploaded to Pinecone.")
