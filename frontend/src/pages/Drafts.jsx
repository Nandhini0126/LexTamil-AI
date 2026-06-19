import { useState } from 'react'
import { FileText, Save, Printer } from 'lucide-react'
import { API_URL } from '../api'

export default function Drafts() {
  const [scenario, setScenario] = useState('Consumer complaint')
  const [objective, setObjective] = useState('')
  const [keyFacts, setKeyFacts] = useState('')
  const [desiredRelief, setDesiredRelief] = useState('')
  const [language, setLanguage] = useState('english')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const generateDraft = async () => {
    if (!objective.trim() || !keyFacts.trim() || !desiredRelief.trim() || loading) return
    setLoading(true)
    setError('')
    setStatus('')
    try {
      const res = await fetch(`${API_URL}/api/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          objective: objective.trim(),
          key_facts: keyFacts.trim(),
          desired_relief: desiredRelief.trim(),
          language
        })
      })
      const data = await res.json()
      setDraft(data.draft || '')
    } catch {
      setError('Draft generation failed.')
      setDraft('')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = async () => {
    if (!draft.trim()) return
    try {
      const res = await fetch(`${API_URL}/api/workspace/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Draft: ${scenario}`,
          module: 'draft-assistant',
          query: objective,
          answer: draft,
          sources: [],
          notes: `Language: ${language}`
        })
      })
      const data = await res.json()
      setStatus(data.saved ? 'Draft saved to workspace.' : 'Could not save draft.')
    } catch {
      setStatus('Could not save draft.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="ui-card rounded-3xl p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">Draft Assistant</h2>
        <p className="ui-muted mt-2">
          Generate formal legal drafts and save them into your workspace in one click.
        </p>
      </div>

      <div className="ui-card rounded-3xl p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm ui-muted">Scenario</label>
            <input
              value={scenario}
              onChange={e => setScenario(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm ui-muted">Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-2"
            >
              <option value="english">English</option>
              <option value="tamil">Tamil</option>
              <option value="bilingual">Bilingual</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm ui-muted">Objective</label>
          <input
            value={objective}
            onChange={e => setObjective(e.target.value)}
            placeholder="What do you want this draft to achieve?"
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm ui-muted">Key facts</label>
          <textarea
            rows={5}
            value={keyFacts}
            onChange={e => setKeyFacts(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm ui-muted">Desired relief / request</label>
          <textarea
            rows={3}
            value={desiredRelief}
            onChange={e => setDesiredRelief(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-900/70 text-slate-100 px-3 py-2"
          />
        </div>

        <button onClick={generateDraft} disabled={loading} className="glow-btn px-5 py-2 rounded-xl disabled:opacity-40">
          {loading ? 'Generating...' : 'Generate draft'}
        </button>
      </div>

      {error && <div className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-2xl p-3">{error}</div>}
      {status && <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-3">{status}</div>}

      {draft && (
        <div className="ui-card rounded-3xl p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={saveDraft} className="outline-btn px-3 py-1.5 rounded-xl inline-flex items-center gap-2">
              <Save size={16} /> Save to workspace
            </button>
            <button onClick={() => window.print()} className="outline-btn px-3 py-1.5 rounded-xl inline-flex items-center gap-2">
              <Printer size={16} /> Print
            </button>
          </div>
          <div className="text-sm ui-muted mb-2 inline-flex items-center gap-2">
            <FileText size={16} /> Draft Output
          </div>
          <pre className="whitespace-pre-wrap text-slate-200 leading-7 font-sans">{draft}</pre>
        </div>
      )}
    </div>
  )
}
