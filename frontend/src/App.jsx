import React from 'react';
import { Bot, FileText, Search, ArrowRight, Network, Cpu, Workflow, Database } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Chat from './chat';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#FDFBF7] bg-grid-pattern text-slate-800 font-sans selection:bg-orange-200 selection:text-orange-900 relative overflow-x-hidden">

      {/* Decorative gradient orbs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-200/30 blur-[100px] z-0 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-amber-200/20 blur-[80px] z-0 pointer-events-none"></div>

      <nav className="relative z-10 mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/20">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Rag-assist</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-orange-600 transition-colors">How it Works</a>
          <a href="#docs" className="hover:text-orange-600 transition-colors">Documentation</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <FaGithub size={18} />
            Star on GitHub
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-orange-200/60 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            v1.0 Now Live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Ask your tech docs <br/>
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 relative inline-block pb-2">
              RAG-Assist
              <div className="absolute bottom-0 left-0 w-full h-3 bg-orange-200/50 -z-10 rounded-sm"></div>
            </span>
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A powerful chat interface that utilizes Retrieval-Augmented Generation (RAG) to instantly search, understand, and synthesize answers from leading technical documentation. Stop searching, start building.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-slate-900/20">
              Try Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-orange-50 text-slate-700 border border-slate-200 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 shadow-sm">
              <Bot size={20} className="text-orange-500" />
              View Demo
            </button>
          </div>

          <p className="text-sm text-slate-500 pt-4">
            No credit card required. Free tier includes 500 queries/month.
          </p>
        </div>

        <div className="mt-24 relative max-w-4xl mx-auto">
          <div className="absolute inset-0 -top-8 -bottom-8 bg-gradient-to-b from-orange-100/50 to-transparent blur-2xl rounded-[3rem] -z-10"></div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="bg-slate-50/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>
              <div className="mx-auto bg-white border border-slate-200 rounded-md px-32 py-1 text-xs text-slate-400 font-mono shadow-sm">
                rag-assist.dev/chat
              </div>
            </div>

            <div className="overflow-hidden">
              <Chat />
            </div>

          </div>
        </div>
      </main>

      <section id="how-it-works" className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Built on a Modern AI Stack</h2>
            <p className="text-slate-600 text-lg mb-10">
              RAG-Assist leverages a state-of-the-art Retrieval-Augmented Generation (RAG) pipeline to deliver instant, hallucination-free answers directly from the documentation.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2 hover:shadow-md transition-shadow">
                <Network size={18} className="text-blue-500" /> LangChain
              </span>
              <span className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2 hover:shadow-md transition-shadow">
                <span className="text-yellow-500 text-lg leading-none">🤗</span> Hugging Face
              </span>
              <span className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2 hover:shadow-md transition-shadow">
                <Workflow size={18} className="text-orange-500" /> Groq
              </span>
              <span className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm flex items-center gap-2 hover:shadow-md transition-shadow">
                <Cpu size={18} className="text-purple-500" /> Gemini Models
              </span>
            </div>
          </div>

          <div className="relative mt-16">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-orange-300 to-transparent z-0 opacity-60"></div>

            <div className="grid md:grid-cols-4 gap-10 relative z-10">
              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-[#FDFBF7]">1</div>
                  <FileText size={32} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Knowledge Ingestion</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Tech docs are fetched, parsed, and split into semantically meaningful chunks using <span className="font-semibold text-slate-700">LangChain</span>.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-[#FDFBF7]">2</div>
                  <Database size={32} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Vectorization</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Chunks are converted into high-dimensional embeddings via <span className="font-semibold text-slate-700">Hugging Face</span> and stored in a Vector DB.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-[#FDFBF7]">3</div>
                  <Search size={32} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Semantic Retrieval</h3>
                <p className="text-sm text-slate-600 leading-relaxed">User queries are embedded instantly to perform a similarity search, retrieving the exact necessary context.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg shadow-slate-400/30 flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm border-4 border-[#FDFBF7]">4</div>
                  <Bot size={32} className="text-orange-400 group-hover:text-orange-300 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Answer Generation</h3>
                <p className="text-sm text-slate-600 leading-relaxed"><span className="font-semibold text-slate-700">Gemini</span> synthesizes the context (accelerated by <span className="font-semibold text-slate-700">Groq</span>) into an accurate, fully cited response.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 bg-white/80 backdrop-blur-sm py-24 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powered by Advanced RAG Architecture</h2>
            <p className="text-slate-600">
              AgentFlow doesn't just guess. It actively retrieves context from verified documentation before generating an answer, ensuring high accuracy and zero hallucinations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Semantic Retrieval</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We vectorize technical documentation and use semantic search to find the exact paragraphs, code snippets, and APIs relevant to your query.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Bot size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Contextual Generation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A state-of-the-art LLM synthesizes the retrieved chunks into a coherent, easy-to-understand answer tailored specifically to your exact context.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verifiable Sources</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every answer comes with citations and direct links back to the original source material, so you can always verify the information or dive deeper.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-slate-50/90 backdrop-blur-sm py-12 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
               A
             </div>
             <span className="font-medium text-slate-700">Rag-Assist</span>
             <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
