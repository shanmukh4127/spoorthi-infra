import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import TejesContactEnquiryForm from '../../components/tejes/TejesContactEnquiryForm.jsx'
import { routePaths } from '../../data/routePaths.js'
import { contactPageMedia, tejesContactDetails } from '../../data/tejes/contactPage.js'
import { ProjectPhoto, TejesProjectsFooter } from './ProjectsPage.jsx'
import '../../styles/tejes-contact.css'

function ContactPhoto({ media, ...props }) {
  return <ProjectPhoto image={media.image} alt={media.alt} {...props} />
}

function ContactInfoRow({ icon: Icon, label, value, pending, href }) {
  return <div className="tc-info-row"><Icon size={26} strokeWidth={1.3} aria-hidden="true" /><div><p className="tc-label">{label}</p>{value ? href ? <a href={href}>{value}</a> : <p>{value}</p> : <p className="tc-pending">{pending}</p>}</div></div>
}

function safeExternalUrl(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : null } catch { return null }
}

export default function ContactPage() {
  const details = tejesContactDetails
  const mapUrl = details.address ? safeExternalUrl(details.mapUrl) : null
  const socials = details.socialLinks.filter(item => safeExternalUrl(item.url))
  return <div className="th-home tp-page tc-page">
    
    <section className="tc-hero" aria-labelledby="contact-title">
      <ContactPhoto media={contactPageMedia.hero} className="tc-hero-photo" eager sizes="(max-width: 600px) 100vw, 76vw" />
      <svg className="tc-hero-shape" viewBox="0 0 1440 590" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H420C450 85 491 170 520 260C578 439 616 573 838 590H0Z" fill="#f3ede2" /><path d="M0 575C213 543 275 589 420 547C605 493 659 591 866 590" fill="none" stroke="#fff9ec" strokeWidth="2" /></svg>
      <Link className="tc-back" to={routePaths.tejes.home}><ArrowLeft size={12} aria-hidden="true" /> Back to home</Link>
      <div className="tc-hero-copy"><p className="tc-label">Let’s connect</p><h1 id="contact-title">Ideas to<br />real spaces</h1><p>Every great space begins with a conversation. Whether you have a clear vision or just an idea, we’re here to listen and bring your space to life.</p><a className="tc-signature" href="#contact-enquiry">Your Space<br /><span>Our Priority</span></a></div>
      <p className="tc-hero-services">Interior design <span>/</span> Space planning <span>/</span> Execution</p>
      <span className="tc-hero-index" aria-hidden="true">01<br />—</span>
    </section>

    <section className="tc-enquiry-section" aria-label="Enquiry and contact information">
      <TejesContactEnquiryForm />
      <aside className="tc-information" aria-labelledby="contact-information-title"><p className="tc-label">Reach us</p><h2 id="contact-information-title">Contact<br />information</h2><span className="tc-short-rule" />
        <ContactInfoRow icon={Phone} label="Call us" value={details.phone} href={details.phone ? `tel:${details.phone.replace(/[^\d+]/g, '')}` : null} pending="Phone number to be confirmed" />
        <ContactInfoRow icon={Mail} label="Email us" value={details.email} href={details.email ? `mailto:${details.email}` : null} pending="Email address to be confirmed" />
        <ContactInfoRow icon={MapPin} label="Visit our studio" value={details.address} pending="Studio address to be confirmed" />
        <ContactInfoRow icon={Clock3} label="Studio hours" value={details.hours} pending="Business hours to be confirmed" />
        <div className="tc-social"><span className="tc-short-rule" /><p className="tc-label">Follow us</p>{socials.length ? <nav aria-label="Tejes social profiles">{socials.map(item => <a key={item.label} href={safeExternalUrl(item.url)} target="_blank" rel="noopener noreferrer">{item.label} <ArrowRight size={12} aria-hidden="true" /></a>)}</nav> : <p>Confirmed social profiles will be added here.</p>}</div>
      </aside>
      <div className="tc-editorial"><ContactPhoto media={contactPageMedia.detail} sizes="(max-width: 600px) 100vw, 26vw" /><blockquote>Spaces<br />that feel<br />like you.<span /></blockquote></div>
    </section>

    <section className="tc-studio-section" aria-labelledby="studio-title"><figure className="tc-studio-image"><ContactPhoto media={contactPageMedia.studio} sizes="(max-width: 600px) 100vw, 32vw" /><figcaption>Architectural concept · Studio photograph to be supplied</figcaption></figure><div className="tc-studio-copy"><p className="tc-label">Our studio</p><h2 id="studio-title">Visit our<br />design studio</h2><p>A place to explore ideas, materials and the possibilities for your space.</p><div className="tc-studio-fact"><MapPin size={18} strokeWidth={1.3} aria-hidden="true" /><p>{details.address || 'Studio address awaiting confirmation.'}</p></div><div className="tc-studio-fact"><Clock3 size={18} strokeWidth={1.3} aria-hidden="true" /><p>{details.hours || 'Visiting hours will be shared once confirmed.'}</p></div>{mapUrl ? <a className="tc-button tc-button-outline" href={mapUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowRight size={14} aria-hidden="true" /></a> : <p className="tc-location-note">Directions will be available once the studio location is confirmed.</p>}</div><div className="tc-location-panel"><div className="tc-location-lines" aria-hidden="true" /><MapPin size={40} strokeWidth={1.2} aria-hidden="true" /><p className="tc-label">Studio location</p><h3>{details.address || <>A new conversation.<br />A place to begin.</>}</h3><p>{details.address ? 'Use the confirmed studio address to plan your visit.' : 'Location details are awaiting confirmation.'}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer">View studio on map <ArrowRight size={13} aria-hidden="true" /></a>}</div></section>

    <section className="tc-closing" aria-labelledby="contact-closing-title"><ContactPhoto media={contactPageMedia.closing} sizes="100vw" /><div><p className="tc-label">Start your journey</p><h2 id="contact-closing-title">Let’s create<br />beautiful spaces<br />together</h2></div><div className="tc-closing-copy"><p>Ready to transform your space?<br />Share your ideas and take the first step<br />towards a home that feels like you.</p><a className="tc-button" href="#contact-enquiry">Start your enquiry <ArrowRight size={14} aria-hidden="true" /></a></div></section>
    <TejesProjectsFooter activePage="contact" />
  </div>
}
