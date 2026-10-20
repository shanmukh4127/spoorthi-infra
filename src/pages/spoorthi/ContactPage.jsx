import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowDown, ArrowUpRight, Building2, ClipboardList, PenTool } from 'lucide-react'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import SectionHeading from '../../components/content/SectionHeading.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import SpoorthiEnquiryForm from '../../components/spoorthi/SpoorthiEnquiryForm.jsx'
import SpoorthiEstimator from '../../components/spoorthi/SpoorthiEstimator.jsx'
import { contactPage, emptyEnquiry, projectTypes } from '../../data/spoorthi/contactPage.js'
import { estimateCopy, pricingConfig } from '../../data/spoorthi/estimator.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-contact.css'

const draftKey = 'spoorthi-project-enquiry-v1'

function restoreEnquiry() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(draftKey))
    if (!saved || typeof saved !== 'object') return { draft: { ...emptyEnquiry }, context: '' }
    const limits = { name: 120, email: 254, type: 30, area: 30, message: 4000 }
    const draft = Object.fromEntries(Object.keys(emptyEnquiry).map(key => [key, typeof saved.draft?.[key] === 'string' ? saved.draft[key].slice(0, limits[key]) : '']))
    return { draft, context: typeof saved.context === 'string' ? saved.context.slice(0, 500) : '' }
  } catch {
    return { draft: { ...emptyEnquiry }, context: '' }
  }
}

function ContactPage() {
  const { hash } = useLocation()
  const [enquiry, setEnquiry] = useState(restoreEnquiry)
  const nameRef = useRef(null)
  const { draft, context: estimateContext } = enquiry
  const setDraft = updater => setEnquiry(previous => ({ ...previous, draft: typeof updater === 'function' ? updater(previous.draft) : updater }))

  useEffect(() => {
    if (hash === '#enquiry') nameRef.current?.focus({ preventScroll: true })
  }, [hash])

  useEffect(() => {
    try {
      if (Object.values(enquiry.draft).some(Boolean) || enquiry.context) window.sessionStorage.setItem(draftKey, JSON.stringify(enquiry))
      else window.sessionStorage.removeItem(draftKey)
    } catch {
      // Exporting an enquiry remains available when browser storage is restricted.
    }
  }, [enquiry])

  function focusEnquiry(event) {
    event?.preventDefault()
    nameRef.current?.focus({ preventScroll: true })
    nameRef.current?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  function requestQuote(selection) {
    const type = projectTypes.find(item => item.value === selection.type)?.label
    const scope = pricingConfig.scopes.find(item => item.value === selection.scope)?.label
    const level = pricingConfig.levels.find(item => item.value === selection.level)?.label
    const area = Number(selection.area) > 0 && Number.isFinite(Number(selection.area)) ? selection.area : ''
    setEnquiry(previous => ({
      draft: { ...previous.draft, type: selection.type || previous.draft.type, area: area || previous.draft.area },
      context: [type, scope, area && `${area} sq.ft`, level].filter(Boolean).join(' / '),
    }))
    focusEnquiry()
  }

  const { details } = contactPage
  const contactReady = details.email || details.phone || details.address
  return (
    <div className="spoorthi-contact-page">
      <SectionWrapper className="contact-intro">
        <PageContainer>
          <div className="contact-intro__layout">
            <div><SectionHeading as="h1" {...contactPage.intro} /><TextLink href="#enquiry" variant="arrow" onClick={focusEnquiry}>Prepare your project brief</TextLink></div>
            <div className="contact-intro__annotation"><span className="type-label">From idea to built form</span><div className="contact-intro__symbol" aria-hidden="true"><Building2 size={80} strokeWidth={0.8} /></div><p>{contactPage.disciplines.join(' · ')}</p><a href="#project-planner" className="contact-intro__planner-link">Explore the project planner <ArrowDown size={16} aria-hidden="true" /></a></div>
          </div>
        </PageContainer>
      </SectionWrapper>
      <SectionWrapper id="enquiry" className="contact-conversation">
        <PageContainer>
          <div className="contact-conversation__layout">
            <aside className="contact-information">
              <p className="type-label">A considered beginning</p><h2>{contactPage.enquiry.title}</h2><p>{contactPage.enquiry.description}</p>
              {contactReady && <dl>{details.email && <div><dt>Email</dt><dd><a href={`mailto:${details.email}`}>{details.email}</a></dd></div>}{details.phone && <div><dt>Phone</dt><dd><a href={`tel:${details.phone.replace(/[^+\d]/g, '')}`}>{details.phone}</a></dd></div>}{details.address && <div><dt>Address</dt><dd>{details.address}</dd></div>}</dl>}
              <div className="contact-information__guide"><ClipboardList size={22} strokeWidth={1.4} aria-hidden="true" /><div><h3>Start with a simple brief.</h3><p>Send your project details using the form. Your enquiry goes directly to the Spoorthi team’s inbox.</p></div></div>
              {!contactReady && <p className="contact-information__pending">Direct contact details are currently unavailable. You can still prepare and keep your project enquiry here.</p>}
              <TextLink to={routePaths.spoorthi.projects} variant="arrow">Find inspiration in our work</TextLink>
            </aside>
            <SpoorthiEnquiryForm draft={draft} setDraft={setDraft} nameRef={nameRef} estimateContext={estimateContext} onClear={() => setEnquiry({ draft: { ...emptyEnquiry }, context: '' })} />
          </div>
        </PageContainer>
      </SectionWrapper>
      <SectionWrapper className="contact-project-info">
        <PageContainer>
          <SectionHeading eyebrow="Before we begin" title={contactPage.projectInformation.title} />
          <ol>{contactPage.projectInformation.items.map((item, index) => <li key={item.title}><span className="contact-project-info__number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
        </PageContainer>
      </SectionWrapper>
      <SectionWrapper id="project-planner" className="contact-estimate-section">
        <PageContainer><SectionHeading eyebrow={estimateCopy.eyebrow} title={estimateCopy.title} description={estimateCopy.introduction} /><SpoorthiEstimator onRequest={requestQuote} /></PageContainer>
      </SectionWrapper>
      <SectionWrapper className="contact-closing">
        <PageContainer><div className="contact-closing__layout"><div><PenTool size={28} strokeWidth={1.2} aria-hidden="true" /><SectionHeading eyebrow="Let’s make a beginning" title={contactPage.closing.title} /></div><nav aria-label="Continue from Contact"><TextLink href="#enquiry" variant="arrow" onClick={focusEnquiry}>Prepare an enquiry</TextLink><TextLink to={routePaths.spoorthi.civilConstruction} variant="arrow">Explore construction</TextLink></nav><ArrowUpRight className="contact-closing__arrow" size={74} strokeWidth={0.8} aria-hidden="true" /></div></PageContainer>
      </SectionWrapper>
    </div>
  )
}

export default ContactPage
