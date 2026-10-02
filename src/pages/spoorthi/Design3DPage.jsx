import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import SectionHeading from '../../components/content/SectionHeading.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import DesignDevelopmentStudy from '../../components/spoorthi/DesignDevelopmentStudy.jsx'
import DesignVisualization from '../../components/spoorthi/DesignVisualization.jsx'
import DesignWorkflow from '../../components/spoorthi/DesignWorkflow.jsx'
import DesignDrawing from '../../components/spoorthi/DesignDrawing.jsx'
import { spoorthiDesign3d } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-design-3d.css'

function Design3DPage() {
  const { intro, development, visualization, workflow, intent, continuation } = spoorthiDesign3d
  return <div className="spoorthi-design-page">
    <SectionWrapper className="design-intro"><PageContainer>
      <div className="design-intro__layout">
        <SectionHeading as="h1" eyebrow={intro.eyebrow} title={intro.title} description={intro.description} />
        <div className="design-intro__sketch" aria-hidden="true"><DesignDrawing /><span className="type-label">Architecture / Planning / Visualization</span></div>
        <p className="design-intro__aside type-label">Ideas<br />shaped<br />into<br />spaces.</p>
      </div>
      <nav className="design-intro__actions" aria-label="Explore architectural design"><TextLink to={routePaths.spoorthi.contact} variant="arrow">Discuss your design</TextLink><TextLink href="#design-development" variant="arrow">Explore the process</TextLink></nav>
      <aside className="design-intro__notice" aria-label="About the illustrations"><p className="type-label">{intro.notice}</p><p>{intro.note}</p></aside>
    </PageContainer></SectionWrapper>
    <SectionWrapper id="design-development" className="design-development"><PageContainer>
      <SectionHeading eyebrow={development.eyebrow} title={development.title} />
      <DesignDevelopmentStudy stages={development.stages} caption={development.caption} />
    </PageContainer></SectionWrapper>
    <SectionWrapper id="design-visualization" className="design-feature"><PageContainer>
      <div className="design-feature__layout">
        <div className="design-feature__copy"><SectionHeading eyebrow={visualization.eyebrow} title={visualization.title} /><p>{visualization.description}</p><p className="type-label">Proportion / Material / Light</p><TextLink href="#design-workflow" variant="arrow">Explore the design layers</TextLink></div>
        <DesignVisualization primary={visualization.primary} caption={visualization.caption} />
      </div>
    </PageContainer></SectionWrapper>
    <SectionWrapper id="design-workflow" className="design-process"><PageContainer>
      <div className="design-process__layout"><SectionHeading eyebrow={workflow.eyebrow} title={workflow.title} /><DesignWorkflow steps={workflow.steps} note={workflow.note} /></div>
    </PageContainer></SectionWrapper>
    <SectionWrapper id="design-intent" className="design-intent"><PageContainer>
      <div className="design-intent__layout">
        <DesignVisualization primary={intent.media} caption="Facade & material detail / AI-generated concept" />
        <div className="design-intent__copy"><SectionHeading eyebrow={intent.eyebrow} title={intent.title} /><p>{intent.description}</p><p className="type-label">{intent.supporting}</p></div>
        <div className="design-intent__sketch" aria-hidden="true"><DesignDrawing /></div>
      </div>
      <nav className="design-continuation__actions" aria-label="Continue exploring Spoorthi">{continuation.links.map(link => <TextLink key={link.path} variant="arrow" to={link.path}>{link.label}</TextLink>)}</nav>
    </PageContainer></SectionWrapper>
  </div>
}
export default Design3DPage
