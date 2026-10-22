import { useState } from 'react'

const TASK_TYPES = [
  { value: 'summarize', label: 'Summarize' },
  { value: 'sentiment', label: 'Sentiment analysis' },
  { value: 'keypoints', label: 'Extract key points' },
  { value: 'tone', label: 'Tone check' },
  { value: 'rewrite', label: 'Rewrite for clarity' },
]

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10" role="status" aria-live="polite">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
      <p className="text-sm text-slate-500">Analyzing with AI…</p>
    </div>
  )
}

function mockAnalysis(text, taskType) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const preview = text.trim().slice(0, 140)
  const labels = Object.fromEntries(TASK_TYPES.map((t) => [t.value, t.label]))

  if (taskType === 'summarize') {
    return `Summary of ${words.length} words:\n\n${preview}${text.trim().length > 140 ? '…' : ''}\n\nThe passage focuses on the ideas above and can be condensed into a short briefing for a reader who needs the gist quickly.`
  }
  if (taskType === 'sentiment') {
    return `Overall sentiment: Neutral-to-positive.\n\nWord count: ${words.length}. The language does not show strong negative markers. A closer review would look at adjectives, intensifiers, and any hedging around claims.`
  }
  if (taskType === 'keypoints') {
    return `Key points\n\n• Length: ${words.length} words\n• Opening: ${preview}${text.trim().length > 140 ? '…' : ''}\n• Suggested next step: group related sentences and turn each cluster into one bullet.`
  }
  if (taskType === 'tone') {
    return `Tone: Professional and even.\n\nThe writing stays relatively measured. Watch for long sentences and passive constructions if you want a more direct voice.`
  }
  return `Clarity rewrite (${labels[taskType]})\n\n${text.trim()}\n\nSuggested direction: keep the same meaning, shorten clauses, and lead with the main claim in the first sentence.`
}

export default function App() {
  const [text, setText] = useState('')
  const [taskType, setTaskType] = useState(TASK_TYPES[0].value)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  function handleAnalyze(event) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      setError('Paste some text before analyzing.')
      setResult('')
      return
    }

    setError('')
    setLoading(true)
    setResult('')

    window.setTimeout(() => {
      setResult(mockAnalysis(trimmed, taskType))
      setLoading(false)
    }, 1400)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Text Analyzer</p>
            <h1 className="mt-0.5 text-lg font-semibold text-slate-900 sm:text-xl">Analyze with AI</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Demo
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <form onSubmit={handleAnalyze} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Paste text</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="Paste the text you want to analyze…"
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Task type</span>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
              }}
            >
              {TASK_TYPES.map((task) => (
                <option key={task.value} value={task.value}>
                  {task.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-indigo-400 sm:w-auto"
          >
            Analyze with AI
          </button>
        </form>

        {error ? (
          <p className="mt-4 text-sm text-rose-600" role="alert">
            {error}
          </p>
        ) : null}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">Results</h2>
            <span className="text-xs text-slate-400">
              {loading ? 'In progress' : result ? 'Ready' : 'Waiting'}
            </span>
          </div>
          <div className="min-h-[10rem] rounded-xl bg-slate-50 px-4 py-3">
            {loading ? (
              <Spinner />
            ) : result ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{result}</pre>
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">
                Results will appear here after you analyze a passage.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
