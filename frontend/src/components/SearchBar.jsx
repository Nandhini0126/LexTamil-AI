import { useEffect, useState } from 'react'

export default function SearchBar({ onSearch, categories = ['all'], loading = false }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [topK, setTopK] = useState(6)

  useEffect(() => {
    if (!categories.includes(cat)) {
      setCat('all')
    }
  }, [categories, cat])

  const submit = () => {
    if (!q.trim() || loading) return
    onSearch({ query: q.trim(), category: cat, topK })
  }

  return (
    <div className="glass rounded-3xl shadow-soft p-4 md:p-5 space-y-4 print-hidden">
      <div className="flex gap-3">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Search documents..."
          className="flex-1 border border-slate-600 rounded-2xl px-4 py-3 bg-slate-900/70 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={topK}
          onChange={e => setTopK(Number(e.target.value))}
          className="border border-slate-600 rounded-2xl px-3 py-3 bg-slate-900/70 text-slate-200"
        >
          {[3, 6, 9].map(count => (
            <option key={count} value={count}>
              Top {count}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          disabled={loading || !q.trim()}
          className="glow-btn px-5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              cat === c ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40' : 'chip hover:bg-slate-800/70'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}