import { Link } from 'react-router-dom'
import { ArrowRight, Box, CircleCheck, Compass, Gem, Layers, MessageCircle, PencilRuler, Scan, Workflow } from 'lucide-react'
import TejesHomeMenu, { TejesWordmark } from '../../components/tejes/TejesHomeMenu.jsx'
import { tejesHomeStructure as content } from '../../data/tejes/homeStructure.js'
import '../../styles/tejes-home-reference.css'

const icons = [PencilRuler, Scan, Box, Gem, Workflow, Layers, Compass, CircleCheck]
const number = i => String(i + 1).padStart(2, '0')
function Icon({ index = 0 }) {
  const Symbol = icons[index % icons.length]
  return <Symbol className="th-icon" strokeWidth={1.35} aria-hidden="true" />
}
function Label({ children }) { return <p className="th-label">{children}</p> }
function Photo({ src, alt = '', className = '', priority = false }) {
  const image = typeof src === 'string' ? { src } : src
  const material = image.src.includes('/material-')
  const card = image.src.includes('/category-') || image.src.includes('/development-')
  const sizes = priority ? '(max-width: 600px) 100vw, 66vw' : material ? '(max-width: 600px) 20vw, 7vw' : card ? '(max-width: 600px) 43vw, 14vw' : '(max-width: 600px) 100vw, 52vw'
  return <img className={`th-photo ${className}`} src={image.src} srcSet={image.srcSet} sizes={image.srcSet ? sizes : undefined} width={image.width} height={image.height} style={{ objectPosition: image.focalPoint }} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
}
function Action({ to, href, children, variant = 'text' }) {
  const Tag = to ? Link : 'a'
  return <Tag to={to} href={href} className={`th-action th-action--${variant}`}>{children}<ArrowRight size={13} strokeWidth={1.5} aria-hidden="true" /></Tag>
}
function Heading({ label, children }) {
  return <div className="th-heading"><Label>{label}</Label><h2>{children}</h2></div>
}
function PrincipleStrip({ items, className = '' }) {
  return <ul className={`th-principle-strip ${className}`}>{items.map((title, i) => <li key={title}><Icon index={i} /><span>{title}</span></li>)}</ul>
}

