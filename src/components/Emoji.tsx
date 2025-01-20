import { useEffect, useRef } from 'react'
import s from './Emoji.module.css'
import cn from 'classnames'

interface EmojiProps {
  char: string
  index: number
  isCopied: boolean
  copiedTimestamp: number
  handleCopy: (index: number) => void
}

function Emoji({
  char,
  index,
  isCopied,
  handleCopy,
  copiedTimestamp,
}: EmojiProps) {
  const emojiRef = useRef<HTMLDivElement>(null)

  // if the copied emoji is the same but the timestamp is different, the user
  // has recopied this emoji. replay the animation to give UI feedback
  useEffect(() => {
    if (isCopied) {
      const animation = emojiRef.current?.getAnimations()[0]
      animation?.cancel()
      animation?.play()
    }
  }, [isCopied, copiedTimestamp])

  return (
    <div
      className={cn(s.emoji, 'animate__animated', {
        [s.copied]: isCopied,
        animate__heartBeat: isCopied,
      })}
      onClick={() => handleCopy(index)}
      ref={emojiRef}
    >
      {char}
      {isCopied ? (
        <span className={s.copied}>✅</span>
      ) : (
        <kbd>{index === 9 ? 0 : index + 1}</kbd>
      )}
    </div>
  )
}

export default Emoji
