import { useCallback, useEffect, useState } from 'react'
import s from './App.module.css'
import Emoji from './components/Emoji'
import Background from './components/Background'

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
  const [copiedTimestamp, setCopiedTimestamp] = useState(0)

  const handleEmojiCopy = useCallback(
    (index: number) => {
      const emoji = emojis[index]
      if (!emoji) return
      // copy to clipboard
      navigator.clipboard.writeText(emoji)
      setCopiedIndex(index)
      setCopiedTimestamp(Date.now())
    },
    [emojis],
  )

  const handleKeydown = useCallback(
    (ev: KeyboardEvent) => {
      if (!emojis.length) return
      const number = parseInt(ev.key)
      if (isNaN(number)) return
      ev.preventDefault()
      const index = number === 0 ? 9 : number - 1
      handleEmojiCopy(index)
    },
    [emojis, handleEmojiCopy],
  )

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeydown)
    return () => {
      document.body.removeEventListener('keydown', handleKeydown)
    }
  }, [handleKeydown])

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
  }

  return (
    <>
      <div className={s.app}>
        <div className={s.intro}>
          <h1>
            <span className={s.emojiLeft}>✨</span>TypeEmoji
            <span className={s.emojiRight}>✨</span>
          </h1>
          <span className={s.subtitle}>
            Find the best emoji to represent a concept, powered by AI.
          </span>
        </div>
        <div className={s.search}>
          <form action={handleSubmit}>
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              name="query"
              required
              maxLength={100}
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button>🔎</button>
            <div className={s.backdrop} />
          </form>
          {error && (
            <span className={s.error} role="alert">
              {error}
            </span>
          )}
        </div>
        <div className={s.results}>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <div className={s.emojis}>
              {emojis.map((emoji, idx) => (
                <Emoji
                  key={emoji}
                  char={emoji}
                  index={idx}
                  handleCopy={handleEmojiCopy}
                  isCopied={idx === copiedIndex}
                  copiedTimestamp={copiedTimestamp}
                />
              ))}
            </div>
          )}
          {emojis.length > 0 && (
            <p className={s.instructions}>
              Type the number for an emoji to copy it to your clipboard.
            </p>
          )}
        </div>
      </div>
      <Background />
    </>
  )
}

export default App
