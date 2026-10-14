import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import TejesHomeMenu from '../../components/tejes/TejesHomeMenu.jsx'
import { routePaths } from '../../data/routePaths.js'
import { projectById, projectsPage } from '../../data/tejes/projectArchive.js'
import { ProjectPhoto, TejesProjectsFooter } from './ProjectsPage.jsx'
import '../../styles/tejes-project-detail.css'

const journey = [
  { id: 'stage-2d', number: '01', label: '2D design' },
  { id: 'stage-3d', number: '02', label: '3D development' },
  { id: 'stage-visualization', number: '03', label: 'Visualization' },
  { id: 'stage-vr', number: '04', label: 'VR experience' },
  { id: 'stage-video', number: '05', label: 'Project video' },
]

function StageMarker({ number, eyebrow, title, id }) {
  return <div className="td-stage-marker"><span className="td-stage-number" aria-hidden="true">{number}</span><div><p className="tp-kicker">{eyebrow}</p><h2 id={id}>{title}</h2></div></div>
}

function MediaImage({ media, className = '', sizes, eager = false }) {
  if (!media?.image) return <div className={`${className} td-missing-media`}>Approved project imagery to be supplied</div>
  return <ProjectPhoto image={media.image} alt={media.alt} className={className} eager={eager} sizes={sizes} />
}

function StageGallery({ items = [], variant, label, onOpen }) {
  const [selected, setSelected] = useState(0)
  const available = (items || []).filter(item => item?.image?.src)
  const index = Math.min(selected, available.length - 1)
  const current = available[index]
  const isPlan = variant === 'planning'

  if (!current) return <div className={`td-media-gallery td-media-gallery--${variant}`}><div className="td-missing-media">Approved {isPlan ? 'drawings' : 'images'} to be supplied</div></div>

  const change = direction => setSelected(value => (value + direction + available.length) % available.length)
  return <div className={`td-media-gallery td-media-gallery--${variant}`}>
    <button type="button" className="td-gallery-feature" onClick={() => onOpen(available, index, label)} aria-label={`View full size: ${current.title || current.alt}`}>
      <MediaImage key={current.image.src} media={current} sizes={isPlan ? '(max-width: 600px) 100vw, 50vw' : '(max-width: 600px) 100vw, 62vw'} />
      <span className="td-gallery-zoom">{isPlan ? 'View full plan' : 'View full image'} <ArrowRight size={13} aria-hidden="true" /></span>
    </button>
    <div className="td-gallery-meta">
      <div><strong>{current.title || label}</strong><span>{current.description || current.status}</span>{current.description && current.status && <small>{current.status}</small>}</div>
      {available.length > 1 && <div className="td-gallery-switch"><span>{String(index + 1).padStart(2, '0')} / {String(available.length).padStart(2, '0')}</span><button type="button" onClick={() => change(-1)} aria-label={`Previous ${label} image`}><ChevronLeft size={19} /></button><button type="button" onClick={() => change(1)} aria-label={`Next ${label} image`}><ChevronRight size={19} /></button></div>}
    </div>
    {available.length > 1 && <div className="td-gallery-thumbs" aria-label={`${label} image selection`}>{available.map((item, itemIndex) => <button key={`${item.image.src}-${itemIndex}`} type="button" className={itemIndex === index ? 'is-selected' : ''} aria-pressed={itemIndex === index} aria-label={`Select ${item.title || `${label} image ${itemIndex + 1}`}`} onClick={() => setSelected(itemIndex)}><MediaImage media={item} sizes="(max-width: 600px) 84px, 150px" /><span>{item.title || `View ${itemIndex + 1}`}</span></button>)}</div>}
  </div>
}

function isUsableUrl(value) {
  if (!value) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
}

