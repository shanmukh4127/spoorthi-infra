import { ArrowDown } from 'lucide-react'
import ProjectScrollStory from '../common/ProjectScrollStory.jsx'
import MobileProjectCards from '../common/MobileProjectCards.jsx'
import { spoorthiShowcaseStages } from '../../data/spoorthi/demoShowcase.js'
import { createHomepageStory, getHomepageProjects } from '../../data/shared/homepageProjects.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-featured-projects.css'

const scrollStoryRevision = import.meta.hot ? (import.meta.hot.data.projectRevision ?? 0) + 1 : 0
if (import.meta.hot) import.meta.hot.data.projectRevision = scrollStoryRevision

export default function SpoorthiFeaturedProjects({ projects, status }) {
  // Only use the published server response. A static demo cannot bypass a saved Draft.
  const visible = getHomepageProjects(projects, 'Spoorthi Infra').map(record => {
    const story = createHomepageStory(record)
    return { ...story.project, detailRoute: routePaths.spoorthi.projectDetail(record.id), homepageStages: record.isShowcaseDemo ? spoorthiShowcaseStages : story.stages, homepageCopy: story.copy }
  })
  return <section className="tfp spoorthi-featured-projects" id="spoorthi-demo-projects" aria-labelledby="spoorthi-demo-title">
    <header className="tfp-intro">
      <div><h2 id="spoorthi-demo-title">From the first line.<br /><em>Into perspective.</em></h2><p>Selected projects and design studies, from planning to visualization. Concept images are illustrative and do not represent completed client work.</p></div>
      {visible.length > 0 && <a className="tfp-intro-scroll" href={`#featured-${visible[0].id}`}>Explore the demo projects <ArrowDown size={17} aria-hidden="true" /></a>}
      {status !== 'ready' && <p className="sfp-status" role="status">{status === 'loading' ? 'Loading the project journeys…' : 'The project journeys are temporarily unavailable.'}</p>}
    </header>
    {visible.length > 0 && <a className="tfp-intro-scroll tfp-intro-scroll--mobile" href="#spoorthi-project-cards">Explore each project <ArrowDown size={17} aria-hidden="true" /></a>}
    <div id="spoorthi-project-cards" className="sfp-mobile-stories">
      {visible.map(project => <div className="sfp-mobile-story" key={project.id}>
        <h3 className="sfp-mobile-story-title">{project.title}</h3>
        <MobileProjectCards id={`spoorthi-project-cards-${project.id}`} projects={project.homepageStages.map(stage => ({
          ...project,
          id: `${project.id}-${stage.key}`,
          title: stage.label,
          visualizationImages: project[stage.key],
          stageCopy: project.homepageCopy[stage.copyKey],
        }))} stages={spoorthiShowcaseStages} copyFor={stage => ({ visualization: stage.stageCopy })} floating />
      </div>)}
    </div>
    <div className="sfp-project-stories tfp-desktop-projects">{visible.map((project, index) => <ProjectScrollStory key={`${project.id}-${scrollStoryRevision}`} project={project} index={index} total={visible.length} stages={project.homepageStages} copy={project.homepageCopy} projectLinkLabel={project.isConcept ? 'Explore demo study' : 'Explore project'} />)}</div>
  </section>
}
