import { useCallback, useEffect, useState } from 'react'
import cn from 'classnames'

import s from './App.module.css'
import Emoji from './components/Emoji'
import Background from './components/Background'
import Search from './components/Search'
import { modifierKeys } from './constants'

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
      const number = parseInt(ev.key)
      if (
        !emojis.length ||
        isNaN(number) ||
        modifierKeys.some((key) => ev[key])
      ) {
        return
      }
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

  const renderInstructions = () => {
    if (loading || !emojis.length) {
      return null
    }
    return (
      <p className={cn(s.instructions, { [s.copied]: copied })}>
        {copied ? (
          <div className="animate__animated animate__bounceIn" role="alert">
            <span className={s.emoji}>{emojis[copiedIndex]}</span> copied to
            clipboard
          </div>
        ) : (
          <>Tap or type the number of an emoji to copy it to your clipboard.</>
        )}
      </p>
    )
  }

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
          {renderInstructions()}
        </div>
      </div>
      <Background loading={loading} />
      <footer className={s.footer}>
        Created by{' '}
        <a href="https://harrisonliddiard.com/project/typeemoji-llm/">
          Harrison Liddiard
        </a>
      </footer>
    </>
  )
}

export default App
