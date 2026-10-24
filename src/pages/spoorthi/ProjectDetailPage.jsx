import { ArrowUpRight } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import SectionHeading from '../../components/content/SectionHeading.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import Media from '../../components/common/Media.jsx'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import ProjectScrollStory from '../../components/common/ProjectScrollStory.jsx'
import { createProjectStory } from '../../data/shared/projectStory.js'
import '../../styles/spoorthi-featured-projects.css'
import { getSpoorthiProject } from '../../data/spoorthi/index.js'
import usePublicProjects from '../../data/usePublicProjects.js'
import LoadingState from '../../components/states/LoadingState.jsx'
import ErrorState from '../../components/states/ErrorState.jsx'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-project-detail.css'

function createPersistedProjectDetail(project) {
  if (!project) return null
  const title = project.title || 'Project study'
  const category = project.category || 'Architecture & design'
  const coverAlt = project.coverAlt || `${title} project image`
  const description = project.description || project.summary || 'A project study prepared for exploring design possibilities.'
  const mediaGallery = [
    project.twoDImage && { src: project.twoDImage, alt: `${title} 2D drawing`, caption: '2D drawing / Plans and elevations' },
    project.threeDImage && { src: project.threeDImage, alt: `${title} 3D structure`, caption: '3D structure / Form and spatial study' },
    project.finalOutputImage && { src: project.finalOutputImage, alt: `${title} final output`, caption: 'Final output / Project result' },
  ].filter(Boolean)
  return {
    ...project,
    number: '—',
    type: project.projectType || category,
    description,
    overview: project.overview || description,
    highlights: project.highlights?.length ? project.highlights : [{ title: 'A starting point', description: 'This saved project is a starting point for discussing scope, material, and direction.' }],
    heroImage: { src: project.coverImage || project.finalOutputImage || project.threeDImage || project.twoDImage, alt: coverAlt },
    gallery: mediaGallery.length ? mediaGallery : project.gallery?.length ? project.gallery : [{ src: project.coverImage, alt: coverAlt, caption: 'Project study / Saved from the admin workspace' }],
    relatedService: { label: 'Discuss this project', path: routePaths.spoorthi.contact },
    nextProjectId: null,
  }
}

function ProjectDetailPage() {
  const { projectId } = useParams()
  const { projects: publicProjects, status } = usePublicProjects()
  const project = useMemo(() => {
    const record = publicProjects.find(item => item.id === projectId && item.brand === 'Spoorthi Infra')
    if (!record) return null
    const detail = createPersistedProjectDetail(record)
    const original = getSpoorthiProject(projectId)
    return { ...original, ...detail, number: original?.number ?? detail.number, nextProjectId: original?.nextProjectId ?? null }
  }, [publicProjects, projectId])
  if (status !== 'ready') return <SectionWrapper><PageContainer>{status === 'loading' ? <LoadingState label="Loading project study" /> : <ErrorState title="Project service unavailable" onRetry={() => window.location.reload()} />}</PageContainer></SectionWrapper>
  if (!project) return <SectionWrapper className="spoorthi-project-detail spoorthi-project-detail--not-found"><PageContainer><SectionHeading as="h1" eyebrow="Spoorthi Infra / Projects" title="This study could not be found." description="Explore the concept collection to find an available study." /><TextLink to={routePaths.spoorthi.projects} variant="arrow">Back to the collection</TextLink></PageContainer></SectionWrapper>

  const story = createProjectStory(project)
  const nextRecord = publicProjects.find(item => item.id === project.nextProjectId && item.brand === 'Spoorthi Infra')
  const nextProject = nextRecord ? { ...getSpoorthiProject(nextRecord.id), ...nextRecord } : null

  return (
    <div className="spoorthi-project-detail">
      <SectionWrapper className="spoorthi-project-detail__opening">
        <PageContainer>
          <TextLink to={routePaths.spoorthi.projects} className="spoorthi-project-detail__back">← All projects</TextLink>
          <div className="spoorthi-project-detail__opening-grid">
            <div>
              <p className="type-label">{project.isConcept ? 'Concept study' : 'Project'} {project.number} / {project.category}</p>
              <h1>{project.title}</h1>
            </div>
            <div className="spoorthi-project-detail__opening-copy">
              <p className="type-body-large">{project.description}</p>
              <dl className="spoorthi-project-detail__metadata">
                <div><dt>Focus</dt><dd>{project.type}</dd></div>
                {project.serviceNeeded && <div><dt>Service needed</dt><dd>{project.serviceNeeded}</dd></div>}
                {project.area && <div><dt>Approx. area</dt><dd>{project.area} sq.ft</dd></div>}
                {project.location && <div><dt>Location</dt><dd>{project.location}</dd></div>}
                <div><dt>Collection</dt><dd>{project.isConcept ? 'Illustrative concepts' : 'Spoorthi projects'}</dd></div>
              </dl><Link className="project-contact-cta" to={routePaths.spoorthi.contact}>Discuss this project <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          {project.heroImage.src && <Media className="spoorthi-project-detail__hero" src={project.heroImage.src} alt={project.heroImage.alt} aspect="wide" loading="eager" caption={project.isConcept ? 'Illustrative concept imagery. This study is not a completed client project.' : 'Project image supplied through the workspace.'} />}
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

      <section id="study-gallery" className="tfp spoorthi-featured-projects spoorthi-project-detail__story" aria-labelledby="project-story-title">
        <header className="spoorthi-project-detail__story-heading"><p className="tfp-kicker">02 / Project journey</p><h2 id="project-story-title">From plan to perspective.</h2><p>Follow {project.title} through its 2D drawing, 3D view and final image.</p></header>
        <ProjectScrollStory key={project.id} {...story} index={0} total={1} />
      </section>

      {project.vrArUrl && <SectionWrapper className="spoorthi-project-detail__contact"><PageContainer><div><p className="type-label">Interactive media</p><h2>Step inside the project.</h2><p>Open the connected VR or AR experience to explore the space beyond the still images.</p></div><a className="td-text-link" href={project.vrArUrl} target="_blank" rel="noreferrer">Open VR / AR experience <ArrowUpRight size={16} aria-hidden="true" /></a></PageContainer></SectionWrapper>}

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
