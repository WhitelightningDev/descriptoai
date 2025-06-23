import { json } from '@remix-run/node'

export const action = async ({ request }: any) => {
  const { prompt } = await request.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const result = data.choices?.[0]?.message?.content
  return json({ result })
}
