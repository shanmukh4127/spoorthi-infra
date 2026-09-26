import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import CTA from '../cta/CTA.jsx'
import HeroVisual from './HeroVisual.jsx'

function HeroSection({ eyebrow, title, description, cta, visualVariant = 'neutral', visualLabel, children }) {
  return (
    <SectionWrapper id="hero" variant="hero" className={`hero-section hero-section--${visualVariant}`}>
      <PageContainer>
        <div className="hero-section__layout">
          <div className="hero-section__copy">
            <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
            {cta && <CTA label={cta.label} to={cta.path} className="hero-section__cta" />}
            {children}
          </div>
          <HeroVisual variant={visualVariant} label={visualLabel} />
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default HeroSection
