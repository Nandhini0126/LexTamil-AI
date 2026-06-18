import GuideCard from '../components/GuideCard'

export default function Guides() {
  const guides = [
    {
      title: 'How to File a Consumer Complaint',
      category: 'consumer',
      description: 'Step-by-step filing guide.'
    },
    {
      title: 'Property Purchase Checklist',
      category: 'property',
      description: 'Important checks before buying property.'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">Guides</h2>
        <p className="text-slate-600 mt-2">Interactive step-by-step guidance for common situations.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {guides.map((g, i) => (
          <GuideCard key={i} guide={g} />
        ))}
      </div>
    </div>
  )
}