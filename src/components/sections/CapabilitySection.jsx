import SectionContent from './SectionContent.jsx'

function CapabilitySection({ id, title, description, children }) {
  return <SectionContent id={id} title={title} description={description}>{children}</SectionContent>
}

export default CapabilitySection
