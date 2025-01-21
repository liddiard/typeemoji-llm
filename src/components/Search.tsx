import { useState } from 'react'
import Typewriter from 'typewriter-effect'
import cn from 'classnames'
import { baseUrl, searchExamples } from '../constants'
import s from './Search.module.css'

const timeFormat = (date: Date) =>
  new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)

interface SearchProps {
  loading: boolean
  setCopiedIndex: (index: number) => void
  setEmojis: (emojis: string[]) => void
  setLoading: (loading: boolean) => void
}

function Search({
  loading,
  setCopiedIndex,
  setEmojis,
  setLoading,
}: SearchProps) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setLoading(true)
    let response
    try {
      response = await fetch(`${baseUrl}/search?q=${query}`)
    } catch (error) {
      setError(`⚠️ Sorry, something went wrong. ${error}`)
      setLoading(false)
      return setEmojis([])
    }
    setLoading(false)
    const { headers } = response
    if (response.status === 429) {
      const retryAfter = headers.get('Retry-After')
      const retryString = retryAfter
        ? `after ${timeFormat(new Date(retryAfter))}`
        : 'later'
      setError(
        `🛑 Sorry, too many requests. In order to keep TypeEmoji free for everyone, please try again ${retryString}.`,
      )
      return setEmojis([])
    }
    const data = await response.json()
    setCopiedIndex(-1)
    setError('')
    return setEmojis(data.results)
  }

  const renderSearchDetails = () => {
    if (error) {
      return (
        <div className={s.error} role="alert">
          {error}
        </div>
      )
    }
    if (loading) {
      return (
        <span
          className={cn(
            s.loading,
            'animate__animated animate__infinite animate__pulse',
          )}
          aria-busy="true"
          aria-live="polite"
        >
          Thinking…
        </span>
      )
    }
    return (
      <>
        Try:{' '}
        <Typewriter
          options={{
            strings: searchExamples,
            autoStart: true,
            loop: true,
            // @ts-expect-error: `pauseFor` is missing from the `options` type
            // docs: https://www.npmjs.com/package/typewriter-effect
            pauseFor: 3000,
          }}
        />
      </>
    )
  }

  return (
    <div className={s.search}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
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
      <div className={s.searchDetails}>{renderSearchDetails()}</div>
    </div>
  )
}

export default Search
