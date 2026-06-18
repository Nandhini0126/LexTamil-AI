export default function FormTemplate({ form }) {
  return (
    <div className="bg-white rounded-3xl shadow-soft p-5">
      <div className="font-semibold text-lg text-slate-900">{form.title}</div>
      <div className="text-sm text-slate-500 mb-3">{form.category}</div>
      <p className="text-slate-700 leading-7">{form.description}</p>
    </div>
  )
}