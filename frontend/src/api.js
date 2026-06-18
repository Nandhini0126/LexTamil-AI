const API_URL = import.meta.env.VITE_API_URL || 'https://lextamil-ai-production.up.railway.app'

export async function askQuestion(query) {
  const res = await fetch(`${API_URL}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return res.json()
}