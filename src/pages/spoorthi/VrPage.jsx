import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import SectionHeading from '../../components/content/SectionHeading.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import Media from '../../components/common/Media.jsx'
import SpatialPortal from '../../components/spoorthi/SpatialPortal.jsx'
import VrDrawing from '../../components/spoorthi/VrDrawing.jsx'
import { spoorthiVr } from '../../data/spoorthi/vr.js'
import '../../styles/spoorthi-vr.css'

function VrPage() {
  const { intro, portal, experience, sequence, closing } = spoorthiVr
  return (
    <div className="spoorthi-vr-page">
      <SectionWrapper className="vr-intro"><PageContainer>
        <div className="vr-intro__layout">
          <SectionHeading as="h1" {...intro} />
          <div className="vr-intro__elevation"><VrDrawing variant="elevation" /></div>
        </div>
      </PageContainer></SectionWrapper>
      <SectionWrapper id="spatial-explorer" className="vr-portal-section"><PageContainer>
        <h2 className="sr-only">{portal.title}</h2>
        <SpatialPortal content={portal} />
      </PageContainer></SectionWrapper>
      <SectionWrapper className="vr-spatial-experience"><PageContainer>
        <div className="vr-spatial-experience__layout">
          <Media src={experience.media.src} alt={experience.media.alt} aspect="wide" width={experience.media.width} height={experience.media.height} caption="AI-generated interior study / Not a real project" />
          <div className="vr-spatial-experience__copy">
            <p className="type-label">{experience.eyebrow}</p>
            <h2>{experience.title}</h2>
            <p className="vr-spatial-experience__statement">{experience.statements.map(line => <span key={line}>{line}</span>)}</p>
          </div>
        </div>
      </PageContainer></SectionWrapper>
      <SectionWrapper className="vr-sequence"><PageContainer>
        <SectionHeading eyebrow="03 / A connected perspective" title={sequence.title} />
        <ol className="vr-sequence__steps">{sequence.steps.map(step => <li key={step.id}>
          <div className="vr-sequence__copy"><span className="type-label">{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></div>
          <VrDrawing variant={step.id} />
        </li>)}</ol>
        <p className="vr-sequence__note">Concept studies show the process. Project-specific immersive presentations begin with coordinated drawings and a prepared spatial model.</p>
      </PageContainer></SectionWrapper>
      <SectionWrapper className="vr-closing"><PageContainer>
        <div className="vr-closing__layout"><div className="vr-closing__copy">
          <SectionHeading eyebrow={closing.eyebrow} title={closing.title} description={closing.description} />
          <nav aria-label="Continue from the VR overview">{closing.links.map(link => <TextLink key={link.path} variant="arrow" to={link.path}>{link.label}</TextLink>)}</nav>
        </div><VrDrawing /></div>
      </PageContainer></SectionWrapper>
    </div>
  )
}
export default VrPage
