import { NavLink } from 'react-router-dom'
import { ArrowRightLeft, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import DesktopNav from './DesktopNav.jsx'
import MobileNav from './MobileNav.jsx'
import BrandIdentity from './BrandIdentity.jsx'
import { routePaths } from '../../data/routePaths.js'

function Header({ brand, navigation = [], cta }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const otherBrand = brand.id === 'spoorthi' ? { label: 'Tejes Interiors', path: '/tejes' } : { label: 'Spoorthi Infra', path: '/spoorthi' }
  const adminLink = brand.id === 'spoorthi' ? { label: 'Admin login', path: routePaths.admin } : null
  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 18)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])
  return (
    <header className={`brand-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="layout-container brand-header__inner">
        <NavLink className="brand-header__identity" to={brand.routeBase} aria-label={`${brand.name} home`}>
          <BrandIdentity brand={brand} />
        </NavLink>
        {adminLink && <NavLink className="brand-header__admin" to={adminLink.path}><LogIn size={14} aria-hidden="true" /><span>{adminLink.label}</span></NavLink>}
        <NavLink className="brand-header__switch" to={otherBrand.path}><ArrowRightLeft size={14} aria-hidden="true" /><span>Switch to {otherBrand.label}</span></NavLink>
        <DesktopNav brandName={brand.name} items={navigation} cta={cta} />
        <MobileNav brandName={brand.name} items={navigation} cta={cta} switchBrand={otherBrand} adminLink={adminLink} />
      </div>
    </header>
  )
}

export default Header
