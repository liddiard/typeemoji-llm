import s from './Emoji.module.css'
import cn from 'classnames'

interface EmojiProps {
  char: string
  index: number
  isCopied: boolean
  handleCopy: (index: number) => void
}

function Emoji({ char, index, isCopied, handleCopy }: EmojiProps) {
  return (
    <div
      className={cn(s.emoji, { [s.copied]: isCopied })}
      onClick={() => handleCopy(index)}
    >
      {char}
      <kbd>{index === 9 ? 0 : index + 1}</kbd>
    </div>
  )
}

export default Emoji
