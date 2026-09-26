import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import TextLink from '../common/TextLink.jsx'
import VRExperienceVisual from './VRExperienceVisual.jsx'

function VRExperienceSection({ eyebrow, title, description, supporting, cta, brandVariant = 'neutral', visualLabel, children }) {
  return (
    <SectionWrapper id="vr-experience" className={`vr-experience-section vr-experience-section--${brandVariant}`}>
      <PageContainer>
        <div className="vr-experience-section__layout">
          <div className="vr-experience-section__copy">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            {supporting && <p className="vr-experience-section__supporting type-label">{supporting}</p>}
            {cta && <TextLink to={cta.path} variant="arrow" className="vr-experience-section__link">{cta.label}</TextLink>}
            {children}
          </div>
          <VRExperienceVisual variant={brandVariant} label={visualLabel} />
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default VRExperienceSection
