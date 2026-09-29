import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiEditorialMedia from '../../components/spoorthi/SpoorthiEditorialMedia.jsx'
import { civilConstruction, spoorthiProjectsPage } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/civil-construction.css'

const constructionVisual = civilConstruction.intro.media

function CivilConstructionPage() {
  const demoProjects = import.meta.env.DEV && spoorthiProjectsPage.demo.enabled ? spoorthiProjectsPage.demo.projects.slice(0, 3) : []
  const principles = [
    { number: '01', title: 'Structured thinking', description: 'Questions, constraints, and priorities are made visible before the work moves forward.' },
    { number: '02', title: 'Design clarity', description: 'Plans and visual references connect technical intent with a shared understanding of the outcome.' },
    { number: '03', title: 'Technical precision', description: 'Proportion, detail, and clear information support decisions made with care.' },
    { number: '04', title: 'Integrated perspective', description: 'Planning, visualization, construction, and experience remain connected as one journey.' },
  ]
  const connections = ['Design', 'Development', 'Construction', 'Built form']
  const development = ['2D Design', '3D Development', 'Visualization', 'Construction']
  return <div className="civil-construction-page">
    <SectionWrapper className="civil-editorial-hero"><PageContainer><div className="civil-editorial-hero__grid"><div><p className="type-label">Spoorthi Infra / Civil Construction</p><h1>Civil<br /><em>Construction.</em></h1><p className="civil-editorial-hero__statement">{civilConstruction.intro.description}</p><TextLink to={routePaths.spoorthi.projects} variant="arrow">Explore our work</TextLink></div><SpoorthiEditorialMedia media={constructionVisual} label="Civil construction study" aspect="wide" className="civil-editorial-hero__media" /><p className="civil-editorial-hero__note type-label">Structure / Form / Space</p></div></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-practice"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">01 / The practice</p><span /></div><div className="civil-editorial-practice__grid"><h2>Design intent becomes physical form.</h2><div><p>{civilConstruction.build.description}</p><p className="type-label">Structure / Form / Space</p></div><SpoorthiEditorialMedia media={constructionVisual} label="Architectural construction study" aspect="landscape" /></div></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-connections"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">02 / Connected practice</p><span /></div><h2>What civil construction connects.</h2><ol className="civil-editorial-connections__sequence">{connections.map((label, index) => <li key={label}><span className="type-label">0{index + 1}</span><strong>{label}</strong>{index < connections.length - 1 && <span className="civil-editorial-connections__arrow" aria-hidden="true">↓</span>}</li>)}</ol></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-approach"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">03 / Approach</p><span /></div><div className="civil-editorial-approach__intro"><h2>How we work.</h2><p>A structured way of thinking keeps planning, visualization, and the intended result connected throughout the design journey.</p></div><ol>{principles.map((item) => <li key={item.number}><span className="type-label">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-development"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">04 / From drawing to built form</p><span /></div><div className="civil-editorial-development__heading"><h2>A continuous line from plan to construction.</h2><p>Controlled visual stages can be replaced with approved client material as the project record develops.</p></div><ol>{development.map((label, index) => <li key={label}><span className="type-label">0{index + 1}</span><div className="civil-editorial-development__diagram" aria-hidden="true"><span /></div><h3>{label}</h3>{index < development.length - 1 && <b aria-hidden="true">→</b>}</li>)}</ol></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-work"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">05 / Selected work</p><span /></div><div className="civil-editorial-work__intro"><h2>Project material in context.</h2><TextLink to={routePaths.spoorthi.projects} variant="arrow">View all projects</TextLink></div>{demoProjects.length ? <div className="civil-editorial-work__list">{demoProjects.map((project, index) => <article key={project.id}><SpoorthiEditorialMedia label={project.category} aspect={index === 1 ? 'landscape' : 'wide'} /><div><p className="type-label">Temporary demonstration / 0{index + 1}</p><h3>{project.title}</h3><p>{project.summary}</p><TextLink to={`${routePaths.spoorthi.projects}/${project.id}`} variant="arrow">View project</TextLink></div></article>)}</div> : <p className="civil-editorial-empty">Verified project material will appear here when approved.</p>}</PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-closing"><PageContainer><div className="civil-editorial-closing__grid"><div><p className="type-label">06 / Closing</p><h2>Design with intent.<br /><em>Build with clarity.</em></h2><TextLink to={routePaths.spoorthi.contact} variant="arrow">Contact Spoorthi</TextLink></div><SpoorthiEditorialMedia media={constructionVisual} label="Built form study" aspect="wide" /></div></PageContainer></SectionWrapper>
  </div>
}

export default CivilConstructionPage
