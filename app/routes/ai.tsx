import { Form, useActionData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { useState } from 'react'

export const action = async ({ request }: any) => {
  const formData = await request.formData()
  const prompt = formData.get('prompt')

  // Derive full origin from the incoming request URL
  const url = new URL(request.url)
  const origin = `${url.protocol}//${url.host}`

  const response = await fetch(`${origin}/api/generate-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  const { result } = await response.json()
  return json({ result })
}

export default function AIPage() {
  const data = useActionData<typeof action>()
  const [loading, setLoading] = useState(false)

  return (
    <div
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <BrainIcon />
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28, color: '#111' }}>
          Generate Product Description
        </h2>
      </header>

      <Form
        method="post"
        onSubmit={() => setLoading(true)}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <textarea
          name="prompt"
          rows={5}
          placeholder="Enter product name or keywords..."
          required
          style={{
            fontSize: 16,
            padding: 14,
            borderRadius: 10,
            border: '1.5px solid #ccc',
            resize: 'vertical',
            fontFamily: "'Inter', sans-serif",
            transition: 'border-color 0.3s ease',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#3b82f6')}
          onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: loading ? '#a5b4fc' : '#4f46e5',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 10,
            border: 'none',
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            userSelect: 'none',
            transition: 'background-color 0.3s ease',
          }}
        >
          {loading && <SpinnerIcon />}
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </Form>

      {data?.result && (
        <section
          style={{
            marginTop: 32,
            padding: 20,
            backgroundColor: '#f9fafb',
            borderRadius: 10,
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
            fontSize: 16,
            lineHeight: 1.5,
            color: '#222',
            whiteSpace: 'pre-wrap',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#4f46e5' }}>
            <TextIcon />
            Generated Description
          </h3>
          <p>{data.result}</p>
        </section>
      )}
    </div>
  )
}

function BrainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#4f46e5"
      viewBox="0 0 24 24"
      width="32"
      height="32"
      aria-hidden="true"
    >
      <path d="M12 2a7 7 0 0 0-7 7v3a4 4 0 0 0 8 0v-3a3 3 0 0 1 3-3h1a4 4 0 0 1 0 8v1a7 7 0 0 0-7 7h8a7 7 0 0 0 0-14h-3a3 3 0 0 1-3-3V4a7 7 0 0 0-7-2z" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg
      style={{ animation: 'spin 1s linear infinite' }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#fff"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        strokeWidth="4"
        strokeOpacity="0.25"
        stroke="#fff"
        fill="none"
      />
      <path
        strokeWidth="4"
        strokeLinecap="round"
        stroke="#fff"
        d="M4 12a8 8 0 0 1 8-8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </svg>
  )
}

function TextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#4f46e5"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 10h12M4 14h8M4 18h16" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
