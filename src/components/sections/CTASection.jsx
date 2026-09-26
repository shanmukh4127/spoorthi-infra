import CTA from '../cta/CTA.jsx'
import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import { TextLink } from '../common/index.js'

function CTASection({ eyebrow, title, description, label, to, secondary, brandVariant = 'neutral' }) {
  return (
    <SectionWrapper id="cta" className={`final-cta final-cta--${brandVariant}`}>
      <PageContainer>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="final-cta__actions">
          <CTA label={label} to={to} className="final-cta__primary" />
          {secondary && <TextLink to={secondary.path} variant="arrow" className="final-cta__secondary">{secondary.label}</TextLink>}
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default CTASection
