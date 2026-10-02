import { useState } from 'react'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import Media from '../../components/common/Media.jsx'
import TextLink from '../../components/common/TextLink.jsx'
import { routePaths } from '../../data/routePaths.js'
import { tejesConceptMedia, tejesConceptStudies } from '../../data/tejes/studio.js'
import '../../styles/tejes-pages.css'

function ProjectsPage() {
  const [category, setCategory] = useState('All')
  const studies = tejesConceptStudies.filter(study => category === 'All' || study.category === category)
  return <div className="tejes-detail-page">
    <SectionWrapper className="tejes-detail-intro"><PageContainer><p className="type-label">Tejes Interiors / Concept collection</p><h1>A closer look at the interior.</h1><p className="tejes-detail-lead">Three perspectives on one illustrative interior: how it works, how it feels and how its materials come together.</p><p className="tejes-detail-note">These details come from one AI-generated concept image. They are design references, not completed client projects.</p></PageContainer></SectionWrapper>
    <SectionWrapper className="tejes-detail-collection"><PageContainer><div className="tejes-detail-filters" role="group" aria-label="Filter interior concepts">{['All', 'Living', 'Materials', 'Space'].map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><p className="tejes-detail-note" aria-live="polite">{studies.length} {studies.length === 1 ? 'perspective' : 'perspectives'} shown</p><div className="tejes-concept-grid">{studies.map(study => <article key={study.id}><Media {...tejesConceptMedia} aspect="portrait" objectPosition={study.position} /><p className="type-label">{study.number} / {study.category}</p><h2>{study.title}</h2><p>{study.description}</p><TextLink to={`${routePaths.tejes.vr}?view=${study.id}`} variant="arrow">Explore this perspective</TextLink></article>)}</div><nav className="tejes-detail-actions" aria-label="Continue from the collection"><TextLink to={routePaths.tejes.interiorDesign} variant="arrow">Explore interior design</TextLink><TextLink to={routePaths.tejes.contact} variant="arrow">Discuss your space</TextLink></nav></PageContainer></SectionWrapper>
  </div>
}

export default ProjectsPage
