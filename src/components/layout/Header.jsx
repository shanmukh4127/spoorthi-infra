import { NavLink } from 'react-router-dom'
import DesktopNav from './DesktopNav.jsx'
import MobileNav from './MobileNav.jsx'

function Header({ brand, navigation = [], cta }) {
  return (
    <header className="brand-header">
      <div className="layout-container brand-header__inner">
        <NavLink className="brand-header__identity" to={brand.routeBase} aria-label={`${brand.name} home`}>
          <span className="type-label">{brand.name}</span>
        </NavLink>
        <DesktopNav brandName={brand.name} items={navigation} cta={cta} />
        <MobileNav brandName={brand.name} items={navigation} cta={cta} />
      </div>
    </header>
  )
}

export default Header
