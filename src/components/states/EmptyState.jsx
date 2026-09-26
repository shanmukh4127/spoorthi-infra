import { useId } from 'react'

function EmptyState({ title = 'Nothing here yet', description = 'There is no content to show right now.', action, icon = null, className = '' }) {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId} className={['state-message', 'empty-state', className].filter(Boolean).join(' ')}>
      {icon && <div aria-hidden="true" className="empty-state__icon">{icon}</div>}
      <h2 className="type-h3" id={titleId}>{title}</h2>
      <p className="type-body">{description}</p>
      {action && <div className="state-message__actions">{action}</div>}
    </section>
  )
}

export default EmptyState
