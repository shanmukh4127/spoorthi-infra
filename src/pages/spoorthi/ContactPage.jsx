import { useRef, useState } from 'react'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import SectionHeading from '../../components/content/SectionHeading.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiEnquiryForm from '../../components/spoorthi/SpoorthiEnquiryForm.jsx'
import SpoorthiEstimator from '../../components/spoorthi/SpoorthiEstimator.jsx'
import { contactPage, projectTypes } from '../../data/spoorthi/contactPage.js'
import { estimateCopy, pricingConfig } from '../../data/spoorthi/estimator.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-contact.css'

function ContactPage() {
  const [draft, setDraft] = useState({ name: '', email: '', type: '', area: '', message: '' })
  const [estimateContext, setEstimateContext] = useState('')
  const nameRef = useRef(null)
  function focusEnquiry(event) {
    event?.preventDefault()
    nameRef.current?.focus()
  }
  function requestQuote(selection) {
    const type = projectTypes.find(item => item.value === selection.type)?.label
    const scope = pricingConfig.scopes.find(item => item.value === selection.scope)?.label
    const area = Number(selection.area) > 0 && Number.isFinite(Number(selection.area)) ? selection.area : ''
    setDraft(previous => ({ ...previous, type: selection.type || previous.type, area: area || previous.area }))
    setEstimateContext([type, scope, area && `${area} sq.ft`].filter(Boolean).join(' / ') || 'Scope to be discussed')
    focusEnquiry()
  }
  const { details } = contactPage
  return <div className="spoorthi-contact-page">
    <SectionWrapper className="contact-intro"><PageContainer><div className="contact-intro__layout">
      <SectionHeading as="h1" {...contactPage.intro} />
      <div className="contact-intro__annotation"><span className="type-label">The open line</span><p>{contactPage.disciplines.join(' · ')}</p><span aria-hidden="true" className="contact-intro__mark">＋</span></div>
    </div></PageContainer></SectionWrapper>
    <SectionWrapper id="enquiry" className="contact-conversation"><PageContainer><div className="contact-conversation__layout">
      <aside className="contact-information"><p className="type-label">02 / Spoorthi Infra</p><h2>{contactPage.enquiry.title}</h2><p>{contactPage.enquiry.description}</p>
        <dl>{details.email && <div><dt>Email</dt><dd><a href={`mailto:${details.email}`}>{details.email}</a></dd></div>}{details.phone && <div><dt>Phone</dt><dd><a href={`tel:${details.phone.replace(/[^+\d]/g, '')}`}>{details.phone}</a></dd></div>}{details.address && <div><dt>Address</dt><dd>{details.address}</dd></div>}</dl>
        {!details.email && !details.phone && !details.address && <p className="contact-information__pending">Direct contact details will be published once confirmed.</p>}
        <p className="type-label contact-information__line">Build / Proof / Design / Experience / Connect</p>
      </aside>
      <SpoorthiEnquiryForm draft={draft} setDraft={setDraft} nameRef={nameRef} estimateContext={estimateContext} />
    </div></PageContainer></SectionWrapper>
    <SectionWrapper className="contact-project-info"><PageContainer>
      <SectionHeading eyebrow="03 / Project information" title={contactPage.projectInformation.title} />
      <ol>{contactPage.projectInformation.items.map((item, index) => <li key={item.title}><span className="type-label">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
    </PageContainer></SectionWrapper>
    <SectionWrapper className="contact-estimate-section"><PageContainer>
      <SectionHeading eyebrow={estimateCopy.eyebrow} title={estimateCopy.title} description={estimateCopy.introduction} />
      <SpoorthiEstimator onRequest={requestQuote} />
    </PageContainer></SectionWrapper>
    <SectionWrapper className="contact-closing"><PageContainer><div className="contact-closing__layout"><SectionHeading eyebrow="The next chapter" title={contactPage.closing.title} /><nav aria-label="Continue from Contact"><TextLink href="#enquiry" variant="arrow" onClick={focusEnquiry}>Start a conversation</TextLink><TextLink to={routePaths.spoorthi.projects} variant="arrow">Explore projects</TextLink></nav></div></PageContainer></SectionWrapper>
  </div>
}
export default ContactPage
