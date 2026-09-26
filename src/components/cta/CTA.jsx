import { Link } from 'react-router-dom'

function CTA({ label, to, variant = 'primary', description, className = '' }) {
  return (
    <div className={['cta', `cta--${variant}`, className].filter(Boolean).join(' ')}>
      {description && <p className="type-body">{description}</p>}
      <Link className="ui-button ui-button--primary" to={to}>{label}</Link>
    </div>
  )
}

export default CTA
