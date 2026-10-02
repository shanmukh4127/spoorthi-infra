import { PageContainer, SectionWrapper } from '../layout/index.js'
import Media from '../common/Media.jsx'
import TextLink from '../common/TextLink.jsx'
import { routePaths } from '../../data/routePaths.js'
import { tejesConceptMedia } from '../../data/tejes/studio.js'
import '../../styles/tejes-pages.css'

function TejesServicePage({ content }) {
  return <div className="tejes-detail-page">
    <SectionWrapper className="tejes-detail-intro"><PageContainer><div className="tejes-detail-split"><div><p className="type-label">{content.eyebrow}</p><h1>{content.title}</h1><p className="tejes-detail-lead">{content.description}</p><nav className="tejes-detail-actions" aria-label="Explore the service"><TextLink to={routePaths.tejes.contact} variant="arrow">Discuss your space</TextLink><TextLink to={content.secondLink.path} variant="arrow">{content.secondLink.label}</TextLink></nav></div><Media {...tejesConceptMedia} aspect="portrait" /></div></PageContainer></SectionWrapper>
    <SectionWrapper className="tejes-detail-services"><PageContainer><div className="tejes-detail-section-heading"><h2>{content.heading}</h2><p>{content.supporting}</p></div><div className="tejes-detail-grid">{content.items.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></PageContainer></SectionWrapper>
    <SectionWrapper className="tejes-detail-closing"><PageContainer><div><p className="type-label">Begin with your brief</p><h2>Your space. Your priorities.</h2><p>Tell us about the interior you have in mind and what you would like it to do for you.</p><TextLink to={routePaths.tejes.contact} variant="arrow">Start a conversation</TextLink></div></PageContainer></SectionWrapper>
  </div>
}
export default TejesServicePage
