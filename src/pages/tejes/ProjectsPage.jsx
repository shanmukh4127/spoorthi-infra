import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Media from '../../components/common/Media.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import TejesProjectsHeader from '../../components/tejes/TejesProjectsHeader.jsx'
import { routePaths } from '../../data/routePaths.js'
import { archive, selectedStudies, signatureProject as project } from '../../data/tejes/projectArchive.js'
import '../../styles/tejes-projects-archive.css'

const Label = ({ children }) => <p className="tp-label">{children}</p>
const Title = ({ label, children }) => <div className="tp-section-title"><Label>{label}</Label><h2>{children}</h2></div>

function ProjectImage({ asset, alt, priority = false, className = '', caption, sizes = '(max-width: 768px) 90vw, 55vw' }) {
  return <Media src={asset.src} srcSet={asset.srcSet} sizes={sizes} width={asset.width} height={asset.height}
    alt={alt} objectPosition={asset.focalPoint || '50% 50%'} loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined} contained={false} className={className} caption={caption} />
}

function ProjectMetadata({ record }) {
  return <dl className="tp-metadata">{[
    ['Project type', record.type], ['Location', record.location],
    ['Design scope', record.designScope], ['Status / Year', `${record.status} / ${record.year || '—'}`],
  ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || <span aria-label="Awaiting approved project information">—</span>}</dd></div>)}</dl>
}

