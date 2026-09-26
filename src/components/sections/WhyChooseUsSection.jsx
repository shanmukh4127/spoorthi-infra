import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import { FeatureCard } from '../cards/index.js'

function WhyChooseUsSection({ id = 'why-choose-us', eyebrow, title, description, principles = [], brandVariant = 'neutral' }) {
  return (
    <SectionWrapper id={id} className={`why-section why-section--${brandVariant}`}>
      <PageContainer>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <ol className="why-section__principles">
          {principles.map((principle, index) => (
            <li className="why-principle" key={principle.id}>
              <p className="why-principle__number type-label">{String(index + 1).padStart(2, '0')}</p>
              <FeatureCard feature={principle} />
            </li>
          ))}
        </ol>
      </PageContainer>
    </SectionWrapper>
  )
}

export default WhyChooseUsSection
