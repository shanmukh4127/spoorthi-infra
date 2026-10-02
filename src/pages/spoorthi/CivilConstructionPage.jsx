import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiEditorialMedia from '../../components/spoorthi/SpoorthiEditorialMedia.jsx'
import { civilConstruction } from '../../data/spoorthi/index.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/civil-construction.css'

const constructionVisual = civilConstruction.intro.media

function CivilConstructionPage() {
  const principles = [
    { number: '01', title: 'A clear starting point', description: 'Discuss your site, priorities and budget so the scope reflects what you need.' },
    { number: '02', title: 'Design you can understand', description: 'Use drawings and spatial studies to review the layout, proportions and materials together.' },
    { number: '03', title: 'Attention to the details', description: 'Bring technical information and design decisions into one coordinated conversation.' },
    { number: '04', title: 'A connected process', description: 'Keep the original brief in view as the project moves from planning toward construction.' },
  ]
  const connections = ['Your brief', 'The design', 'The structure', 'The space']
  const development = ['Plan & layout', 'Form & proportion', 'Material & light', 'Build & detail']
  const serviceLinks = [
    { number: '01', title: 'Plan your project', description: 'Share the site location, approximate area and what you want the space to do. A useful brief starts with the right questions.', path: routePaths.spoorthi.contact, label: 'Discuss your requirements' },
    { number: '02', title: 'See the design', description: 'Explore how plans, models and architectural visualization help make a proposed space easier to understand.', path: routePaths.spoorthi.design3d, label: 'Explore design & 3D' },
    { number: '03', title: 'Look a little closer', description: 'Consider the materials, proportions and connection to the outdoors with our interactive interior concept.', path: routePaths.spoorthi.vr, label: 'Explore the concept' },
  ]
  return <div className="civil-construction-page">
    <SectionWrapper className="civil-editorial-hero"><PageContainer><div className="civil-editorial-hero__grid"><div><p className="type-label">Spoorthi Infra / Civil Construction</p><h1>Built with<br /><em>intention.</em></h1><p className="civil-editorial-hero__statement">{civilConstruction.intro.description}</p><div className="civil-editorial-hero__actions"><TextLink to={routePaths.spoorthi.contact} variant="arrow">Plan your project</TextLink><TextLink href="#construction-approach" variant="arrow">Our approach</TextLink></div></div><SpoorthiEditorialMedia media={constructionVisual} label="Civil construction study" aspect="wide" className="civil-editorial-hero__media" /><p className="civil-editorial-hero__note type-label">Structure / Form / Space</p></div></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-practice"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">01 / The practice</p><span /></div><div className="civil-editorial-practice__grid"><h2>Design intent becomes physical form.</h2><div><p>{civilConstruction.build.description}</p><p className="type-label">Structure / Form / Space</p></div><SpoorthiEditorialMedia media={constructionVisual} label="Architectural construction study" aspect="landscape" /></div></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-connections"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">02 / Connected practice</p><span /></div><h2>What civil construction connects.</h2><ol className="civil-editorial-connections__sequence">{connections.map((label, index) => <li key={label}><span className="type-label">0{index + 1}</span><strong>{label}</strong>{index < connections.length - 1 && <span className="civil-editorial-connections__arrow" aria-hidden="true">↓</span>}</li>)}</ol></PageContainer></SectionWrapper>
    <SectionWrapper id="construction-approach" className="civil-editorial-approach"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">03 / Approach</p><span /></div><div className="civil-editorial-approach__intro"><h2>Clarity at every stage.</h2><p>Thoughtful construction begins well before the site work. A shared brief and understandable drawings help turn individual decisions into a coherent space.</p></div><ol>{principles.map((item) => <li key={item.number}><span className="type-label">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-development"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">04 / From drawing to built form</p><span /></div><div className="civil-editorial-development__heading"><h2>A continuous line from plan to construction.</h2><p>Review the layout first. Develop its form, consider the finishes and coordinate the details. Each stage gives the next a clearer foundation.</p></div><ol>{development.map((label, index) => <li key={label}><span className="type-label">0{index + 1}</span><div className="civil-editorial-development__diagram" aria-hidden="true"><span /></div><h3>{label}</h3>{index < development.length - 1 && <b aria-hidden="true">→</b>}</li>)}</ol></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-work"><PageContainer><div className="civil-editorial-section-head"><p className="type-label">05 / Your next step</p><span /></div><div className="civil-editorial-work__intro"><h2>Bring your ideas into focus.</h2><TextLink to={routePaths.spoorthi.projects} variant="arrow">Explore the concept collection</TextLink></div><div className="civil-editorial-work__cards">{serviceLinks.map(item => <article key={item.number}><p className="type-label">{item.number}</p><h3>{item.title}</h3><p>{item.description}</p><TextLink to={item.path} variant="arrow">{item.label}</TextLink></article>)}</div></PageContainer></SectionWrapper>
    <SectionWrapper className="civil-editorial-closing"><PageContainer><div className="civil-editorial-closing__grid"><div><p className="type-label">06 / Closing</p><h2>Design with intent.<br /><em>Build with clarity.</em></h2><TextLink to={routePaths.spoorthi.contact} variant="arrow">Contact Spoorthi</TextLink></div><SpoorthiEditorialMedia media={constructionVisual} label="Built form study" aspect="wide" /></div></PageContainer></SectionWrapper>
  </div>
}

export default CivilConstructionPage
