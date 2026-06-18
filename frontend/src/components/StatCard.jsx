export default function StatCard({ label, value }) {
  return (
    <div className="ui-card rounded-3xl p-5">
      <div className="text-3xl font-bold text-slate-100">{value}</div>
      <div className="text-sm ui-muted mt-1">{label}</div>
    </div>
  )
}