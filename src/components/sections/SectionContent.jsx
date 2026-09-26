import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'

function SectionContent({ id, eyebrow, title, description, children, variant = 'standard', headingAs = 'h2' }) {
  return (
    <SectionWrapper id={id} variant={variant}>
      <PageContainer>
        <SectionHeading as={headingAs} eyebrow={eyebrow} title={title} description={description} />
        {children && <div className="section-content__body">{children}</div>}
      </PageContainer>
    </SectionWrapper>
  )
}

export default SectionContent
