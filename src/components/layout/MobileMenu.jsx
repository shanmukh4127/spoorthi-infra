import { NavLink } from 'react-router-dom'

function MobileMenu({ id, brandName, items = [], cta, onNavigate }) {
  return (
    <nav className="mobile-navigation__panel" id={id} aria-label={`${brandName} mobile navigation`}>
      {items.map((item) => <NavLink key={item.path} end={item.end} to={item.path} onClick={onNavigate}>{item.label}</NavLink>)}
      {cta && <NavLink className="mobile-navigation__cta" to={cta.path} onClick={onNavigate}>{cta.label}</NavLink>}
    </nav>
  )
}

export default MobileMenu
