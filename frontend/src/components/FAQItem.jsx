import { useState } from 'react'

export default function FAQItem({ faq }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left ui-card rounded-3xl p-5 mb-4"
    >
      <div className="font-semibold text-slate-100">{faq.question}</div>
      {open && <div className="mt-3 text-slate-300 leading-7">{faq.answer}</div>}
    </button>
  )
}