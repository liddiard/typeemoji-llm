import s from './Background.module.css'

function Background() {
  return (
    <div className={s.gradients}>
      <div className={s.cyan}></div>
      <div className={s.yellow}></div>
      <div className={s.pink}></div>
    </div>
  )
}

export default Background
