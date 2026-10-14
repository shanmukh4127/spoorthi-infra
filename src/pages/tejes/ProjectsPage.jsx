import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import TejesHomeMenu, { TejesWordmark } from '../../components/tejes/TejesHomeMenu.jsx'
import { routePaths } from '../../data/routePaths.js'
import { projectsPage, selectedProjects, signatureProject } from '../../data/tejes/projectArchive.js'
import '../../styles/tejes-home-reference.css'
import '../../styles/tejes-projects-archive.css'

export function ProjectPhoto({ image, alt, className = '', eager = false, sizes = '(max-width: 600px) 100vw, 50vw' }) {
  return <img className={`tp-photo ${className}`} src={image.src} srcSet={image.srcSet} sizes={sizes}
    width={image.width} height={image.height} style={{ objectPosition: image.focalPoint }} alt={alt}
    loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" />
}

function ProjectFacts({ project }) {
  const rows = [
    ['Project type', project.projectType],
    ['Design scope', project.designScope],
    ['Spaces', project.spaces],
    ['Project status', project.status],
  ].filter(([, value]) => value)
  if (!rows.length) return null
  return <dl className="tp-facts">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
}

function ProjectLink({ project }) {
  return <Link className="tp-project-link" to={project.detailRoute}>View project <ArrowRight size={13} aria-hidden="true" /></Link>
}

export function TejesProjectsFooter({ activePage = 'projects' }) {
  return <footer className="th-section th-footer tp-footer">
    <TejesWordmark />
    <nav aria-label="Tejes footer"><Link to={`${routePaths.tejes.home}#tejes-about`}>About</Link><Link to={routePaths.tejes.interiorDesign}>Services</Link><Link to={routePaths.tejes.projects} aria-current={activePage === 'projects' ? 'page' : undefined}>Projects</Link><Link to={routePaths.tejes.contact} aria-current={activePage === 'contact' ? 'page' : undefined}>Contact</Link></nav>
    <div><p>Interior design <span>|</span> Spatial design <span>|</span> 3D visualization <span>|</span> Materials <span>|</span> Execution</p><small>© {new Date().getFullYear()} Tejes Interiors. All rights reserved.</small></div>
  </footer>
}

function SelectedProject({ project, index }) {
  return <article className={`tp-selected-project tp-selected-project--${index % 2 ? 'image-first' : 'text-first'}`} aria-labelledby={`${project.id}-title`}>
    <div className="tp-selected-copy"><span className="tp-selected-number" aria-hidden="true">{project.number}</span><div className="tp-selected-content"><p className="tp-kicker">{project.label}</p><h3 id={`${project.id}-title`}>{project.title}</h3><p className="tp-description">{project.description}</p><ProjectFacts project={project} /><ProjectLink project={project} /></div></div>
    <Link className="tp-selected-image" to={project.detailRoute} aria-label={`View ${project.title} study`}><ProjectPhoto image={project.image} alt={project.alt} sizes="(max-width: 600px) 100vw, 48vw" /></Link>
  </article>
}

export default function ProjectsPage() {
  return <div className="th-home tp-page">
    <TejesHomeMenu initialOpen={false} navigationItems={projectsPage.menu} navigationLabel="Tejes projects navigation" />

    <section className="tp-hero" aria-labelledby="projects-title">
      <ProjectPhoto image={projectsPage.hero.image} alt={projectsPage.hero.alt} className="tp-hero-photo" eager sizes="(max-width: 600px) 100vw, 67vw" />
      <div className="tp-hero-veil" aria-hidden="true" />
      <div className="tp-hero-copy"><p className="tp-kicker">{projectsPage.hero.eyebrow}</p><h1 id="projects-title">{projectsPage.hero.title}</h1><p>{projectsPage.hero.introduction}</p><div className="tp-hero-meta"><span>Selected work</span><span>Tejes Interiors</span></div></div>
    </section>

    <section className="tp-signature" aria-labelledby="signature-title">
      <div className="tp-signature-rail"><span className="tp-rail-zero">0</span><span className="tp-signature-number" aria-hidden="true">{signatureProject.number}</span><span className="tp-vertical-label">Signature project</span></div>
      <Link className="tp-signature-image" to={signatureProject.detailRoute} aria-label="View The Signature Residence study"><ProjectPhoto image={signatureProject.image} alt={signatureProject.alt} sizes="(max-width: 600px) 100vw, 44vw" /></Link>
      <div className="tp-signature-copy"><p className="tp-kicker">Featured work</p><h2 id="signature-title">{signatureProject.title}</h2><p className="tp-description">{signatureProject.description}</p><ProjectFacts project={signatureProject} /><ProjectLink project={signatureProject} /></div>
      <div className="tp-signature-aside" aria-hidden="true"><span className="tp-aside-rule" /><span>01</span><span>—</span><span>05</span></div>
    </section>

    <section className="tp-selected" aria-labelledby="selected-heading">
      <div className="tp-selected-heading"><div><p className="tp-kicker">Selected work</p><h2 id="selected-heading">{projectsPage.selectedHeading}</h2></div><span aria-hidden="true" /></div>
      <div className="tp-selected-list">{selectedProjects.map((project, index) => <SelectedProject key={project.id} project={project} index={index} />)}</div>
      <p className="tp-evidence">{projectsPage.evidenceNote}</p>
    </section>

    <section className="tp-closing" aria-labelledby="closing-title"><div><p className="tp-kicker">{projectsPage.closing.eyebrow}</p><h2 id="closing-title">{projectsPage.closing.title}</h2></div><p>{projectsPage.closing.description}</p><Link className="tp-start" to={routePaths.tejes.contact}>Start a project <ArrowRight size={13} aria-hidden="true" /></Link></section>
    <TejesProjectsFooter />
  </div>
}
