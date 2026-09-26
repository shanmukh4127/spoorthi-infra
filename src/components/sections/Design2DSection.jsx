import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import TextLink from '../common/TextLink.jsx'
import TwoDVisual from './TwoDVisual.jsx'

function Design2DSection({ eyebrow, title, description, supporting, cta, brandVariant = 'neutral', visualLabel, children }) {
  return (
    <SectionWrapper id="2d-design" className={`two-d-section two-d-section--${brandVariant}`}>
      <PageContainer>
        <div className="two-d-section__layout">
          <div className="two-d-section__copy">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            {supporting && <p className="two-d-section__supporting type-label">{supporting}</p>}
            {cta && <TextLink to={cta.path} variant="arrow" className="two-d-section__link">{cta.label}</TextLink>}
            {children}
          </div>
          <TwoDVisual variant={brandVariant} label={visualLabel} />
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default Design2DSection
