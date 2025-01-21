import { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'

import s from './App.module.css'
import Emoji from './components/Emoji'
import Background from './components/Background'
import Search from './components/Search'

function App() {
  const [copiedIndex, setCopiedIndex] = useState(-1)
  const [copiedTimestamp, setCopiedTimestamp] = useState(0)
  const [emojis, setEmojis] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

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

  const copied = copiedIndex !== -1
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
        <Search
          setCopiedIndex={setCopiedIndex}
          setEmojis={setEmojis}
          setLoading={setLoading}
        />
        <div className={s.results}>
          {!loading && (
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
          {!loading && emojis.length > 0 && (
            <p className={cn(s.instructions, { [s.copied]: copied })}>
              {copied
                ? `Copied to clipboard: ${emojis[copiedIndex]}`
                : 'Tap or type the number of an emoji to copy it to your clipboard.'}
            </p>
          )}
        </div>
      </div>
      <Background loading={loading} />
      <div className={s.footer}>
        Created by <a href="https://harrisonliddiard.com">Harrison Liddiard</a>
      </div>
    </>
  )
}

export default App
