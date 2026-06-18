import ChatInterface from '../components/ChatInterface'

export default function Ask() {
  return (
    <div className="space-y-5">
      <div className="ui-card rounded-3xl p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">Ask AI</h2>
        <p className="ui-muted mt-2">Ask in Tamil, English, or code-mixed speech/text with source-backed legal responses.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="chip px-3 py-1 rounded-full">Voice-enabled</span>
          <span className="chip px-3 py-1 rounded-full">Bilingual answers</span>
          <span className="chip px-3 py-1 rounded-full">Source citations</span>
        </div>
      </div>
      <ChatInterface />
    </div>
  )
}