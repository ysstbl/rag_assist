import os
import chainlit as cl
from chainlit.input_widget import Select

# LCEL Imports
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Database and LLM Imports
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq

# ==========================================
# --- 1. GLOBAL SETUP (LOAD ONLY) ---
# ==========================================
# Replace this with your actual Groq API key (or set it in your environment variables)
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

print("Loading local HuggingFace embeddings...")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

print("Loading existing Chroma database...")
DB_DIR = "./unified_tech_db"
vectorstore = Chroma(
    collection_name="tech_documentation",
    embedding_function=embeddings,
    persist_directory=DB_DIR
)

print("Initializing Groq LLM...")
# Using Llama 3 for insanely fast text generation
llm = ChatGroq(model_name="openai/gpt-oss-20b", temperature=0)

# Helper function for LCEL
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


# ==========================================
# --- 2. FACTORY FUNCTION ---
# ==========================================
def build_rag_chain(active_tech: str):
    """Builds the LangChain pipeline dynamically based on the selected tech."""

    # The retriever only looks at chunks matching the selected technology
    retriever = vectorstore.as_retriever(
        search_kwargs={
            "k": 10,
            "filter": {"technology": active_tech.lower()}
        }
    )

    template = """You are a senior {tech} developer and an expert teacher.
    Use the following pieces of retrieved documentation to answer the user's question completely and thoroughly.

    1. If the answer contains rules, steps, or multiple concepts, use bullet points to break them down.
    2. Provide a detailed explanation of WHY those rules exist based on the context.
    3. If the context contains code examples, include them in your answer using proper markdown formatting.
    4. If you cannot find the answer in the provided documentation, say 'I don't know based on the provided documentation.'
    5. Never hallucinate code or rules that are not in the context.

    Context:
    {context}

    User Question: {question}"""

    prompt = PromptTemplate.from_template(template)

    # Build the LCEL Chain
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
# --- 3. CHAINLIT UI LOGIC ---
# ==========================================
@cl.on_chat_start
async def start():
    # 1. Ask the user to pick a technology as soon as they open the app
    actions = [
        cl.Action(name="tech_select", payload={"value": "React"}, label="⚛️ React"),
        cl.Action(name="tech_select", payload={"value": "CSS"}, label="🎨 CSS"),
        cl.Action(name="tech_select", payload={"value": "JavaScript"}, label="📜 JavaScript")
    ]

    res = await cl.AskActionMessage(
        content="Welcome! Which framework or language documentation would you like to query? *(You can change this later in Settings)*",
        actions=actions,
        timeout=300
    ).send()

    # 2. Process their choice
    if res and res.get("payload"):
        selected_tech = res.get("payload").get("value")

        # 3. Initialize the Settings panel with their choice
        techs = ["React", "CSS", "JavaScript"]
        await cl.ChatSettings(
            [Select(id="active_tech", label="Active Technology", values=techs, initial_index=techs.index(selected_tech))]
        ).send()

        # 4. Build the RAG chain and save it to their session
        rag_chain = build_rag_chain(selected_tech)
        cl.user_session.set("chain", rag_chain)
        cl.user_session.set("active_tech", selected_tech)

        await cl.Message(content=f"✅ **{selected_tech}** RAG pipeline loaded! What would you like to know?").send()

@cl.on_settings_update
async def setup_agent(settings):
    # This runs whenever the user changes the dropdown in the UI settings panel
    new_tech = settings["active_tech"]

    # Rebuild the chain for the new tech
    new_rag_chain = build_rag_chain(new_tech)
    cl.user_session.set("chain", new_rag_chain)
    cl.user_session.set("active_tech", new_tech)

    await cl.Message(
        content=f"🔄 Technology dynamically switched to **{new_tech}**! Future queries will use this context."
    ).send()

@cl.on_message
async def main(message: cl.Message):
    # 1. Fetch the active chain from memory
    chain = cl.user_session.get("chain")

    if not chain:
        await cl.Message(content="Please refresh the page and select a technology first.").send()
        return

    # 2. Create an empty message placeholder in the UI
    msg = cl.Message(content="")
    await msg.send()

    # 3. Stream the response directly from the LCEL chain into the UI
    # We use astream() to pull the text out chunk-by-chunk
    async for chunk in chain.astream(message.content):
        await msg.stream_token(chunk)

    # 4. Finalize the message when done
    await msg.update()

    # Execute the chain!
    await chain.ainvoke(message.content, config=config)
