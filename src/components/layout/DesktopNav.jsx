import { TextLink } from '../common/index.js'

function DesktopNav({ brandName, items = [], cta }) {
  return (
    <nav className="brand-header__navigation" aria-label={`${brandName} primary navigation`}>
      {items.map((item) => <TextLink key={item.path} to={item.path} end={item.end} variant="navigation">{item.label}</TextLink>)}
      {cta && <TextLink to={cta.path} variant="arrow">{cta.label}</TextLink>}
    </nav>
  )
}

export default DesktopNav