export default function TejesHomePage() {
  const { media, founder, founderPrinciples, capabilities, story, achievements, philosophy, rooms, services, process, quality, featured, development, materials, approach, reviews, why, links } = content
  return <div className="tejes-reference-home th-home">
    <TejesHomeMenu />
    <section id="tejes-top" className="th-section th-hero" aria-labelledby="tejes-hero-heading">
      <Photo src={media.hero} alt="Sunlit luxury living room with warm neutral seating, sculptural tables and timber details" className="th-hero-photo" priority />
      <div className="th-hero-glass" aria-hidden="true" />
      <div className="th-hero-copy"><Label>Tejes Interiors</Label><h1 id="tejes-hero-heading">Designing spaces.<br />Defining experiences.</h1><p>Thoughtful interiors shaped around the way<br className="th-desktop-break" /> people live, move and experience space.</p><div className="th-actions"><Action to={links.projects} variant="primary">Explore our work</Action><Action href="#tejes-about" variant="outline">Discover Tejes</Action></div></div>
      <a className="th-scroll" href="#tejes-about"><span aria-hidden="true">↓</span>Scroll to explore</a><span className="th-hero-index" aria-hidden="true">01 / 01 <i /></span>
    </section>
    <section id="tejes-about" className="th-section th-about" tabIndex={-1}>
      <Photo src={media.about} alt="Architectural interior with stone walls, a glazed partition and overhead daylight" className="th-about-photo" />
      <div className="th-about-copy"><Heading label="About Tejes Interiors">More than an interior.<br />A space designed for you.</Heading><p>Tejes Interiors approaches interior design through space planning, functionality, materials, visual character and thoughtful detailing. We create spaces that look beautiful, work effortlessly and feel like home.</p></div><PrincipleStrip items={capabilities} className="th-capabilities" />
    </section>
    <section id="tejes-founder" className="th-section th-founder">
      <Photo src={media.founder} alt="Founder portrait placeholder; approved photograph to be supplied" className="th-founder-photo" />
      <div className="th-founder-copy"><Heading label="Founder / Owner">The person behind Tejes.</Heading><p className="th-founder-name">{founder.name || founder.role}</p>{founder.name && <p className="th-founder-role">{founder.role}</p>}<p>{founder.description}</p><Action to={links.contact}>Read more</Action></div>
      <ul className="th-founder-principles">{founderPrinciples.map(([title, description], i) => <li key={title}><Icon index={i} /><div><h3>{title}</h3><p>{description}</p></div></li>)}</ul>
    </section>
    <section id="tejes-story" className="th-section th-story"><div><Heading label="Our story">Why Tejes exists.</Heading><p>A journey driven by passion, purpose and a belief that great spaces can change the way we live.</p></div><ol className="th-timeline">{story.map(([title, description], i) => <li key={title}><div className="th-timeline-mark"><Icon index={i} /><span aria-hidden="true" /></div><h3><span className="th-sr-only">{number(i)} </span>{title}</h3><p>{description}</p></li>)}</ol></section>
    <section className="th-section th-achievements"><Photo src={media.achievements} className="th-achievements-photo" /><Heading label="Our achievements">The journey so far.</Heading><ul className="th-achievement-strip">{achievements.map(({ label, value }) => <li key={label}><strong aria-label={value === null ? 'Value to be confirmed' : undefined}>{value ?? '—'}</strong><span>{label}</span></li>)}</ul></section>
    <section id="tejes-philosophy" className="th-section th-philosophy"><Photo src={media.philosophy} alt="Architectural glass partition, matte plaster and precise black steel framing" className="th-philosophy-photo" /><div className="th-philosophy-copy"><Heading label="Design philosophy">Design is more than appearance.</Heading><p>It’s about how a space makes you feel, how it works,<br className="th-desktop-break" /> and how it fits into your life.</p></div><ol className="th-philosophy-list">{philosophy.map((title, i) => <li key={title}><span>{number(i)}</span><h3>{title}</h3></li>)}</ol></section>
    <section id="tejes-categories" className="th-section th-categories"><Heading label="What Tejes designs">Spaces for every aspect of life.</Heading><ul className="th-category-grid">{rooms.map(({ title, image, alt }, i) => <li key={title}><Link to={links.services} className="th-category"><Photo src={image} alt={alt} /><div><span className="th-category-number">{number(i)}</span><h3>{title}</h3><ArrowRight size={13} aria-hidden="true" /></div></Link></li>)}</ul></section>
    <section id="tejes-services" className="th-section th-services"><Heading label="Our services">From consultation to creation.</Heading><ol className="th-service-grid">{services.map((title, i) => <li key={title}><Link to={i === 3 || i === 4 || i === 5 ? links.development : links.services}><div><Icon index={i} /><span>{number(i)}</span></div><h3>{title}</h3></Link></li>)}</ol></section>
    <section className="th-section th-process"><Photo src={media.process} alt="Soft neutral living space with timber panels and daylight" className="th-process-photo" /><div className="th-process-copy"><Heading label="How we work">From idea to real space.</Heading><ol className="th-process-steps">{process.map(([title, description], i) => <li key={title}><span className="th-step-number">{number(i)}</span><h3>{title}</h3><p>{description}</p></li>)}</ol></div></section>
    <section className="th-section th-quality"><Photo src={media.quality} alt="" className="th-quality-photo" /><Heading label="Quality & precision">Precision in every detail.</Heading><ul className="th-quality-grid">{quality.map(([title, description], i) => <li key={title}><Icon index={i} /><h3>{title}</h3><p>{description}</p></li>)}</ul></section>
    <section id="tejes-project" className="th-section th-featured"><Link to={links.projects} className="th-featured-image" aria-label="Explore the featured residential design study"><Photo src={media.project} alt="Illustrative garden-facing residence with a stone island, timber flooring and expansive glazing" /></Link><div className="th-featured-copy"><Label>Project / 01</Label><h2>Featured project<br /><span>{featured.title}</span></h2><p className="th-project-meta">{featured.type}<span aria-hidden="true"> | </span>Design study</p><p>{featured.description}</p><Action to={links.projects}>View project</Action></div></section>
    <section id="tejes-development" className="th-section th-development"><Heading label="How we work">2D → 3D → Visualization → VR.</Heading><ol className="th-development-grid">{development.map(({ title, image, path }, i) => <li key={title}><Link to={path}><Photo src={image} alt={`${title} preview of the interior design study`} /><h3><span>{number(i)}</span>{title}</h3></Link></li>)}</ol></section>
    <section className="th-section th-materials"><div><Heading label="Materials & finishes">The materials define the mood.</Heading><p>Textures that bring warmth, character and calm.</p></div><ul className="th-material-strip">{materials.map(({ title, image }) => <li key={title}><Photo src={image} alt={`${title} material and finish reference`} /><h3>{title}</h3></li>)}</ul></section>
    <section id="tejes-approach" className="th-section th-approach" tabIndex={-1}><Heading label="Professional approach">Designed with intention.<br />Delivered with precision.</Heading><PrincipleStrip items={approach} /></section>
    <section id="tejes-experience" className="th-section th-experience" aria-labelledby="tejes-experience-heading"><div className="th-experience-intro"><Label>Client experience</Label><h2 id="tejes-experience-heading">What our clients say.</h2><p>Clear conversations.<br />Considered spaces.</p><Action to={links.contact}>Share your experience</Action></div><div id="tejes-reviews" className="th-reviews" aria-label="Client reviews">{reviews.length ? reviews.map(({ id, quote, author }) => <blockquote key={id || quote}><MessageCircle className="th-icon" size={16} strokeWidth={1.2} aria-hidden="true" /><p>{quote}</p>{author && <cite>{author}</cite>}</blockquote>) : <div className="th-review-empty"><MessageCircle className="th-icon" size={16} strokeWidth={1.2} aria-hidden="true" /><p>{content.reviewsEmptyState}</p></div>}</div></section>
    <section className="th-section th-why"><Heading label="Why Tejes">Why Tejes Interiors.</Heading><PrincipleStrip items={why} /></section>
    <section className="th-section th-final"><Photo src={media.final} alt="Quiet seating corner with a grey upholstered armchair, timber table and indoor greenery" className="th-final-photo" /><div><h2>Your space. Your life.<br />Your way of living.</h2><p>Interiors designed around the way you experience space.</p><Action to={links.contact} variant="primary">Start a project</Action></div></section>
    <section id="tejes-contact" className="th-section th-contact"><Photo src={media.contact} alt="Refined dining composition with sculptural gold lighting and upholstered chairs" className="th-contact-photo" /><div><h2>Let’s talk about your space.</h2><ul><li>Planning a new interior?</li><li>Redesigning an existing space?</li><li>Looking for a complete interior solution?</li></ul></div><Action to={links.contact} variant="outline">Get in touch</Action></section>
    <footer className="th-section th-footer"><TejesWordmark /><nav aria-label="Tejes footer"><a href="#tejes-about">About</a><Link to={links.services}>Services</Link><Link to={links.projects}>Projects</Link><Link to={links.contact}>Contact</Link></nav><div><p>Interior design <span>|</span> Spatial design <span>|</span> 3D visualization <span>|</span> Materials <span>|</span> Execution</p><small>© {new Date().getFullYear()} Tejes Interiors. All rights reserved.</small></div></footer>
  </div>
}


