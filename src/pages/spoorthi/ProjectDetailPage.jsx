import { Link, useParams } from 'react-router-dom'
import SectionHeading from '../../components/content/SectionHeading.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import SpoorthiProjectGallery from '../../components/spoorthi/SpoorthiProjectGallery.jsx'
import { getSpoorthiProject, spoorthiProjectCollection } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-project-detail.css'

const detailSections = [
  { key: 'design2D', number: '01', label: '2D Design', eyebrow: 'Plans / Sections / Elevations', description: 'Technical drawings and spatial decisions for this project will be presented here.' },
  { key: 'development3D', number: '02', label: '3D Development', eyebrow: 'Form / Volume / Spatial study', description: 'Three-dimensional development for this project will be added when approved assets are available.' },
  { key: 'visualization', number: '03', label: 'Visualization', eyebrow: 'Atmosphere / Material / Light', description: 'Project-specific visualizations will be presented here as they are approved.' },
  { key: 'vr', number: '04', label: 'VR Experience', eyebrow: 'Spatial experience', description: 'Step beyond the drawing and experience the space.' },
]

function ProjectMetadata({ project }) {
  const items = [['Type', project.type], ['Location', project.location], ['Area', project.area], ['Status', project.status]].filter(([, value]) => value)
  if (!items.length) return null
  return <dl className="spoorthi-project-detail__metadata">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
}

function ProjectDetailPage() {
  const { projectId } = useParams()
  const project = getSpoorthiProject(projectId)
  if (!project) return <SectionWrapper className="spoorthi-project-detail spoorthi-project-detail--not-found"><PageContainer><SectionHeading as="h1" eyebrow="Spoorthi Infra / Projects" title="Project not found" description="This project is not available in the current collection." /><TextLink to={routePaths.spoorthi.projects} variant="arrow">Back to projects</TextLink></PageContainer></SectionWrapper>

  const currentIndex = spoorthiProjectCollection.findIndex((item) => item.id === projectId)
  const nextRecord = currentIndex >= 0 ? spoorthiProjectCollection[currentIndex + 1] : null
  const nextProject = nextRecord ? getSpoorthiProject(nextRecord.id) : null

  return <div className="spoorthi-project-detail">
    <SectionWrapper className="spoorthi-project-detail__opening"><PageContainer><div className="spoorthi-project-detail__opening-grid"><div><p className="type-label">PROJECT / {project.number}</p><h1>{project.title}</h1><p className="type-body-large">{project.description || 'Project description will be added when approved content is available.'}</p><ProjectMetadata project={project} /></div><SpoorthiProjectGallery label="Project opening" assets={project.heroImage ? [project.heroImage] : []} /><nav className="spoorthi-project-detail__index" aria-label="Project stages">{detailSections.map((section) => <a key={section.key} href={`#project-${section.key}`}><span>{section.number}</span><span>{section.label.split(' ')[0]}</span></a>)}</nav></div></PageContainer></SectionWrapper>
    <SectionWrapper className="spoorthi-project-detail__overview"><PageContainer><div className="spoorthi-project-detail__overview-grid"><SectionHeading eyebrow="Overview" title="A project-specific record" /><p>{project.overview || project.description || 'Approved project overview content will be added here.'}</p><SpoorthiProjectGallery label="Overview" assets={project.heroImage ? [project.heroImage] : []} /></div></PageContainer></SectionWrapper>
    {detailSections.map((section) => { const assets = section.key === 'vr' ? (project.vr?.image ? [project.vr.image] : []) : project[section.key]; const description = section.key === 'vr' ? (project.vr?.description || section.description) : section.description; return <SectionWrapper id={`project-${section.key}`} key={section.key} className={`spoorthi-project-detail__section spoorthi-project-detail__section--${section.key}`}><PageContainer><div className="spoorthi-project-detail__section-grid"><div className="spoorthi-project-detail__section-heading"><p className="type-label">{section.number} / {section.eyebrow}</p><h2>{section.label}</h2><p>{description}</p>{section.key === 'vr' && (project.vr?.experienceUrl ? <TextLink variant="arrow" href={project.vr.experienceUrl} external>Experience VR</TextLink> : <span className="spoorthi-project-detail__disabled-cta" aria-disabled="true">Experience VR / Coming later</span>)}</div><SpoorthiProjectGallery label={section.label} assets={assets} /></div></PageContainer></SectionWrapper> })}
    <SectionWrapper className="spoorthi-project-detail__journey"><PageContainer><p className="type-label">PROJECT JOURNEY</p><ol><li><span>01</span><strong>Overview</strong></li>{detailSections.map((section, index) => <li key={section.key}><span>{String(index + 2).padStart(2, '0')}</span><strong>{section.label}</strong></li>)}</ol></PageContainer></SectionWrapper>
    <SectionWrapper className="spoorthi-project-detail__statement"><PageContainer><div><p className="type-label">PROJECT / {project.number}</p><p className="spoorthi-project-detail__statement-copy">{project.description || 'A considered progression from planning and design development to visualization and spatial experience.'}</p></div></PageContainer></SectionWrapper>
    <SectionWrapper className="spoorthi-project-detail__next"><PageContainer>{nextProject ? <Link className="spoorthi-project-detail__next-link" to={routePaths.spoorthi.projectDetail(nextProject.id)}><div><p className="type-label">NEXT PROJECT / {nextProject.number}</p><h2>{nextProject.title}</h2><p>{nextProject.type || 'Project information will be added when approved content is available.'}</p></div><SpoorthiProjectGallery label="Next project" assets={nextProject.heroImage ? [nextProject.heroImage] : []} /><span className="spoorthi-project-detail__next-arrow" aria-hidden="true">↗</span></Link> : <div className="spoorthi-project-detail__archive-end"><p className="type-label">PROJECT ARCHIVE</p><h2>End of project archive</h2><TextLink to={routePaths.spoorthi.projects} variant="arrow">Back to projects</TextLink></div>}</PageContainer></SectionWrapper>
    <SectionWrapper className="spoorthi-project-detail__contact"><PageContainer><div><p className="type-label">CONTINUE THE CONVERSATION</p><h2>Start a construction conversation</h2><p>Bring your next project question to Spoorthi Infra.</p></div><TextLink to={routePaths.spoorthi.contact} variant="arrow">Contact Spoorthi Infra</TextLink></PageContainer></SectionWrapper>
    <SectionWrapper className="spoorthi-project-detail__closing"><PageContainer><div className="spoorthi-project-detail__closing-grid"><TextLink to={routePaths.spoorthi.projects} variant="arrow">Back to projects</TextLink>{nextProject && <Link className="ui-link ui-link--arrow" to={routePaths.spoorthi.projectDetail(nextProject.id)}><span>Next project</span><span aria-hidden="true">↗</span></Link>}</div></PageContainer></SectionWrapper>
  </div>
}

export default ProjectDetailPage
