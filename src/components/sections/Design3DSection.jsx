import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import TextLink from '../common/TextLink.jsx'
import ThreeDVisual from './ThreeDVisual.jsx'

function Design3DSection({ eyebrow, title, description, supporting, cta, brandVariant = 'neutral', visualLabel, children }) {
  return (
    <SectionWrapper id="3d-design" className={`three-d-section three-d-section--${brandVariant}`}>
      <PageContainer>
        <div className="three-d-section__layout">
          <ThreeDVisual variant={brandVariant} label={visualLabel} />
          <div className="three-d-section__copy">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            {supporting && <p className="three-d-section__supporting type-label">{supporting}</p>}
            {cta && <TextLink to={cta.path} variant="arrow" className="three-d-section__link">{cta.label}</TextLink>}
            {children}
          </div>
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default Design3DSection
