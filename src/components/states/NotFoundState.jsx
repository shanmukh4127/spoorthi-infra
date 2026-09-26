import { Link } from 'react-router-dom'

function NotFoundState({ homePath, homeLabel = 'Return home' }) {
  return (
    <section aria-labelledby="not-found-title" className="state-message not-found-state">
      <p className="type-label">404</p>
      <h1 className="type-h1" id="not-found-title">Page not found</h1>
      <p className="type-body-large">The requested page could not be found.</p>
      <div className="state-message__actions">
        {homePath && <Link className="ui-button ui-button--primary" to={homePath}>{homeLabel}</Link>}
        <Link className="ui-button ui-button--secondary" to="/">Choose a brand</Link>
      </div>
    </section>
  )
}

export default NotFoundState
