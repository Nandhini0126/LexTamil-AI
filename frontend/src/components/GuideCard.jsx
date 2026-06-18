export default function GuideCard({ guide }) {
  return (
    <div className="bg-white rounded-3xl shadow-soft p-5">
      <div className="font-semibold text-lg text-slate-900">{guide.title}</div>
      <div className="text-sm text-slate-500 mb-3">{guide.category}</div>
      <p className="text-slate-700 leading-7">{guide.description}</p>
    </div>
  )
}