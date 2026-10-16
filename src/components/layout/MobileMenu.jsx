import { NavLink } from 'react-router-dom'

function MobileMenu({ id, brandName, items = [], cta, switchBrand, adminLink, onNavigate }) {
  return (
    <nav className="mobile-navigation__panel" id={id} aria-label={`${brandName} mobile navigation`}>
      {items.map((item) => <NavLink key={item.path} end={item.end} to={item.path} onClick={onNavigate}>{item.label}</NavLink>)}
      {adminLink && <NavLink className="mobile-navigation__admin" to={adminLink.path} onClick={onNavigate}>{adminLink.label}</NavLink>}
      {switchBrand && <NavLink className="mobile-navigation__switch" to={switchBrand.path} onClick={onNavigate}>Switch to {switchBrand.label}</NavLink>}
      {cta && <NavLink className="mobile-navigation__cta" to={cta.path} onClick={onNavigate}>{cta.label}</NavLink>}
    </nav>
  )
}

export default MobileMenu
