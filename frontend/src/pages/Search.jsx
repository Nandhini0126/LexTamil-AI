import { useEffect, useMemo, useState } from 'react'
import { Database, Printer, Sparkles, TimerReset } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import { API_URL } from '../api'

export default function Search() {
  const [results, setResults] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('score')
  const [categories, setCategories] = useState(['all'])
  const [datasets, setDatasets] = useState([])
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [searchSessions, setSearchSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const res = await fetch(`${API_URL}/api/datasets`)
        const data = await res.json()
        setCategories(data.categories || ['all'])
        setDatasets(data.datasets || [])
        setTotalDocuments(data.total_documents || 0)
      } catch {
        setError('Could not load dataset details.')
      }
    }
    loadDatasets()
  }, [])

  const search = async ({ query: searchQuery, category, topK }) => {
    setLoading(true)
    setError('')
    setQuery(searchQuery)
    try {
      const res = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, category, top_k: topK })
      })
      const data = await res.json()
      const nextResults = data.results || []
      setResults(nextResults)

      const session = {
        id: Date.now(),
        query: searchQuery,
        category,
        searchedAt: new Date().toLocaleString(),
        resultCount: nextResults.length,
        results: nextResults
      }
      setSearchSessions(prev => [session, ...prev].slice(0, 6))
      setActiveSessionId(session.id)
    } catch {
      setError('Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const displayedResults = useMemo(() => {
    const copy = [...results]
    if (sortBy === 'title') {
      copy.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === 'dataset') {
      copy.sort((a, b) => a.dataset.localeCompare(b.dataset))
    } else {
      copy.sort((a, b) => b.score - a.score)
    }
    return copy
  }, [results, sortBy])

  const highlight = text => {
    if (!query) return text
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'ig')
    const parts = String(text).split(regex)
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark key={i} className="bg-yellow-100 px-1 rounded">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  const printCurrentSession = () => {
    if (!searchSessions.length) return
    window.print()
  }

  const saveActiveSession = async () => {
    const active = searchSessions.find(s => s.id === activeSessionId) || searchSessions[0]
    if (!active) return
    try {
      await fetch(`${API_URL}/api/workspace/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Search: ${active.query.slice(0, 60)}`,
          module: 'search-session',
          query: active.query,
          answer: active.results.map(r => `${r.title}\n${r.content || r.snippet}`).join('\n\n---\n\n'),
          sources: active.results,
          notes: `Category: ${active.category}; Results: ${active.resultCount}`
        })
      })
      setError('')
    } catch {
      setError('Could not save active search session to workspace.')
    }
  }

  const openSession = session => {
    setResults(session.results)
    setQuery(session.query)
    setActiveSessionId(session.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">Smart Search</h2>
        <p className="ui-muted mt-2">
          Explore related legal datasets, track your search session, and print source documents in one click.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 print-hidden">
        <div className="ui-card rounded-3xl p-5">
          <div className="text-xs uppercase ui-muted">Datasets</div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{datasets.length}</div>
        </div>
        <div className="ui-card rounded-3xl p-5">
          <div className="text-xs uppercase ui-muted">Documents Indexed</div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{totalDocuments}</div>
        </div>
        <div className="ui-card rounded-3xl p-5">
          <div className="text-xs uppercase ui-muted">Search Sessions</div>
          <div className="text-2xl font-bold text-slate-100 mt-2">{searchSessions.length}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 print-hidden">
        {datasets.map(ds => (
          <div key={ds.dataset} className="ui-card rounded-3xl p-5">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <Database size={16} /> {ds.label}
            </div>
            <div className="text-sm text-slate-300 mt-2">{ds.description}</div>
            <div className="text-sm ui-muted mt-3">
              {ds.count} docs • categories: {ds.categories.join(', ')}
            </div>
          </div>
        ))}
      </div>

      <SearchBar onSearch={search} categories={categories} loading={loading} />

      <div className="print-hidden flex items-center justify-between ui-card rounded-3xl p-4">
        <div className="flex items-center gap-2 text-slate-200">
          <Sparkles size={17} /> Innovative search session mode enabled
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-slate-600 rounded-xl px-3 py-2 text-sm bg-slate-900/70 text-slate-200"
          >
            <option value="score">Sort by relevance</option>
            <option value="title">Sort by title</option>
            <option value="dataset">Sort by dataset</option>
          </select>
          <button
            onClick={printCurrentSession}
            disabled={!searchSessions.length}
            className="inline-flex items-center gap-2 glow-btn px-4 py-2 rounded-xl disabled:opacity-40"
          >
            <Printer size={16} /> Print session docs
          </button>
          <button
            onClick={saveActiveSession}
            disabled={!searchSessions.length}
            className="inline-flex items-center gap-2 outline-btn px-4 py-2 rounded-xl disabled:opacity-40"
          >
            Save to Workspace
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-2xl p-3 print-hidden">{error}</div>}

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="grid gap-4">
          {displayedResults.map((r, i) => (
            <div key={i} className="ui-card rounded-3xl p-5">
              <div className="font-semibold text-slate-100">{highlight(r.title)}</div>
              <div className="text-slate-300 mt-2 leading-7">{highlight(r.content || r.snippet)}</div>
              <div className="mt-3 text-sm ui-muted">
                {r.category} • {r.section} • {r.dataset} • score {r.score}
              </div>
            </div>
          ))}
        </div>

        <div className="ui-card rounded-3xl p-5 space-y-3 print-hidden">
          <div className="flex items-center gap-2 font-semibold text-slate-100">
            <TimerReset size={17} /> Search Sessions
          </div>
          {searchSessions.length === 0 && (
            <div className="text-sm ui-muted">No searches yet. Run a query to create a session.</div>
          )}
          {searchSessions.map(session => (
            <button
              key={session.id}
              onClick={() => openSession(session)}
              className={`w-full text-left rounded-2xl border px-3 py-3 transition ${
                activeSessionId === session.id
                  ? 'border-indigo-400/50 bg-indigo-500/10'
                  : 'border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div className="font-medium text-slate-100">{session.query}</div>
              <div className="text-xs ui-muted mt-1">
                {session.category} • {session.resultCount} docs • {session.searchedAt}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="print-only">
        <h2 className="text-2xl font-bold mb-3">Lextamil Search Session Documents</h2>
        {searchSessions.map(session => (
          <div key={session.id} className="mb-6">
            <div className="font-semibold">Query: {session.query}</div>
            <div className="text-sm mb-2">
              Category: {session.category} | Results: {session.resultCount} | Time: {session.searchedAt}
            </div>
            {session.results.map((doc, idx) => (
              <div key={idx} className="mb-3">
                <div className="font-medium">{doc.title}</div>
                <div>{doc.content || doc.snippet}</div>
                <div className="text-xs">
                  {doc.category} • {doc.section} • {doc.dataset} • score {doc.score}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}