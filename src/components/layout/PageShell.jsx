import SkipLink from './SkipLink.jsx'

function PageShell({ header = null, footer = null, children, mainId = 'main-content', className = '' }) {
  return (
    <div className={['page-shell', className].filter(Boolean).join(' ')}>
      <SkipLink targetId={mainId} />
      {header}
      <main id={mainId} className="page-shell__main" tabIndex="-1">{children}</main>
      {footer}
    </div>
  )
}

export default PageShell
