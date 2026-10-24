import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { routePaths } from '../../data/routePaths.js'
import { tejesServicesPage as content } from '../../data/tejes/servicesPage.js'
import { ProjectPhoto, TejesProjectsFooter } from './ProjectsPage.jsx'
import '../../styles/tejes-services.css'

function Lines({ children }) {
  return children.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)
}

function Photo({ media, ...props }) { return <ProjectPhoto image={media.image} alt={media.alt} {...props} /> }

function Botanical({ className = '' }) {
  return <svg className={`ts-botanical ${className}`} viewBox="0 0 180 400" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.2"><path d="M53 396C70 297 88 191 145 8M65 337C39 306 22 277 14 247M80 275C112 249 137 228 159 192M100 209C77 178 57 153 44 123M120 135C145 114 159 91 169 63" /></g><g fill="currentColor"><path d="M141 23Q113 40 123 71Q147 64 141 23M127 74Q153 68 163 38Q132 41 127 74M116 107Q86 94 88 62Q115 66 116 107M103 150Q125 123 148 128Q143 149 103 150M94 183Q64 168 69 137Q94 147 94 183M83 231Q109 201 128 211Q113 239 83 231M73 284Q47 259 53 239Q77 251 73 284M67 315Q95 284 115 295Q96 324 67 315M48 313Q20 300 18 280Q45 284 48 313M33 282Q9 272 8 253Q32 255 33 282M102 254Q133 248 135 226Q110 228 102 254M126 228Q151 222 156 201Q132 202 126 228M60 363Q31 345 31 327Q56 336 60 363" /></g></svg>
}

function InteriorDesignPage() {
  return <div className="th-home tp-page ts-page">
    
    <section className="ts-hero" aria-labelledby="services-title">
      <Link className="ts-back" to={routePaths.tejes.home}><ArrowLeft size={12} aria-hidden="true" /> Back to home</Link>
      <Botanical className="ts-hero-botanical" />
      <div className="ts-hero-copy"><p className="ts-label">{content.hero.label}</p><h1 id="services-title"><Lines>{content.hero.title}</Lines></h1><p>{content.hero.introduction}</p><div className="ts-hero-tail"><span className="ts-short-rule" /><p className="ts-script"><Lines>{content.hero.signature}</Lines></p></div></div>
      <div className="ts-hero-image"><Photo media={content.hero.image} eager sizes="(max-width: 600px) 100vw, 47vw" /></div>
      <aside className="ts-hero-rail" aria-hidden="true"><p><Lines>{content.hero.sideNote}</Lines></p><span className="ts-short-rule" /></aside>
    </section>

    <section className="ts-solutions" aria-labelledby="solutions-title"><div className="ts-solutions-heading"><div><p className="ts-label">{content.solutions.label}</p><h2 id="solutions-title"><Lines>{content.solutions.heading}</Lines></h2></div><p>{content.solutions.description}</p></div>{!content.confirmed && <p className="ts-content-notice">{content.solutions.notice}</p>}
      <div className="ts-solutions-body"><div className="ts-service-grid">{content.services.map(service => <article className="ts-service" key={service.id} aria-labelledby={`service-${service.id}`}><Link className="ts-service-link" to={routePaths.tejes.contact} aria-label={`Discuss ${service.title}${content.confirmed ? "" : "; scope to be confirmed"}`}><div className="ts-service-image"><Photo media={service.image} sizes="(max-width: 600px) 100vw, (max-width: 900px) 43vw, 29vw" /></div><div className="ts-service-copy"><span className="ts-service-number">{service.number}</span><h3 id={`service-${service.id}`}><Lines>{service.titleLines || [service.title]}</Lines></h3><p>{service.description}</p><span className="ts-service-arrow" aria-hidden="true"><ArrowRight size={13} strokeWidth={1.25} /></span></div></Link></article>)}</div><aside className="ts-solutions-rail" aria-hidden="true"><Botanical /><p><Lines>{content.solutions.sideNote}</Lines></p><span className="ts-short-rule" /></aside></div>
    </section>

    <section className="ts-process" aria-labelledby="process-title"><div className="ts-process-editorial"><Photo media={content.process.image} sizes="(max-width: 600px) 100vw, 51vw" /><div className="ts-process-copy"><p className="ts-label">{content.process.label}</p><h2 id="process-title"><Lines>{content.process.heading}</Lines></h2><p>{content.process.description}</p><span className="ts-short-rule" /></div></div><div className="ts-process-details"><ol className="ts-process-stages">{content.process.stages.map(stage => <li key={stage.number}><span className="ts-process-number" aria-hidden="true">{stage.number}</span><div><h3>{stage.title}</h3><p>{stage.description}</p></div></li>)}</ol><p className="ts-script ts-process-signature" aria-hidden="true"><Lines>{content.process.signature}</Lines></p><Botanical className="ts-process-botanical" />{!content.confirmed && <p className="ts-process-notice">{content.process.notice}</p>}</div></section>

    <section className="ts-closing" aria-labelledby="services-closing-title"><Photo media={content.closing.image} sizes="100vw" /><div className="ts-closing-copy"><p className="ts-label">{content.closing.label}</p><h2 id="services-closing-title"><Lines>{content.closing.title}</Lines></h2><p>{content.closing.description}</p><Link className="ts-button" to={routePaths.tejes.contact}>{content.closing.action} <ArrowRight size={13} aria-hidden="true" /></Link></div><p className="ts-script ts-closing-signature" aria-hidden="true"><Lines>{content.closing.signature}</Lines></p></section>
    <TejesProjectsFooter activePage="services" />
  </div>
}

export default InteriorDesignPage
