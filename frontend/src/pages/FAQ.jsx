import FAQItem from '../components/FAQItem'

export default function FAQ() {
  const faqs = [
    {
      question: 'How do I file a consumer complaint?',
      answer: 'Collect receipts and documents, draft a complaint, and submit it to the proper commission.'
    },
    {
      question: 'Can I ask in Tamil?',
      answer: 'Yes. Tamil, English, and code-mixed input are supported.'
    }
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold gradient-text">FAQ</h2>
        <p className="ui-muted mt-2">Common questions answered instantly.</p>
      </div>
      {faqs.map((f, i) => (
        <FAQItem key={i} faq={f} />
      ))}
    </div>
  )
}