import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches unhandled render errors anywhere in the child tree and renders a
 * fallback message instead of crashing the whole app with a white screen.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <p role="alert" style={{ textAlign: 'center', padding: '2rem' }}>
          ⚠️ Sorry, something went wrong. Please refresh the page.
        </p>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
