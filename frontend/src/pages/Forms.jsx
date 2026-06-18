import FormTemplate from '../components/FormTemplate'

export default function Forms() {
  const forms = [
    {
      title: 'Rent Agreement Template',
      category: 'property',
      description: 'A clean sample rent agreement format.'
    },
    {
      title: 'Consumer Complaint Format',
      category: 'consumer',
      description: 'A simple complaint draft for filing.'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">Forms</h2>
        <p className="text-slate-600 mt-2">Useful legal-style templates for your demo website.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {forms.map((f, i) => (
          <FormTemplate key={i} form={f} />
        ))}
      </div>
    </div>
  )
}