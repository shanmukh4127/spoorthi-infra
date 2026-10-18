import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const presentation = {
  spoorthi: {
    logo: '/assets/spoorthi/brand/official-logo-600.webp',
    logoSet: '/assets/spoorthi/brand/official-logo-600.webp 600w, /assets/spoorthi/brand/official-logo-1200.webp 1200w',
    logoWidth: 600, logoHeight: 243,
    label: 'Building tomorrow',
    title: <>With Strength<br />and Structure</>,
    description: 'From concept to completion, we build spaces that stand the test of time.',
    cta: 'Explore Spoorthi',
    categories: ['Civil construction', 'Infrastructure', 'Commercial spaces'],
  },
  tejes: {
    logo: '/assets/gateway/tejes-original-600.webp',
    logoSet: '/assets/gateway/tejes-original-600.webp 600w, /assets/gateway/tejes-original-1200.webp 1200w',
    logoWidth: 600, logoHeight: 251,
    label: 'Spaces that inspire',
    title: <>Thoughtful Interiors<br />for Modern Living</>,
    description: 'We design beautiful, functional and personalised spaces that feel like home.',
    cta: 'Explore Tejes',
    categories: ['Residential', 'Commercial', 'Interior design'],
  },
}

function BrandPanel({ brand }) {
  const content = presentation[brand.id]
  return <Link className={`gateway-panel gateway-panel--${brand.id}`} id={`gateway-${brand.id}`} to={brand.routeBase} aria-label={content.cta}>
    <div className="gateway-panel__photograph" aria-hidden="true"><img className="gateway-panel__image" src="/assets/gateway/approved-background-1536.webp" srcSet="/assets/gateway/approved-background-1024.webp 1024w, /assets/gateway/approved-background-1536.webp 1536w" sizes="(max-width: 700px) 200vw, 100vw" alt="" width="1536" height="1024" fetchPriority="high" /></div>
    <img className="gateway-panel__logo" src={content.logo} srcSet={content.logoSet} sizes="(max-width: 700px) 156px, 184px" width={content.logoWidth} height={content.logoHeight} alt={brand.name} />
    <div className="gateway-panel__content">
      <div className="gateway-panel__heading"><p className="gateway-panel__industry">{content.label}</p><h2>{content.title}</h2></div>
      <p className="gateway-panel__descriptor">{content.description}</p>
      <span className="gateway-panel__cta">{content.cta}<ArrowRight size={18} strokeWidth={1.2} aria-hidden="true" /></span>
    </div>
    <ul className="gateway-panel__categories" aria-label={`${brand.name} focus areas`}>{content.categories.map(category => <li key={category}>{category}</li>)}</ul>
  </Link>
}
export default BrandPanel
