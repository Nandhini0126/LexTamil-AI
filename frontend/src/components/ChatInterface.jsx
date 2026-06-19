import { useState } from 'react'
import { Send } from 'lucide-react'
import VoiceInput from './VoiceInput'
import LoadingDots from './LoadingDots'
import SourceCard from './SourceCard'
import { API_URL } from '../api'

export default function ChatInterface() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const saveToWorkspace = async message => {
    try {
      await fetch(`${API_URL}/api/workspace/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Ask: ${message.query.slice(0, 60)}`,
          module: 'ask-ai',
          query: message.query,
          answer: message.answer,
          sources: message.sources || []
        })
      })
    } catch (err) {
      console.error('Save to workspace failed:', err)
    }
  }

  const ask = async () => {
    // guard: no empty queries, and no overlapping requests while one is in flight
    if (!query.trim() || loading) return
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          query,
          answer: data.answer || 'No answer returned.',
          sources: data.sources || []
        }
      ])
      setQuery('')
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          query,
          answer: 'Sorry, the server could not answer right now.',
          sources: []
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl shadow-soft p-4 md:p-5 flex gap-3 items-center">
        <VoiceInput onText={setQuery} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && ask()}
          placeholder="Ask in Tamil / English / code-mixed..."
          className="flex-1 outline-none bg-transparent text-base md:text-lg px-1 text-slate-100 placeholder:text-slate-500"
        />
        <button
          onClick={ask}
          disabled={loading || !query.trim()}
          className="h-12 px-4 rounded-2xl glow-btn flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={18} /> Ask
        </button>
      </div>

      <div className="text-xs ui-muted leading-6">
        This tool provides informational answers only. It is not legal advice.
      </div>

      {loading && (
        <div className="ui-card rounded-3xl p-5">
          <LoadingDots />
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="ui-card rounded-3xl p-5 md:p-6">
            <div className="text-sm ui-muted mb-2">Your question</div>
            <div className="font-semibold text-slate-100 mb-5">{m.query}</div>
            <div className="text-sm ui-muted mb-2">Answer</div>
            <div className="whitespace-pre-wrap leading-7 text-slate-200">{m.answer}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="text-sm px-3 py-1.5 rounded-xl outline-btn">Print / Save as PDF
            </button>
            <button
              onClick={() => saveToWorkspace(m)}
              className="text-sm px-3 py-1.5 rounded-xl outline-btn">Save to Workspace
            </button>
          </div>
            {m.sources?.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="text-sm font-semibold text-slate-200">Sources</div>
                <div className="grid md:grid-cols-2 gap-3">
                  {m.sources.map((s, idx) => (
                    <SourceCard key={idx} source={s} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
