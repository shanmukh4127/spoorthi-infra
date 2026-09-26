import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import FinalOutputVisual from './FinalOutputVisual.jsx'

function FinalOutputSection({ eyebrow, title, description, supporting, brandVariant = 'neutral', visualLabel, children }) {
  return (
    <SectionWrapper id="final-output" className={`final-output-section final-output-section--${brandVariant}`}>
      <PageContainer>
        <div className="final-output-section__layout">
          <div className="final-output-section__copy">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            {supporting && <p className="final-output-section__supporting type-label">{supporting}</p>}
            {children}
          </div>
          <FinalOutputVisual variant={brandVariant} label={visualLabel} />
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default FinalOutputSection