export default function ProjectsPage() {
  return <div className="tp-archive">
    <TejesProjectsHeader />
    <section className="tp-section tp-introduction" aria-labelledby="archive-title">
      <div><Label>Tejes Interiors / Projects</Label><h1 id="archive-title">{archive.title}</h1><p className="tp-lead">{archive.introduction}</p></div>
      <ProjectImage asset={project.images.introduction} alt="Reflective architectural lighting above a garden-facing interior" className="tp-intro-image" sizes="(max-width: 768px) 40vw, 24vw" />
      <ul className="tp-archive-meta">{archive.metadata.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section id="signature-project" tabIndex={-1} className="tp-section tp-signature" aria-labelledby="signature-title">
      <div className="tp-project-heading"><span className="tp-project-number" aria-hidden="true">{project.number}</span><div><Label>Project / {project.number} · Signature project</Label><h2 id="signature-title">{project.title}</h2></div><span className="tp-study-indicator">Selected design study</span></div>
      <div className="tp-signature-layout">
        <ProjectImage asset={project.images.primary} alt="Garden-facing living room and kitchen with natural stone island, timber parquet and soft seating" priority className="tp-signature-image" sizes="(max-width: 768px) 90vw, 62vw" />
        <aside className="tp-dossier"><Label>Dossier / {project.number}</Label><ProjectMetadata record={project} /><p className="tp-note">{archive.provenance}</p><TextLink href="#project-statement" variant="arrow">Enter the project story</TextLink></aside>
      </div>
    </section>

    <section id="project-statement" tabIndex={-1} className="tp-section tp-statement">
      <div><Title label="The project">{project.statement}</Title><p className="tp-body">{project.description}</p></div>
      <ProjectImage asset={project.images.statement} alt="Seating, parquet and garden views in the illustrative residence" sizes="(max-width: 768px) 90vw, 33vw" />
    </section>

    <section className="tp-section tp-specifications">
      <div className="tp-sheet-heading"><h2 className="tp-label">Project specifications</h2><span>01 / Architectural dossier</span></div>
      <dl className="tp-spec-sheet">{project.specifications.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.values ? item.values.map(value => <span key={value}>{value}</span>) : <span aria-label="Awaiting approved project scope">—</span>}</dd></div>)}</dl>
      <p className="tp-note">{archive.pendingSpecifications}</p>
    </section>

    <section className="tp-section tp-intent">
      <ProjectImage asset={project.images.intent} alt="Connected living and kitchen composition with stone, timber and garden glazing" sizes="(max-width: 768px) 90vw, 43vw" />
      <div><Title label="Design intent">One space. Six considerations.</Title><ol className="tp-intent-list">{project.designIntent.map((item, index) => <li key={item.title}><span className="tp-index">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol></div>
    </section>

    <section id="project-development" tabIndex={-1} className="tp-section tp-development">
      <div className="tp-section-heading"><Title label="Project development">From a line to a lived space.</Title><p className="tp-note">{archive.developmentNote}</p></div>
      <ol className="tp-timeline">{project.development.map((item, index) => <li key={item.title}><span className="tp-index">0{index + 1}</span><Link to={item.path}><ProjectImage asset={item.image} alt={`${item.title}: replaceable illustration slot`} sizes="(max-width: 600px) 40vw, 19vw" /><h3>{item.title}<ArrowRight size={14} aria-hidden="true" /></h3></Link><p>{item.note}</p></li>)}</ol>
    </section>

    <section className="tp-section tp-materials">
      <div><Title label="Material story">Texture gives a space its character.</Title><p className="tp-note">{archive.materialNote}</p></div>
      <ul className="tp-material-board">{project.materials.map(item => <li key={item.title}><ProjectImage asset={item.image} alt={`${item.title} texture reference for an exploratory finish palette`} sizes="(max-width: 600px) 28vw, 14vw" /><h3>{item.title}</h3></li>)}</ul>
    </section>

    <section className="tp-section tp-highlights">
      <Title label="Project highlights">The details that define the whole.</Title>
      <div className="tp-highlight-annotations">{project.highlights.length ? <ol>{project.highlights.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol> : <div className="tp-highlight-pending"><Label>Project annotations</Label><p>{archive.emptyHighlights}</p><span aria-hidden="true" /><span aria-hidden="true" /></div>}</div>
    </section>

    <section className="tp-section tp-milestone">
      <ProjectImage asset={project.images.milestone} alt="An expansive stone and timber interior connected to its garden" sizes="90vw" />
      <div className="tp-milestone-statement"><Title label="The milestone / A design direction">{project.milestone}</Title><p>{project.milestoneDescription}</p></div>
    </section>

    <section className="tp-section tp-story">
      <Title label="Project story">Read the space through its details.</Title>
      <div className="tp-story-layout">{project.story.map(item => <ProjectImage key={item.title} asset={item.image} alt={item.alt} className={`tp-story-${item.title.toLowerCase()}`} sizes="(max-width: 768px) 90vw, 43vw" caption={<><span>{item.title}</span>{item.caption}</>} />)}</div>
    </section>

    <section id="selected-work" tabIndex={-1} className="tp-section tp-selected">
      <div className="tp-section-heading"><Title label="Other selected work">A few more directions.</Title><p className="tp-note">Supporting visual studies. Space for approved projects to follow.</p></div>
      <div className="tp-study-list">{selectedStudies.map(study => <details key={study.id} className="tp-study"><summary><span className="tp-index">{study.number}</span><ProjectImage asset={study.images.primary} alt={`${study.title}: illustrative interior photograph`} sizes="(max-width: 600px) 24vw, 15vw" /><span className="tp-study-name"><span>{study.title}</span><small>{study.type}</small></span><span className="tp-study-action">View study <ArrowRight size={16} aria-hidden="true" /></span></summary><div className="tp-study-body"><div><p>{study.description}</p><p className="tp-note">Illustrative reference photography; client project details await approval.</p><TextLink to={routePaths.tejes.design3d} variant="arrow">Explore the design journey</TextLink></div><ProjectMetadata record={study} /></div></details>)}</div>
    </section>

    <section className="tp-section tp-journey">
      <div className="tp-journey-mark" aria-hidden="true"><span>2D</span><ArrowRight /><span>3D</span><ArrowRight /><span>VR</span></div>
      <div><Title label="Project journey">{archive.journeyTitle}</Title><p className="tp-body">{archive.journeyDescription}</p><TextLink to={routePaths.tejes.design3d} variant="arrow">View project journey</TextLink></div>
    </section>

    <section className="tp-section tp-closing"><Title label="Tejes Interiors">{archive.closing}</Title><ProjectImage asset={project.images.closing} alt="Precise junction between warm timber parquet and natural stone" sizes="(max-width: 768px) 90vw, 32vw" /></section>
    <section className="tp-section tp-enquiry"><Title label="Have a space in mind?">Let’s create it with intention.</Title><div className="tp-enquiry-actions"><Link className="tp-primary-link" to={routePaths.tejes.contact}>Start a project <ArrowRight size={16} aria-hidden="true" /></Link><TextLink to={`${routePaths.tejes.contact}#main-content`} variant="arrow">Contact Tejes</TextLink></div></section>
    <footer className="tp-footer"><Link to={routePaths.tejes.home} aria-label="Tejes Interiors home"><img className="tp-logo" src="/assets/tejes/brand/wordmark.svg" width="140" height="60" alt="Tejes Interiors" /></Link><nav aria-label="Tejes footer">{archive.footer.map(item => <Link key={item.title} to={item.path} aria-current={item.title === 'Projects' ? 'page' : undefined}>{item.title}</Link>)}</nav><div><p>Interior design · Spatial design · 3D visualization<br />Materials · Execution</p><p>© {new Date().getFullYear()} Tejes Interiors</p></div></footer>
  </div>
}
