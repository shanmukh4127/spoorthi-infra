import { useId } from 'react'
import { Button } from '../common/index.js'

function ErrorState({ title = 'Something went wrong', message = 'This content is temporarily unavailable.', onRetry, secondaryAction, className = '' }) {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId} className={['state-message', 'error-state', className].filter(Boolean).join(' ')} role="alert">
      <p className="type-label">Error</p>
      <h2 className="type-h3" id={titleId}>{title}</h2>
      <p className="type-body">{message}</p>
      {(onRetry || secondaryAction) && (
        <div className="state-message__actions">
          {onRetry && <Button onClick={onRetry}>Try again</Button>}
          {secondaryAction}
        </div>
      )}
    </section>
  )
}

export default ErrorState
