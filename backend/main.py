import os
import traceback
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# LCEL Imports
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Database and LLM Imports
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq

# ==========================================
# --- 1. GLOBAL SETUP ---
# ==========================================

app = FastAPI(title="Tech Documentation RAG Backend")

# Enable CORS so your React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (great for local development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc.)
    allow_headers=["*"],  # Allows all headers
)

print("Loading local HuggingFace embeddings...")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

print("Connecting to Pinecone database...")
# Requires PINECONE_API_KEY environment variable in Render dashboard
vectorstore = PineconeVectorStore(
    index_name="tech-documentation",  # Replace with your actual Pinecone index name
    embedding=embeddings
)

print("Initializing Groq LLM...")
llm = ChatGroq(
    model="qwen/qwen3.6-27b", # Valid Groq model identifier
    temperature=0
)

# Helper function for LCEL
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


# ==========================================
# --- 2. FACTORY FUNCTION ---
# ==========================================
def build_rag_chain(active_tech: str):
    """Builds the LangChain pipeline dynamically based on the selected tech."""

    # NOTE: If your database doesn't have a 'technology' metadata key,
    # remove the 'filter' dictionary below so it searches all documents freely.
    retriever = vectorstore.as_retriever(
        search_kwargs={
            "k": 5
            # "filter": {"technology": active_tech.lower()} # Uncomment if your metadata uses this key
        }
    )

    template = """You are a highly knowledgeable and conversational senior {tech} developer.
        Using the provided documentation, explain the concept thoroughly and thoughtfully to the user.

        Follow these guidelines to sound like a natural, helpful AI assistant:
        1. Be comprehensive: Provide a deep, detailed explanation. Do not just give a brief summary. Walk the user through the 'what', 'why', and 'how' of their question.
        2. Conversational tone: Speak naturally, directly, and clearly, avoiding stiff textbook language.
        3. Clean structure: Organize your thoughts logically using short paragraphs. Use **bold text** to highlight key terms and make it easy to scan.
        4. Lists & Code: Use simple bullet points to break down multiple concepts, and always include code snippets in markdown if they help illustrate the point.
        5. Avoid heavy formatting: Do not use large markdown headers (like # or ##) or massive tables. Keep the visual flow smooth.
        6. Honesty: If the answer isn't in the context, politely say you don't have that information based on the docs.

        Context:
        {context}

        User Question: {question}"""

    prompt = PromptTemplate.from_template(template)

    rag_chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
            "tech": lambda x: active_tech.upper()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain


# ==========================================
# --- 3. API SCHEMAS & ENDPOINTS ---
# ==========================================
class ChatRequest(BaseModel):
    question: str
    technology: str = "React"  # Default fallback if not specified


@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "RAG API"}


# Streaming Endpoint
@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    try:
        print(f"\n[STREAM] Question: '{request.question}' | Tech: '{request.technology}'")
        chain = build_rag_chain(request.technology)

        async def token_generator():
            async for chunk in chain.astream(request.question):
                yield chunk

        return StreamingResponse(token_generator(), media_type="text/plain")

    except Exception as e:
        print("\n" + "!" * 50)
        print("ERROR IN /chat/stream:")
        traceback.print_exc()
        print("!" * 50 + "\n")
        raise HTTPException(status_code=500, detail=str(e))


# Standard Endpoint
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        print(f"\n[CHAT] Question: '{request.question}' | Tech: '{request.technology}'")
        chain = build_rag_chain(request.technology)
        response = await chain.ainvoke(request.question)
        return {"reply": response}

    except Exception as e:
        print("\n" + "!" * 50)
        print("ERROR IN /chat:")
        traceback.print_exc() 
        print("!" * 50 + "\n")
        raise HTTPException(status_code=500, detail=str(e))
