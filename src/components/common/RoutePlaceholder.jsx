import { SectionWrapper, PageContainer } from '../layout/index.js'

function RoutePlaceholder({ title, description = 'Page structure is established. Content will be added in the next phase.' }) {
  return <SectionWrapper variant="hero"><PageContainer><div className="layout-flow"><p className="type-label">Page overview</p><h1 className="type-h1">{title}</h1><p className="type-body-large">{description}</p></div></PageContainer></SectionWrapper>
}

export default RoutePlaceholder
