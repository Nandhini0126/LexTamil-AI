import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="ui-card rounded-[2rem] p-8 md:p-14 overflow-hidden relative">
        <div className="absolute -top-16 -right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <img
            src="/logo.jpg"
            alt="Lextamil AI"
            className="w-36 h-36 object-contain bg-white rounded-3xl p-3 shadow-lg"
          />
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full chip text-sm mb-4">
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">Lextamil AI</h1>
            <p className="text-xl text-slate-200 mb-6 leading-8">
              AI-powered Tamil legal assistant with voice, semantic retrieval, searchable sessions, and printable evidence-backed outputs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/ask" className="px-5 py-3 rounded-2xl glow-btn font-medium">
                Try Ask AI
              </Link>
              <Link to="/search" className="px-5 py-3 rounded-2xl outline-btn">
                Search Docs
              </Link>
              <Link to="/drafts" className="px-5 py-3 rounded-2xl outline-btn">
                Draft Assistant
              </Link>
              <Link to="/workspace" className="px-5 py-3 rounded-2xl outline-btn">
                Workspace
              </Link>
              <Link to="/about" className="px-5 py-3 rounded-2xl chip">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-5">
        <StatCard label="Voice input" value="Beta" />
        <StatCard label="Semantic search" value="✓" />
        <StatCard label="Source-backed answers" value="✓" />
        <StatCard label="Responsive UI" value="✓" />
      </section>

      <section className="grid md:grid-cols-3 gap-5">
        <div className="ui-card rounded-3xl p-6">
          <div className="font-semibold text-lg mb-2 text-slate-100">Voice + Text</div>
          <p className="ui-muted leading-7">Speak in Tamil or type code-mixed queries naturally.</p>
        </div>
        <div className="ui-card rounded-3xl p-6">
          <div className="font-semibold text-lg mb-2 text-slate-100">Smart Retrieval</div>
          <p className="ui-muted leading-7">Retrieves relevant sources using multilingual embeddings.</p>
        </div>
        <div className="ui-card rounded-3xl p-6">
          <div className="font-semibold text-lg mb-2 text-slate-100">Research + Print</div>
          <p className="ui-muted leading-7">Track search sessions, compare datasets, and export documents for reports.</p>
        </div>
      </section>
    </div>
  )
}