import { NavLink } from 'react-router-dom'
import PageContainer from './PageContainer.jsx'
import BrandIdentity from './BrandIdentity.jsx'
import { ArrowUpRight, ArrowUp } from 'lucide-react'
import { contactPlaceholder } from '../../data/shared/contact.js'

function Footer({ brand, navigation = [], config }) {
  const primaryCta = brand.primaryCta
  const exploreLinks = navigation.filter((item) => item.path !== primaryCta?.path)

  if (brand.id === 'spoorthi') return <footer className="spoorthi-footer"><PageContainer>
    <div className="spoorthi-footer__grid">
      <div className="spoorthi-footer__about"><NavLink to={brand.routeBase} aria-label="Spoorthi Infra home"><BrandIdentity brand={brand} /></NavLink><p>Thoughtful architecture.<br />Purposeful construction.<br />Spaces for what comes next.</p></div>
      <nav aria-label="Spoorthi Infra footer navigation"><h2>Explore Spoorthi</h2>{exploreLinks.map(item => <NavLink key={item.path} to={item.path} end={item.end}>{item.label}</NavLink>)}</nav>
      <div className="spoorthi-footer__contact"><h2>Let’s start a conversation</h2><p>Your next great space starts with an idea.</p>{contactPlaceholder.email && <a className="spoorthi-footer__email" href={`mailto:${contactPlaceholder.email}`}>{contactPlaceholder.email}</a>}<br /><NavLink className="spoorthi-footer__project" to={primaryCta.path}>Discuss your project <ArrowUpRight size={15} aria-hidden="true" /></NavLink></div>
    </div>
    <div className="spoorthi-footer__bottom"><span>© {new Date().getFullYear()} Spoorthi Infra. All rights reserved.</span><NavLink to="/tejes">Discover Tejes Interiors <ArrowUpRight size={12} aria-hidden="true" /></NavLink><a href="#main-content">Back to top <ArrowUp size={12} aria-hidden="true" /></a></div>
  </PageContainer></footer>

  return (
    <footer className={`brand-footer brand-footer--${brand.id}`}>
      <PageContainer>
        <div className="brand-footer__intro">
          <div>
            <p className="type-label">{brand.name}</p>
            <p className="type-body-large">{config.contactLabel}</p>
          </div>
          {primaryCta && <NavLink className="ui-button ui-button--secondary" to={primaryCta.path}>{primaryCta.label}</NavLink>}
        </div>
        <div className="brand-footer__grid">
          <nav aria-label={`${brand.name} footer navigation`}>
            <p className="type-label">Explore</p>
            {exploreLinks.map((item) => <NavLink key={item.path} end={item.end} to={item.path}>{item.label}</NavLink>)}
          </nav>
          <nav aria-label={`${brand.name} contact navigation`}>
            <p className="type-label">Contact</p>
            {primaryCta && <NavLink to={primaryCta.path}>{primaryCta.label}</NavLink>}
            {config.socialLinks?.filter((item) => item.href).map((item) => <a key={item.href} href={item.href} target="_blank" rel="noreferrer">{item.label}</a>)}
          </nav>
        </div>
        <div className="brand-footer__bottom">
          <span>© {new Date().getFullYear()} {brand.name}</span>
          <span>{config.legalLinks?.length ? config.legalLinks.map((item) => item.label).join(' · ') : 'All rights reserved'}</span>
        </div>
      </PageContainer>
    </footer>
  )
}

export default Footer
