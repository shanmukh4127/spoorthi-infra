import { ArrowRight, ArrowUpRight, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import { routePaths } from '../../data/routePaths.js'
import usePublicProjects from '../../data/usePublicProjects.js'
import { companyStory } from '../../data/spoorthi/companyStory.js'
import SpoorthiHomeJourney from '../../components/spoorthi/SpoorthiHomeJourney.jsx'
import SpoorthiFeaturedProjects from '../../components/spoorthi/SpoorthiFeaturedProjects.jsx'
import '../../styles/spoorthi-home-structure.css'

const paths = routePaths.spoorthi
const services = [
  { number: '01', title: 'Civil construction', description: 'Connect the layout, structure and architectural details with the space you want to create.', path: paths.civilConstruction },
  { number: '02', title: 'Architecture & planning', description: 'Explore layouts, circulation, proportion and the relationships between spaces.', path: paths.design3d },
  { number: '03', title: '3D & spatial experiences', description: 'Review form, material and light through visualization and an interactive concept study.', path: paths.vr },
]
const faqs = [
  ['Where do I start?', 'Share the project type, location, approximate area and your priorities through our contact page. You can prepare a brief and email it directly to Spoorthi.'],
  ['Can I explore a design before construction?', 'The design pages connect 2D planning with 3D visualization. The spatial experience also includes an interactive concept study you can explore in your browser.'],
  ['How is project cost determined?', 'Cost depends on location, area, scope, materials and finish level. Use the project planner to organize your requirements, then request a quotation based on your brief.'],
  ['Are these completed client projects?', 'The current illustrated collection contains architectural concept studies. They demonstrate design ideas and are not presented as completed client projects.'],
]

function Eyebrow({ children, number }) {
  return <p className="sh-eyebrow">{number && <span>{number} /</span>}{children}</p>
}
function HomeLink({ to, children }) {
  return <Link to={to} className="sh-button">{children}<ArrowUpRight size={18} aria-hidden="true" /></Link>
}
function SpoorthiHomePage() {
  const { projects: allProjects, services: publishedServices, status } = usePublicProjects()
  const visibleServices = status === 'ready' ? services.filter(service => publishedServices.some(saved => saved.name.toLowerCase() === service.title.toLowerCase())) : []
  const founder = companyStory.founder
  const founderReady = founder.approved && founder.name && founder.role && founder.biography
  const milestones = companyStory.milestones.filter(item => item.approved && item.title)

  return <div className="spoorthi-home">
    <SpoorthiHomeJourney />
    <div className="sh-story">
      <section id="spoorthi-home-content" tabIndex="-1" className="sh-founder" data-story-section="leadership" aria-labelledby="leadership-title">
        <PageContainer>
          <div className="sh-story-opening"><span>Spoorthi Infra / The company story</span><a href="#our-approach">From vision to built form <ArrowRight size={14} aria-hidden="true" /></a></div>
          <div className="sh-founder__grid">
            <figure className="sh-founder__portrait">
              {founderReady && founder.portrait ? <img src={founder.portrait} alt={founder.portraitAlt || founder.name} width="800" height="1000" loading="lazy" /> : <div className="sh-portrait-pending"><ImageIcon size={30} strokeWidth={1} aria-hidden="true" /><span>Leadership portrait</span><small>Approved photograph pending</small></div>}
              <figcaption>{founderReady ? founder.name : 'Founder & leadership'}<span>{founderReady ? founder.role : 'Profile awaiting client approval'}</span></figcaption>
            </figure>
            <div className="sh-founder__copy"><h1 id="leadership-title">{founderReady ? founder.name : <>The people behind<br /><em>the vision.</em></>}</h1>
              {founderReady ? <><p className="sh-lead">{founder.role}</p><p>{founder.biography}</p></> : <><p className="sh-lead">Every company story begins with its people.</p><p>The founder’s name, role and biography will be introduced here following client confirmation, alongside an approved portrait.</p></>}
              <a className="sh-text-link" href="#our-approach">Discover the Spoorthi approach <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </PageContainer>
      </section>

    </div>
    <SpoorthiFeaturedProjects projects={allProjects} status={status} />
    <div className="sh-story">
      <SectionWrapper id="our-approach" className="sh-about"><PageContainer>
        <div data-story-section="about" className="sh-about__grid"><div><Eyebrow number="01">About Spoorthi</Eyebrow><h2>One idea.<br /><em>Every detail connected.</em></h2></div><div className="sh-about__copy"><p className="sh-lead">Planning, design and construction, connected.</p><p>Explore architectural concepts and 3D studies, or share your project brief with Spoorthi Infra.</p></div></div>
        <figure className="sh-about__image"><img src="/assets/spoorthi/design-studio.webp" alt="Illustrative architectural model, drawings and material samples on a studio worktable" width="1536" height="1024" loading="lazy" /><figcaption>Plan / Form / Material / Space<span>Design process illustration</span></figcaption></figure>
      </PageContainer></SectionWrapper>

      <SectionWrapper id="milestones" className="sh-milestones"><PageContainer><div className="sh-milestones__grid" data-story-section="milestones"><div><Eyebrow number="02">Achievements & milestones</Eyebrow><h2>A story recorded<br /><em>with care.</em></h2></div><div className="sh-timeline">{milestones.length ? milestones.map((item, index) => <article key={`${item.title}-${index}`}><span>{item.date}</span><h3>{item.title}</h3><p>{item.description}</p></article>) : <article><h3>Milestone record pending.</h3><p>Verified company milestones, credentials and achievements are awaiting client confirmation. Approved records will appear here with their dates and context.</p></article>}</div></div></PageContainer></SectionWrapper>

      <SectionWrapper id="services" className="sh-capabilities"><PageContainer><div data-story-section="capabilities"><div className="sh-section-head"><div><Eyebrow number="03">Construction capabilities</Eyebrow><h2>From the plan.<br /><em>Into perspective.</em></h2></div><p>Explore the services presented across Spoorthi’s construction, design and spatial experience pages.</p></div><div className="sh-service-list">{visibleServices.map(service => <Link key={service.number} to={service.path}><span>{service.number}</span><h3>{service.title}</h3><p>{service.description}</p><ArrowUpRight size={24} strokeWidth={1.2} aria-hidden="true" /></Link>)}</div>
        <div className="sh-spatial"><Link to={paths.vr} className="sh-spatial__image" aria-label="Explore the interactive spatial concept"><img src="/assets/spoorthi/spatial.webp" alt="Illustrative stone and timber interior framing a naturally lit room" width="1536" height="1024" loading="lazy" /></Link><div><Eyebrow>See it before you build it</Eyebrow><h3>Step into the details.</h3><p>Explore scale, light and materials in an interactive spatial concept. No headset needed.</p><Link to={paths.vr} className="sh-text-link">Explore the spatial experience <ArrowUpRight size={18} aria-hidden="true" /></Link></div></div>
        <div className="sh-faq"><h3>Before we begin.</h3><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></div>
      </PageContainer></SectionWrapper>

      <section className="sh-contact" id="start-a-conversation" data-story-section="contact" aria-labelledby="contact-title"><PageContainer><Eyebrow number="04">A conversation is the first step</Eyebrow><div className="sh-contact__grid"><h2 id="contact-title">Space for<br /><em>your next idea.</em></h2><div><p>A site, a brief, or a question. Tell us what you have in mind and explore the next step with Spoorthi.</p><HomeLink to={paths.contact}>Discuss your project</HomeLink><span>Architecture / Construction / Spatial experience</span></div></div><div className="sh-brand-rule" aria-hidden="true"><i /><i /><i /><i /></div></PageContainer></section>
    </div>
  </div>
}
export default SpoorthiHomePage
