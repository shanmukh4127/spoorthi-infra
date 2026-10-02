import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import TejesEnquiryForm from '../../components/tejes/TejesEnquiryForm.jsx'
import { routePaths } from '../../data/routePaths.js'
import { tejesContactEmail, tejesFaqs } from '../../data/tejes/studio.js'
import '../../styles/tejes-pages.css'

function ContactPage() {
  return <div className="tejes-detail-page"><SectionWrapper className="tejes-detail-intro"><PageContainer><p className="type-label">Tejes Interiors / Contact</p><h1>Let’s talk about your space.</h1><p className="tejes-detail-lead">A new interior, a room to rethink or an idea you would like to explore. Share your priorities and begin with a clear brief.</p></PageContainer></SectionWrapper><SectionWrapper><PageContainer><div className="tejes-enquiry-layout"><aside><p className="type-label">Begin a conversation</p><h2>Your ideas are the starting point.</h2><p>Share the location, the rooms involved and how you want the space to feel and function.</p><a className="tejes-contact-email" href={`mailto:${tejesContactEmail}`}>{tejesContactEmail}</a>{tejesFaqs.map(item => <details className="tejes-faq" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}<TextLink to={routePaths.tejes.interiorDesign} variant="arrow">Explore interior design</TextLink></aside><TejesEnquiryForm /></div></PageContainer></SectionWrapper></div>
}

export default ContactPage
