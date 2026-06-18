export default function SourceCard({ source }) {
  return (
    <div className="rounded-2xl ui-card p-4">
      <div className="font-semibold text-slate-100">{source.title}</div>
      <div className="text-xs ui-muted mt-1">
        {source.category} • {source.section} • score {source.score}
      </div>
      <p className="text-sm text-slate-300 mt-3 leading-6">{source.content}</p>
    </div>
  )
}