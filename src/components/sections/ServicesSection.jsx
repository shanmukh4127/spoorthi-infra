import { PageContainer, SectionWrapper } from '../layout/index.js'
import SectionHeading from '../content/SectionHeading.jsx'
import { ServiceItem } from '../cards/index.js'

function ServicesSection({ eyebrow, title, description, services = [], brandVariant = 'neutral' }) {
  return (
    <SectionWrapper id="services" className={`services-section services-section--${brandVariant}`}>
      <PageContainer>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="services-section__list">
          {services.map((service, index) => <ServiceItem key={service.id} index={index} service={service} />)}
        </div>
      </PageContainer>
    </SectionWrapper>
  )
}

export default ServicesSection
