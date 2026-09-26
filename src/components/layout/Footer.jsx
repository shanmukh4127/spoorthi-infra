import { NavLink } from 'react-router-dom'
import PageContainer from './PageContainer.jsx'

function Footer({ brand, navigation = [], config }) {
  const primaryCta = brand.primaryCta
  const exploreLinks = navigation.filter((item) => item.path !== primaryCta?.path)

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
