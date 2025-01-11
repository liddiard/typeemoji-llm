import { useRef, useState } from 'react'
import s from './App.module.css'
import Emoji from './components/Emoji'

const timeFormat = (date: Date) =>
  new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)

function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emojis, setEmojis] = useState([])
  const [copiedIndex, setCopiedIndex] = useState(-1)

  const emojisRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async () => {
    let response
    setLoading(true)
    try {
      response = await fetch(`http://localhost:8080/search?q=${query}`)
    } catch (error) {
      setError(`Sorry, something went wrong. ${error}`)
      setLoading(false)
      return
    }
    const { headers } = response
    if (response.status === 429) {
      const retryAfter = headers.get('Retry-After')
      const retryString = retryAfter
        ? `after ⏰ ${timeFormat(new Date(retryAfter))}`
        : 'later'
      setError(
        `✋ Sorry, too many requests! I’m glad you find TypeEmoji useful, but to keep it free for everyone, please try again ${retryString}.`,
      )
      return
    }
    const data = await response.json()
    setLoading(false)
    setCopiedIndex(-1)
    setEmojis(data.results)
    emojisRef.current?.focus()
  }

  const handleKeydown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    ev.preventDefault()
    const number = Number(ev.key)
    if (isNaN(number)) return
    const index = number === 0 ? 9 : number - 1
    handleEmojiCopy(index)
  }

  const handleEmojiCopy = (index: number) => {
    const emoji = emojis[index]
    if (!emoji) return
    // copy to clipboard
    navigator.clipboard.writeText(emoji)
    setCopiedIndex(index)
  }

  return (
    <div className={s.app}>
      <h1>✨TypeEmoji✨</h1>
      <span className={s.subtitle}>
        Find the best emoji to represent a concept, powered by AI.
      </span>
      <div className={s.searchWrapper}>
        <form action={handleSubmit} className={s.search}>
          <input
            type="text"
            placeholder="Search..."
            name="query"
            required
            maxLength={100}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>🔎</button>
        </form>
        {error ? (
          <span className={s.error} role="alert">
            {error}
          </span>
        ) : (
          <span className={s.examples}>
            Try searches like: growth, danger, love, confusion, nutrition,
            anime, meditation
          </span>
        )}
      </div>
      <div
        className={s.emojis}
        tabIndex={0}
        onKeyDown={handleKeydown}
        ref={emojisRef}
      >
        {emojis.map((emoji, idx) => (
          <Emoji
            key={emoji}
            char={emoji}
            index={idx}
            handleCopy={handleEmojiCopy}
            isCopied={idx === copiedIndex}
          />
        ))}
      </div>
      <div className={s.bgGradient} />
      {emojis.length > 0 && (
        <span>Type the number for an emoji to copy it to your clipboard.</span>
      )}
    </div>
  )
}

export default App
