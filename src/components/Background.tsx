import s from './Background.module.css'
import cn from 'classnames'

interface BackgroundProps {
  loading: boolean
}

function Background({ loading }: BackgroundProps) {
  return (
    <div className={cn(s.gradients, { [s.loading]: loading })}>
      <div className={s.cyan}></div>
      <div className={s.yellow}></div>
      <div className={s.pink}></div>
    </div>
  )
}

export default Background
