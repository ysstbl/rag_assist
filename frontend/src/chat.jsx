import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React, { useState } from 'react';
import { Bot, Send, Lock, X } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [technology, setTechnology] = useState('React');
  const [isLoading, setIsLoading] = useState(false);

  // New state variables for tracking limits
  const [queryCount, setQueryCount] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Intercept the request if the limit is reached
    if (queryCount >= 1) {
      setShowSignIn(true);
      return;
    }

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setQueryCount((prev) => prev + 1); // Increment the query count

    try {
      const response = await fetch('https://fuzzy-capybara-g44jqrp69654cw6qv-8000.app.github.dev/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.content, technology: technology }),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error connecting to the backend. Is your FastAPI server running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white relative">
      {/* Settings Bar */}
      <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <span className="text-sm font-medium text-slate-600">Active Documentation:</span>
        <select
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg bg-white text-slate-700 py-1.5 px-3 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
        >
          <option value="React">React</option>
          <option value="CSS">CSS</option>
          <option value="JavaScript">JavaScript</option>
        </select>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20 text-sm">
            Ask a question about {technology} to get started!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-orange-100 text-orange-600'}`}>
                {msg.role === 'user' ? 'U' : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-none'}`}>

                {/* AI Markdown Formatting applied here */}
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({...props}) => <ul className="list-disc ml-6 my-3 space-y-1.5 marker:text-slate-400" {...props} />,
                      ol: ({...props}) => <ol className="list-decimal ml-6 my-3 space-y-1.5 marker:text-slate-400" {...props} />,
                      li: ({...props}) => <li className="pl-1" {...props} />,
                      strong: ({...props}) => <strong className="font-semibold text-slate-900" {...props} />,

                      // Tailwind Table Styling added here
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-4 rounded-lg border border-slate-200">
                          <table className="min-w-full text-left text-sm whitespace-nowrap" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-slate-50 border-b border-slate-200" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-3 font-semibold text-slate-800" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 text-slate-600 border-b border-slate-100" {...props} />,

                      // Keep your beautiful code blocks exactly as they were
                      code({inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <div className="my-4 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                            <div className="bg-slate-900 px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-700">
                              {match[1]}
                            </div>
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, padding: '1rem', fontSize: '0.875rem', background: '#0f172a' }}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code {...props} className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded-md font-mono text-xs">
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}

              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-tl-none animate-pulse">
              Searching {technology} docs and generating answer...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Ask about ${technology}...`}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
            disabled={isLoading || showSignIn}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || showSignIn}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center shadow-md shadow-orange-500/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Sign-In Overlay Modal */}
      {showSignIn && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full mx-4 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Sign in to continue</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              You have reached your free guest limit. Sign in or create a free account to unlock unlimited queries.
            </p>

            <div className="space-y-3">
              <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                Continue with GitHub
              </button>
              <button className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                Continue with Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
