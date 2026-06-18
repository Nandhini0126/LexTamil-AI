import { Link, NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const links = [
  ['/', 'Home'],
  ['/ask', 'Ask AI'],
  ['/search', 'Search'],
  ['/drafts', 'Drafts'],
  ['/workspace', 'Workspace'],
  ['/faq', 'FAQ'],
  ['/about', 'About']
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Lextamil AI logo"
            className="h-11 w-11 rounded-2xl object-contain bg-white p-1.5 shadow"
          />
          <div>
            <div className="font-bold tracking-wide text-lg text-slate-100">Lextamil AI</div>
            <div className="text-xs text-cyan-300/80 flex items-center gap-1">
              <Sparkles size={12} /> Legal Intelligence Studio
            </div>
          </div>
        </Link>

        <nav className="flex gap-2 overflow-x-auto">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}