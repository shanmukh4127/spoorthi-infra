import { ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import SectionHeading from '../../components/content/SectionHeading.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import Media from '../../components/common/Media.jsx'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import SpoorthiProjectGallery from '../../components/spoorthi/SpoorthiProjectGallery.jsx'
import { getSpoorthiProject } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-project-detail.css'

function ProjectDetailPage() {
  const { projectId } = useParams()
  const project = getSpoorthiProject(projectId)
  if (!project) return <SectionWrapper className="spoorthi-project-detail spoorthi-project-detail--not-found"><PageContainer><SectionHeading as="h1" eyebrow="Spoorthi Infra / Projects" title="This study could not be found." description="Explore the concept collection to find an available study." /><TextLink to={routePaths.spoorthi.projects} variant="arrow">Back to the collection</TextLink></PageContainer></SectionWrapper>

  const nextProject = getSpoorthiProject(project.nextProjectId)

  return (
    <div className="spoorthi-project-detail">
      <SectionWrapper className="spoorthi-project-detail__opening">
        <PageContainer>
          <TextLink to={routePaths.spoorthi.projects} className="spoorthi-project-detail__back">← All concept studies</TextLink>
          <div className="spoorthi-project-detail__opening-grid">
            <div>
              <p className="type-label">Concept study {project.number} / {project.category}</p>
              <h1>{project.title}</h1>
            </div>
            <div className="spoorthi-project-detail__opening-copy">
              <p className="type-body-large">{project.description}</p>
              <dl className="spoorthi-project-detail__metadata">
                <div><dt>Focus</dt><dd>{project.type}</dd></div>
                <div><dt>Collection</dt><dd>Illustrative concepts</dd></div>
              </dl>
            </div>
          </div>
          <Media className="spoorthi-project-detail__hero" src={project.heroImage.src} alt={project.heroImage.alt} aspect="wide" loading="eager" caption="Illustrative concept imagery. This study is not a completed client project." />
          <nav className="spoorthi-project-detail__index" aria-label="Study sections">
            <a href="#study-overview"><span>01</span> The idea</a>
            <a href="#study-gallery"><span>02</span> Visual exploration</a>
            <a href="#study-conversation"><span>03</span> Your project</a>
          </nav>
        </PageContainer>
      </SectionWrapper>

      <SectionWrapper id="study-overview" className="spoorthi-project-detail__overview">
        <PageContainer>
          <div className="spoorthi-project-detail__overview-grid">
            <div><p className="type-label">01 / The idea</p><h2>Thoughtful choices.<br />A clear direction.</h2></div>
            <div className="spoorthi-project-detail__overview-copy"><p>{project.overview}</p><TextLink variant="arrow" to={project.relatedService.path}>{project.relatedService.label}</TextLink></div>
          </div>
          <ol className="spoorthi-project-detail__principles">
            {project.highlights.map((item, index) => <li key={item.title}><span className="type-label">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}
          </ol>
        </PageContainer>
      </SectionWrapper>

      <SectionWrapper id="study-gallery" className="spoorthi-project-detail__visuals">
        <PageContainer>
          <div className="spoorthi-project-detail__visual-heading">
            <div><p className="type-label">02 / Visual exploration</p><h2>See the possibilities.</h2></div>
            <p>Concept images and design process illustrations offer a closer look at the ideas in this study.</p>
          </div>
          <SpoorthiProjectGallery key={project.id} label={`${project.title} concept gallery`} assets={project.gallery} />
        </PageContainer>
      </SectionWrapper>

      <SectionWrapper id="study-conversation" className="spoorthi-project-detail__contact">
        <PageContainer>
          <div><p className="type-label">03 / Your project</p><h2>What could your space become?</h2><p>Share your brief, your site, or the idea you have in mind. Let’s explore the next step together.</p></div>
          <TextLink to={routePaths.spoorthi.contact} variant="arrow">Discuss your project</TextLink>
        </PageContainer>
      </SectionWrapper>

      {nextProject && <SectionWrapper className="spoorthi-project-detail__next">
        <PageContainer>
          <Link className="spoorthi-project-detail__next-link" to={routePaths.spoorthi.projectDetail(nextProject.id)}>
            <Media src={nextProject.coverImage} alt="" decorative aspect="wide" />
            <div><p className="type-label">Next concept study / {nextProject.number}</p><h2>{nextProject.title}</h2><p>{nextProject.category}</p><span className="spoorthi-project-detail__next-label">Explore the study <ArrowUpRight aria-hidden="true" size={18} /></span></div>
          </Link>
        </PageContainer>
      </SectionWrapper>}
    </div>
  )
}

export default ProjectDetailPage