function MediaViewer({ viewer, onClose, onStep, closeRef, dialogRef }) {
  if (!viewer) return null
  const isVideo = viewer.kind === 'video'
  const media = isVideo ? null : viewer.items[viewer.index]
  return <div className="td-viewer" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <div ref={dialogRef} className="td-viewer-dialog" role="dialog" aria-modal="true" aria-label={viewer.title}>
      <div className="td-viewer-bar"><span>{viewer.title} {!isVideo && <small>{viewer.items.length > 1 ? `${viewer.index + 1} / ${viewer.items.length}` : media.title || 'Image'}</small>}</span><button ref={closeRef} type="button" onClick={onClose} aria-label={isVideo ? 'Close video player' : 'Close image viewer'}><X size={22} /></button></div>
      {isVideo ? <video className="td-viewer-video" controls autoPlay preload="metadata" poster={viewer.poster} src={viewer.url} aria-label={viewer.title} /> : <MediaImage media={media} className="td-viewer-image" sizes="100vw" eager />}
      {!isVideo && viewer.items.length > 1 && <div className="td-viewer-controls"><button type="button" onClick={() => onStep(-1)} aria-label="Previous image"><ChevronLeft size={20} /></button><button type="button" onClick={() => onStep(1)} aria-label="Next image"><ChevronRight size={20} /></button></div>}
      {!isVideo && <p>{media.title ? `${media.title} · ` : ''}{media.description || 'Project image'}{media.status ? ` · ${media.status}` : ''}</p>}
    </div>
  </div>
}

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const project = projectById[projectId]
  const [activeStage, setActiveStage] = useState('stage-2d')
  const [viewer, setViewer] = useState(null)
  const closeRef = useRef(null)
  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const isViewerOpen = viewer !== null

  useEffect(() => {
    if (!project) return undefined
    const updateStage = () => {
      const readingLine = window.scrollY + window.innerHeight * .45
      let current = journey[0].id
      journey.forEach(stage => { const element = document.getElementById(stage.id); if (element && element.offsetTop <= readingLine) current = stage.id })
      setActiveStage(current)
    }
    updateStage()
    window.addEventListener('scroll', updateStage, { passive: true })
    window.addEventListener('resize', updateStage)
    return () => { window.removeEventListener('scroll', updateStage); window.removeEventListener('resize', updateStage) }
  }, [projectId, project])

  useEffect(() => {
    if (!isViewerOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = event => {
      if (event.key === 'Escape') setViewer(null)
      if (event.key === 'ArrowLeft') setViewer(current => current?.items?.length > 1 ? ({ ...current, index: (current.index - 1 + current.items.length) % current.items.length }) : current)
      if (event.key === 'ArrowRight') setViewer(current => current?.items?.length > 1 ? ({ ...current, index: (current.index + 1) % current.items.length }) : current)
      if (event.key === 'Tab') {
        const controls = [...(dialogRef.current?.querySelectorAll('button, a[href], video[controls]') || [])]
        if (!controls.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); openerRef.current?.focus() }
  }, [isViewerOpen])

  const openViewer = (items, index, title) => { openerRef.current = document.activeElement; setViewer({ kind: 'image', items, index, title }) }
  const openVideo = () => { openerRef.current = document.activeElement; setViewer({ kind: 'video', url: project.videoUrl, poster: project.videoThumbnail?.image?.src, title: `${project.title} project video` }) }
  const stepViewer = direction => setViewer(current => current?.items?.length > 1 ? ({ ...current, index: (current.index + direction + current.items.length) % current.items.length }) : current)

  if (!project) return <div className="th-home tp-page td-page"><TejesHomeMenu initialOpen={false} navigationItems={projectsPage.menu} navigationLabel="Tejes project navigation" /><main className="td-not-found"><p className="tp-kicker">Project archive</p><h1>Project not found.</h1><p>The requested study is not in the selected work archive.</p><Link to={routePaths.tejes.projects} className="td-text-link"><ArrowLeft size={14} /> Back to projects</Link></main><TejesProjectsFooter /></div>

  const info = Object.entries(project.projectInfo || {}).filter(([, value]) => value)
  const vrAvailable = isUsableUrl(project.vrExperienceUrl)
  const videoAvailable = isUsableUrl(project.videoUrl)

  return <div className="th-home tp-page td-page">
    <TejesHomeMenu initialOpen={false} navigationItems={projectsPage.menu} navigationLabel="Tejes project navigation" />
    <main>
      <section className="td-overview" aria-labelledby="project-title">
        <Link className="td-back" to={routePaths.tejes.projects}><ArrowLeft size={13} aria-hidden="true" /> Back to projects</Link>
        <span className="td-overview-number" aria-hidden="true">{project.number}</span>
        <div className="td-overview-copy"><p className="td-micro-label">Project overview</p><p className="tp-kicker">{project.category}</p><h1 id="project-title">{project.title}</h1><p className="td-lede">{project.description}</p>{info.length > 0 && <dl className="td-project-info">{info.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}<p className="td-media-note">Illustrative design study · Project details to be verified</p></div>
        <div className="td-overview-media"><MediaImage media={project.heroImage} eager sizes="(max-width: 700px) 100vw, 61vw" /><span className="td-photo-quote">Modern spaces.<br />Timeless comfort.</span></div>
      </section>

      <nav className="td-journey" aria-label="Project journey">{journey.map(stage => <a key={stage.id} href={`#${stage.id}`} className={activeStage === stage.id ? 'is-active' : ''} onClick={() => setActiveStage(stage.id)}><span>{stage.number}</span>{stage.label}</a>)}</nav>

      <section id="stage-2d" className="td-stage td-planning" aria-labelledby="stage-2d-title">
        <div className="td-planning-copy"><StageMarker number="01" eyebrow="2D design" title="Thoughtful layouts. Better living." id="stage-2d-title" /><p>{project.stageCopy.twoD}</p></div>
        <StageGallery key={`${projectId}-planning`} items={project.twoDImages} variant="planning" label="Planning study" onOpen={openViewer} />
        <div className="td-plan-aside"><span className="td-plan-north">N ↑</span><span>Conceptual zoning<br />Not to scale</span></div>
      </section>

      <section id="stage-3d" className="td-stage td-development" aria-labelledby="stage-3d-title"><div className="td-development-copy"><StageMarker number="02" eyebrow="3D development" title="Bringing spaces to life." id="stage-3d-title" /><p>{project.stageCopy.threeD}</p>{project.threeDTourUrl && isUsableUrl(project.threeDTourUrl) && <a className="td-text-link" href={project.threeDTourUrl} target="_blank" rel="noopener noreferrer">View 3D tour <ArrowRight size={14} /></a>}</div><StageGallery key={`${projectId}-development`} items={project.threeDImages} variant="development" label="3D development" onOpen={openViewer} /></section>

      <section id="stage-visualization" className="td-stage td-visualization" aria-labelledby="stage-visualization-title"><StageGallery key={`${projectId}-visualization`} items={project.visualizationImages} variant="visualization" label="Visualization gallery" onOpen={openViewer} /><div className="td-visual-copy"><StageMarker number="03" eyebrow="Visualization" title="Real spaces. Real feelings." id="stage-visualization-title" /><p>{project.stageCopy.visualization}</p></div></section>

      <section id="stage-vr" className="td-stage td-vr" aria-labelledby="stage-vr-title"><div className="td-vr-copy"><StageMarker number="04" eyebrow="VR experience" title="Walk through your future home." id="stage-vr-title" /><p>{project.stageCopy.vr}</p>{vrAvailable ? <a className="td-text-link" href={project.vrExperienceUrl} target="_blank" rel="noopener noreferrer">Launch VR experience <ArrowRight size={14} /></a> : <><button type="button" className="td-text-link" disabled aria-describedby="vr-unavailable">Launch VR experience <ArrowRight size={14} /></button><span id="vr-unavailable" className="td-unavailable">Interactive tour not yet available</span></>}</div><div className="td-vr-media"><MediaImage media={project.vrPreviewImage} sizes="(max-width: 700px) 100vw, 54vw" /><span className="td-vr-icon" aria-hidden="true">VR</span></div></section>

      <section id="stage-video" className="td-stage td-video" aria-labelledby="stage-video-title"><div className="td-video-image"><MediaImage media={project.videoThumbnail} sizes="(max-width: 700px) 100vw, 90vw" />{videoAvailable ? <button type="button" className="td-video-play" onClick={openVideo} aria-label="Play project video"><Play size={24} fill="currentColor" /></button> : <span className="td-video-play td-video-play--preview" aria-hidden="true"><Play size={24} fill="currentColor" /></span>}</div><div className="td-video-copy"><StageMarker number="05" eyebrow="Project video" title="See the story unfold." id="stage-video-title" /><p>{project.stageCopy.video}</p>{videoAvailable ? <button type="button" className="td-text-link" onClick={openVideo}>Watch project video <ArrowRight size={14} /></button> : <span className="td-unavailable td-video-unavailable"><Play size={15} aria-hidden="true" /> Project film preview · Video to be supplied</span>}</div></section>

      <section className="tp-closing td-closing" aria-labelledby="detail-closing-title"><div><p className="tp-kicker">Let’s create together</p><h2 id="detail-closing-title">Your space deserves its own story.</h2></div><p>Have a space in mind? Let’s explore what it could become.</p><Link className="tp-start" to={routePaths.tejes.contact}>Start a project <ArrowRight size={13} aria-hidden="true" /></Link></section>
    </main>
    <TejesProjectsFooter />
    <MediaViewer viewer={viewer} onClose={() => setViewer(null)} onStep={stepViewer} closeRef={closeRef} dialogRef={dialogRef} />
  </div>
}
