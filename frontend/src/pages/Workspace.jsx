import { useEffect, useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import { API_URL } from '../api'

export default function Workspace() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const loadSessions = async () => {
    setLoading(true)
    setStatus('')
    try {
      const res = await fetch(`${API_URL}/api/workspace/sessions`)
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch {
      setStatus('Failed to load workspace sessions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const removeSession = async id => {
    try {
      await fetch(`${API_URL}/api/workspace/sessions/${id}`, { method: 'DELETE' })
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch {
      setStatus('Could not delete session.')
    }
  }

  const exportReport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/workspace/export`)
      const data = await res.json()
      const blob = new Blob([data.report || ''], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'lextamil-workspace-report.txt'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setStatus('Could not export workspace report.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="ui-card rounded-3xl p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">Workspace</h2>
        <p className="ui-muted mt-2">
          Store major outputs from Ask, Search, and Draft modules. Export your project report in one click.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={loadSessions} className="outline-btn px-4 py-2 rounded-xl">Refresh</button>
        <button onClick={exportReport} className="glow-btn px-4 py-2 rounded-xl inline-flex items-center gap-2">
          <Download size={16} /> Export Report
        </button>
      </div>

      {status && <div className="text-sm text-amber-300 bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3">{status}</div>}

      {loading && <div className="ui-muted">Loading workspace...</div>}
      {!loading && sessions.length === 0 && <div className="ui-muted">No saved modules yet.</div>}

      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="ui-card rounded-3xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-100">{session.title}</div>
                <div className="text-xs ui-muted mt-1">
                  {session.module} • {new Date(session.created_at).toLocaleString()}
                </div>
              </div>
              <button onClick={() => removeSession(session.id)} className="outline-btn px-2 py-1 rounded-lg inline-flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </button>
            </div>
            <div className="mt-3 text-sm text-slate-300">
              <div className="font-medium text-slate-200">Query / objective</div>
              <div>{session.query}</div>
            </div>
            <div className="mt-3 text-sm text-slate-300">
              <div className="font-medium text-slate-200">Output</div>
              <div className="whitespace-pre-wrap">{session.answer}</div>
            </div>
            {!!session.notes && (
              <div className="mt-3 text-xs ui-muted">Notes: {session.notes}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
