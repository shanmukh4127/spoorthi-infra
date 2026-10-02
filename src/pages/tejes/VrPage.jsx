import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import TextLink from '../../components/common/TextLink.jsx'
import { routePaths } from '../../data/routePaths.js'
import { tejesConceptMedia, tejesConceptStudies } from '../../data/tejes/studio.js'
import '../../styles/tejes-pages.css'

function VrPage() {
  const [searchParams] = useSearchParams()
  const initial = tejesConceptStudies.find(study => study.id === searchParams.get('view')) ?? null
  const [study, setStudy] = useState(initial)
  const [zoom, setZoom] = useState(initial ? 1.65 : 1)
  const changeZoom = value => setZoom(Math.min(2.5, Math.max(1, value)))
  const selectStudy = next => { setStudy(next); setZoom(next ? 1.65 : 1) }
  const maxOffset = (zoom - 1) * 50
  const x = Math.min(maxOffset, Math.max(-maxOffset, (50 - (study?.focalX ?? 50)) * zoom))
  const y = Math.min(maxOffset, Math.max(-maxOffset, (50 - (study?.focalY ?? 50)) * zoom))
  return <div className="tejes-detail-page"><SectionWrapper className="tejes-detail-intro"><PageContainer><p className="type-label">Tejes Interiors / Spatial experience</p><h1>Look closer. See the possibilities.</h1><p className="tejes-detail-lead">Explore the room, the materials and the transitions in an illustrative interior. Select a perspective and zoom in to consider the details.</p><p className="tejes-detail-note">This browser image explorer uses an AI-generated concept. A project-specific 360° or headset tour requires a prepared spatial model.</p></PageContainer></SectionWrapper><SectionWrapper><PageContainer><div className="tejes-explorer"><div className="tejes-detail-filters" role="group" aria-label="Choose an interior perspective"><button type="button" aria-pressed={!study} onClick={() => selectStudy(null)}>Whole interior</button>{tejesConceptStudies.map(item => <button type="button" key={item.id} aria-pressed={study?.id === item.id} onClick={() => selectStudy(item)}>{item.category}</button>)}</div><div className="tejes-explorer__image"><img src={tejesConceptMedia.src} alt={tejesConceptMedia.alt} width={tejesConceptMedia.width} height={tejesConceptMedia.height} style={{ transform: `translate(${x}%, ${y}%) scale(${zoom})` }} /></div><div className="tejes-explorer__controls" role="group" aria-label="Image zoom controls"><button type="button" onClick={() => changeZoom(zoom - .25)} disabled={zoom === 1} aria-label="Zoom out">−</button><label>Zoom<input type="range" min="1" max="2.5" step=".05" value={zoom} aria-valuetext={`${Math.round(zoom * 100)}% magnification`} onChange={event => changeZoom(Number(event.target.value))} /></label><output>{Math.round(zoom * 100)}%</output><button type="button" onClick={() => changeZoom(zoom + .25)} disabled={zoom === 2.5} aria-label="Zoom in">+</button><button type="button" onClick={() => selectStudy(null)}>Reset view</button></div><div className="tejes-explorer__description" aria-live="polite"><h2>{study?.title ?? 'One interior. A connected composition.'}</h2><p>{study?.description ?? 'A framed doorway opens onto a bright living area. Consider how the floor, ceiling and garden view draw the individual elements together.'}</p></div><p className="tejes-detail-note">{tejesConceptMedia.caption}</p></div><nav className="tejes-detail-actions" aria-label="Continue exploring"><TextLink to={routePaths.tejes.design3d} variant="arrow">Explore design & 3D</TextLink><TextLink to={routePaths.tejes.contact} variant="arrow">Discuss your space</TextLink></nav></PageContainer></SectionWrapper></div>
}

export default VrPage
