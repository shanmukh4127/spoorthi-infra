import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectScrollStory from '../common/ProjectScrollStory.jsx'
import { spoorthiDemoProjects, spoorthiShowcaseStages } from '../../data/spoorthi/demoShowcase.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-featured-projects.css'

const scrollStoryRevision = import.meta.hot ? (import.meta.hot.data.projectRevision ?? 0) + 1 : 0
if (import.meta.hot) import.meta.hot.data.projectRevision = scrollStoryRevision

export default function SpoorthiFeaturedProjects({ projects, status }) {
  // Only use the published server response. A static demo cannot bypass a saved Draft.
  const visible = spoorthiDemoProjects.flatMap(template => {
    const record = projects.find(project => project.id === template.id && project.brand === 'Spoorthi Infra')
    if (!record) return []
    const media = (src, alt) => [{ image: { src, width: 1600, height: 1000 }, alt }]
    return [{ ...record, detailRoute: routePaths.spoorthi.projectDetail(record.id),
      twoDImages: media(record.twoDImage || template.twoDImage, `${record.title} — illustrative 2D concept diagram`),
      threeDImages: media(record.threeDImage || template.threeDImage, `${record.title} — illustrative 3D massing study`),
      visualizationImages: media(record.finalOutputImage || record.coverImage, record.coverAlt || `${record.title} — reference visualization`),
    }]
  })
  return <section className="tfp spoorthi-featured-projects" id="spoorthi-demo-projects" aria-labelledby="spoorthi-demo-title">
    <header className="tfp-intro">
      <p className="tfp-kicker">Spoorthi Infra <span>Three demo journeys</span></p>
      <div><h2 id="spoorthi-demo-title">From the first line.<br /><em>Into perspective.</em></h2><p>Three additional concept projects. Follow each idea through a 2D plan, a 3D study and a final visual direction. Illustrative demos, not completed client work.</p></div>
      {visible.length > 0 && <a className="tfp-intro-scroll" href={`#featured-${visible[0].id}`}>Explore the demo projects <ArrowDown size={17} aria-hidden="true" /></a>}
      {status !== 'ready' && <p className="sfp-status" role="status">{status === 'loading' ? 'Loading the project journeys…' : 'The project journeys are temporarily unavailable.'}</p>}
    </header>
    {visible.map((project, index) => <ProjectScrollStory key={`${project.id}-${scrollStoryRevision}`} project={project} index={index} total={visible.length} stages={spoorthiShowcaseStages} copy={project.showcaseCopy} projectLinkLabel="Explore demo study" />)}
    <footer className="sfp-continuation"><p>Demo concepts / Architecture · Structure · Space</p><Link className="tfp-link" to={routePaths.spoorthi.projects}>Explore the project collection <ArrowRight size={16} aria-hidden="true" /></Link></footer>
  </section>
}
