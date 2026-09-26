import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import AboutVisual from './AboutVisual.jsx'

function AboutSection({ eyebrow, title, description, supporting, visualVariant = 'neutral', visualLabel, children }) {
  return (
    <SectionWrapper id="about" className={`about-section about-section--${visualVariant}`}>
      <PageContainer>
        <div className="about-section__layout">
          <div className="about-section__copy">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            {supporting && <p className="about-section__supporting type-label">{supporting}</p>}
            {children}
          </div>
          <AboutVisual variant={visualVariant} label={visualLabel} />
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default AboutSection
