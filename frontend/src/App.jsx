import React from 'react';
import { ArrowUpRight, Bot, Braces, Check, CircleDot, Database, Layers3, Menu, Network, Sparkles, Terminal, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Chat from './chat';

const pipeline = [
  { icon: Database, label: 'Indexed docs', detail: 'React / CSS / JS' },
  { icon: Network, label: 'Semantic search', detail: 'Top-k retrieval' },
  { icon: Sparkles, label: 'Grounded answer', detail: 'Cited response' },
];

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="app-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Rag Assist home"><span className="brand-mark"><Braces size={16} strokeWidth={2.5} /></span><span>RAG<span className="brand-muted">/</span>ASSIST</span></a>
        <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#workspace" onClick={() => setMenuOpen(false)}>Workspace</a>
          <a href="#architecture" onClick={() => setMenuOpen(false)}>Architecture</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
        <div className="header-actions">
          <a className="github-link" href="https://github.com" target="_blank" rel="noreferrer"><FaGithub size={16} /> <span>Source</span></a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><CircleDot size={12} fill="currentColor" /> Live retrieval workspace</div>
            <h1><span className="title-line">Build with</span><span className="title-line title-line-accent"><em>better context.</em></span></h1>
            <p className="hero-lede">Ask technical documentation questions and get answers grounded in the source material, not a guess.</p>
            <div className="hero-meta"><span><Check size={14} /> Open knowledge base</span><span><Check size={14} /> Source-aware answers</span></div>
          </div>
          <div className="hero-aside"><span className="aside-label">What is this?</span><p>A focused RAG interface for moving from “I think I know” to “I can verify.”</p><a href="#architecture" className="text-link">See the pipeline <ArrowUpRight size={15} /></a></div>
        </section>

        <section id="workspace" className="workspace-section">
          <div className="section-heading"><div><span className="section-kicker">01 / Workspace</span><h2>Ask the docs.</h2></div><div className="status-pill"><span /> System ready</div></div>
          <div className="workspace-frame">
            <div className="frame-topbar"><div className="window-controls"><i /><i /><i /></div><div className="frame-path"><Terminal size={14} /> rag-assist / workspace</div><span className="frame-version">v1.0.0</span></div>
            <div className="workspace-intro"><div><span className="mono-label">CONTEXT ENGINE</span><h3>Your documentation, in conversation.</h3></div><p>Choose a source and ask something you would normally search for. The assistant will retrieve relevant context before it writes back.</p></div>
            <Chat />
          </div>
        </section>

        <section id="architecture" className="architecture-section">
          <div className="section-heading compact-heading"><div><span className="section-kicker">02 / Under the hood</span><h2>A small loop with a clear job.</h2></div><p className="section-note">Every answer starts with the source.</p></div>
          <div className="pipeline-grid">{pipeline.map(({ icon: Icon, label, detail }, index) => <article className="pipeline-step" key={label}><span className="step-number">0{index + 1}</span><div className="step-icon"><Icon size={20} /></div><h3>{label}</h3><p>{detail}</p>{index < pipeline.length - 1 && <ArrowUpRight className="step-arrow" size={18} />}</article>)}</div>
        </section>

        <section id="about" className="closing-section"><div className="closing-symbol"><Bot size={28} /></div><div><span className="section-kicker">Built for curious engineers</span><h2>Less hunting.<br /><em>More building.</em></h2></div><a className="round-link" href="#workspace" aria-label="Return to workspace"><ArrowUpRight size={22} /></a></section>
      </main>
      <footer className="site-footer"><span>RAG/ASSIST © 2026</span><span>Retrieval augmented, human directed.</span><span className="footer-stack"><Layers3 size={14} /> React · FastAPI · Chroma</span></footer>
    </div>
  );
}

export default App;
