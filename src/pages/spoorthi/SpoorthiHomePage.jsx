import { ArrowDown, ArrowRight, ArrowUpRight, Building2, Check, Compass, Cuboid, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import { routePaths } from '../../data/routePaths.js'
import { spoorthiProjectCollection } from '../../data/spoorthi/projectsPage.js'
import '../../styles/spoorthi-home-structure.css'

const paths = routePaths.spoorthi
const services = [
  { number: '01', icon: Building2, title: 'Civil construction', description: 'Bring your plans to life with a considered approach to structure, materials, and execution.', details: ['Residential & commercial', 'Structural planning', 'Construction coordination'], path: paths.civilConstruction },
  { number: '02', icon: Compass, title: 'Architecture & planning', description: 'Thoughtful layouts that balance the way you live with the possibilities of your site.', details: ['Architectural concepts', '2D plans & layouts', 'Design development'], path: paths.design3d },
  { number: '03', icon: Cuboid, title: '3D & spatial experiences', description: 'See the bigger picture. Explore form, finishes, and light before you move into construction.', details: ['3D visualization', 'Material exploration', 'Interactive spatial studies'], path: paths.vr },
]
const process = [
  { title: 'Listen & discover', description: 'We begin with your vision, your site, and what matters most to you.' },
  { title: 'Plan & design', description: 'Translate the brief into practical plans and considered architectural ideas.' },
  { title: 'Visualize & refine', description: 'Explore the space in 3D, review the details, and shape a shared direction.' },
  { title: 'Build with clarity', description: 'Carry the design forward with coordinated drawings and clear execution intent.' },
]
const faqs = [
  { question: 'Where do I start with a new project?', answer: 'Start with a project brief. Share the project type, location, approximate area, and your priorities through our contact page. You can prepare a brief and email it directly to Spoorthi.' },
  { question: 'Can I explore the design before construction?', answer: 'Yes. Our design journey connects 2D planning with 3D visualization so you can review layouts, proportions, and materials. The spatial experience page also includes an interactive concept study you can explore in your browser.' },
  { question: 'How is the project cost determined?', answer: 'Cost depends on the location, area, scope, materials, and finish level. Use the project planner to organize your requirements, then request a quotation based on your specific brief.' },
  { question: 'Are the images on this website completed projects?', answer: 'The current collection contains clearly labeled architectural concept studies and illustrative images. They demonstrate design ideas and are not presented as completed client projects.' },
]

function Eyebrow({ children, number }) {
  return <p className="sh-eyebrow">{number && <span>{number} /</span>}{children}</p>
}

function HomeLink({ to, children, secondary = false, className = '' }) {
  return <Link to={to} className={['sh-button', secondary ? 'sh-button--secondary' : '', className].filter(Boolean).join(' ')}>{children}<ArrowUpRight size={17} aria-hidden="true" /></Link>
}

function SpoorthiHomePage() {
  return <div className="spoorthi-home">
    <section className="sh-hero" aria-labelledby="home-title">
      <PageContainer>
        <div className="sh-hero__intro">
          <div><Eyebrow>Architecture. Construction. Possibility.</Eyebrow><h1 id="home-title">Great spaces.<br /><em>Start with vision.</em></h1></div>
          <div className="sh-hero__aside"><p>From the first idea to the final detail, we bring design and construction together to create spaces with purpose.</p><HomeLink to={paths.contact}>Let’s build something</HomeLink></div>
        </div>
        <div className="sh-hero__image">
          <img src="/assets/spoorthi/architecture.webp" alt="Architectural concept of a contemporary home with concrete planes, warm timber screens, and landscaped gardens at sunset" width="1536" height="1024" fetchPriority="high" loading="eager" />
          <div className="sh-hero__image-caption"><span className="sh-image-label">A vision of considered living</span><span>Residential architecture · Concept study</span></div>
          <Link className="sh-hero__image-link" to={paths.design3d} aria-label="Explore our architectural design approach"><ArrowUpRight size={27} aria-hidden="true" /></Link>
          <span className="sh-hero__image-index" aria-hidden="true">01 — THE POSSIBILITIES</span>
        </div>
        <div className="sh-hero__foot"><p><span className="sh-status-dot" />Thoughtfully designed. Purposefully built.</p><a href="#our-approach">Discover Spoorthi <ArrowDown size={14} aria-hidden="true" /></a></div>
      </PageContainer>
    </section>

    <SectionWrapper id="our-approach" className="sh-about">
      <PageContainer><div className="sh-about__grid">
        <div className="sh-about__visual"><img src="/assets/spoorthi/design-studio.webp" alt="Architectural model, drawings, and material samples on a design studio worktable" width="1536" height="1024" loading="lazy" /><div className="sh-about__visual-note"><Layers3 size={25} strokeWidth={1.3} aria-hidden="true" /><span>One vision.<br /><strong>Every detail connected.</strong></span></div></div>
        <div className="sh-about__copy"><Eyebrow number="01">The Spoorthi approach</Eyebrow><h2>Good design is only<br />the <em>beginning.</em></h2><p>It takes clear planning, thoughtful decisions, and careful execution to turn an idea into a place that feels right.</p><p>At Spoorthi Infra, we connect architecture, visualization, and construction in one continuous journey. So the space you imagine stays at the heart of the space you build.</p><ul className="sh-checks">{['Design that responds to your life', 'Clarity before construction begins', 'A connected view from plan to built form'].map(item => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul><Link className="sh-text-link" to={paths.civilConstruction}>Get to know our approach <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </div></PageContainer>
    </SectionWrapper>

    <SectionWrapper id="services" className="sh-services">
      <PageContainer><div className="sh-section-head"><div><Eyebrow number="02">What we do</Eyebrow><h2>From a blank page.<br />To a <em>better place.</em></h2></div><p>Connected expertise for every stage of your project. Thoughtful in design. Practical in delivery.</p></div>
        <div className="sh-service-grid">{services.map(({ icon: Icon, ...service }) => <Link className="sh-service" key={service.number} to={service.path}><div className="sh-service__top"><Icon size={31} strokeWidth={1.2} aria-hidden="true" /><span>{service.number}</span></div><h3>{service.title}</h3><p>{service.description}</p><ul>{service.details.map(detail => <li key={detail}>{detail}</li>)}</ul><span className="sh-service__link">Explore service <ArrowUpRight size={18} aria-hidden="true" /></span></Link>)}</div>
      </PageContainer>
    </SectionWrapper>

    <SectionWrapper id="projects" className="sh-projects">
      <PageContainer><div className="sh-section-head"><div><Eyebrow number="03">Ideas taking shape</Eyebrow><h2>A closer look at<br />the <em>possibilities.</em></h2></div><Link to={paths.projects} className="sh-text-link">Explore the collection <ArrowUpRight size={18} aria-hidden="true" /></Link></div><p className="sh-projects__note">Architectural concept studies exploring structure, space, and the way we live.</p>
        <div className="sh-project-grid">{spoorthiProjectCollection.slice(0, 3).map((project, index) => <Link className="sh-project" key={project.id} to={paths.projects + '/' + project.id}><div className="sh-project__image"><img src={project.coverImage} alt={project.coverAlt} width="1536" height="1024" loading="lazy" /><span className="sh-project__badge">Concept study</span><span className="sh-project__arrow"><ArrowUpRight size={23} aria-hidden="true" /></span></div><div className="sh-project__meta"><span>0{index + 1} / {project.category}</span><span>Spoorthi Infra</span></div><h3>{project.title}</h3></Link>)}</div>
      </PageContainer>
    </SectionWrapper>

    <SectionWrapper id="process" className="sh-process">
      <PageContainer><div className="sh-section-head"><div><Eyebrow number="04">A clear way forward</Eyebrow><h2>Your vision.<br />A <em>considered journey.</em></h2></div><p>Great outcomes begin with a clear process. Here’s how an idea moves from conversation to construction.</p></div><ol className="sh-process-grid">{process.map((step, index) => <li key={step.title}><div className="sh-process__number"><span>0{index + 1}</span>{index < process.length - 1 && <ArrowRight size={18} aria-hidden="true" />}</div><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></PageContainer>
    </SectionWrapper>

    <SectionWrapper className="sh-spatial">
      <PageContainer><div className="sh-spatial__grid"><div className="sh-spatial__copy"><Eyebrow number="05">See it before you build it</Eyebrow><h2>Don’t just imagine<br />the space.<br /><em>Explore it.</em></h2><p>A drawing tells one part of the story. A spatial study helps you explore scale, light, and materials, bringing your future space into clearer view.</p><HomeLink to={paths.vr}>Explore the spatial experience</HomeLink><span className="sh-spatial__note">Interactive concept study · No headset needed</span></div><Link className="sh-spatial__image" to={paths.vr} aria-label="Open the interactive interior concept study"><img src="/assets/spoorthi/spatial.webp" alt="Warm contemporary interior concept with natural stone, timber, and a framed view into a light-filled room" width="1536" height="1024" loading="lazy" /><span><Cuboid size={18} aria-hidden="true" />Step into the details<ArrowUpRight size={21} aria-hidden="true" /></span></Link></div></PageContainer>
    </SectionWrapper>

    <SectionWrapper id="questions" className="sh-faq">
      <PageContainer><div className="sh-faq__grid"><div><Eyebrow number="06">A little more clarity</Eyebrow><h2>Big ideas.<br /><em>Practical questions.</em></h2><p>Every project begins with a conversation. Here are a few helpful places to start.</p><Link className="sh-text-link" to={paths.contact}>Talk through your project <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="sh-faq__list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div></div></PageContainer>
    </SectionWrapper>

    <section className="sh-cta" aria-labelledby="cta-title"><PageContainer><div className="sh-cta__grid"><div><Eyebrow>A place to begin</Eyebrow><h2 id="cta-title">Your next chapter.<br /><em>Let’s build it together.</em></h2></div><div><p>A home, a workspace, or something entirely new. Bring your idea. We’ll help you find the way forward.</p><HomeLink to={paths.contact}>Start your project</HomeLink></div></div><div className="sh-cta__line" aria-hidden="true"><span /><span /><span /></div></PageContainer></section>
  </div>
}

export default SpoorthiHomePage
