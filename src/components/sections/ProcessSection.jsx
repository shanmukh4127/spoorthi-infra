import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import { ProcessStep } from '../cards/index.js'

function ProcessSection({ eyebrow, title, description, steps = [], brandVariant = 'neutral' }) {
  return (
    <SectionWrapper id="process" className={`process-section process-section--${brandVariant}`}>
      <PageContainer>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="process-section__sequence">
          {steps.map((step) => <ProcessStep key={step.id} step={step} />)}
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default ProcessSection
