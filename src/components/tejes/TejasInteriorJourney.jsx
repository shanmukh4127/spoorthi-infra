import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, Menu, X } from 'lucide-react'
import { tejasChapters } from '../../data/tejes/cinematicJourney.js'
import { houseChapterAt as chapterAt, houseChapterProgress } from '../../data/tejes/houseWalkthrough.js'
import { routePaths } from '../../data/routePaths.js'
import SceneLoading from '../common/SceneLoading.jsx'
import TejasHouseStill from './TejasHouseStill.jsx'
import '../../styles/tejas-cinematic.css'

const num = n => String(n).padStart(2, '0')
const chapterProgress = index => houseChapterProgress[Math.max(0, Math.min(11, index))]
const motionQuery = '(prefers-reduced-motion: reduce)'
const eligible = () => !window.matchMedia(motionQuery).matches && !navigator.connection?.saveData && !(navigator.deviceMemory && navigator.deviceMemory < 4)

export default function TejasInteriorJourney() {
  const [mode, setMode] = useState(() => eligible() ? 'scene' : 'read')
  const [status, setStatus] = useState('loading')
  const [loaded, setLoaded] = useState(0)
  const [active, setActive] = useState(0)
  const [retry, setRetry] = useState(0)
  const [menu, setMenu] = useState(false)
  const [credits, setCredits] = useState(false)
  const root = useRef(null), viewport = useRef(null), host = useRef(null), meter = useRef(null)
  const trigger = useRef(null), dialog = useRef(null)
  const reading = mode === 'read' || status === 'error'
  const go = index => {
    setMenu(false)
    if (reading) document.getElementById(`tejas-chapter-${index + 1}`)?.scrollIntoView({ behavior: 'instant' })
    else {
      const top = window.scrollY + root.current.getBoundingClientRect().top
      window.scrollTo({ top: top + chapterProgress(index) * (root.current.offsetHeight - viewport.current.offsetHeight), behavior: 'instant' })
    }
  }

  useEffect(() => {
    const media = window.matchMedia(motionQuery)
    const change = () => { if (!eligible()) setMode('read') }
    media.addEventListener('change', change)
    navigator.connection?.addEventListener('change', change)
    return () => { media.removeEventListener('change', change); navigator.connection?.removeEventListener('change', change) }
  }, [])

  useEffect(() => {
    if (!menu) return
    const opener = trigger.current
    const close = e => {
      if (e.key === 'Escape') { setMenu(false); opener?.focus({ preventScroll: true }) }
    }
    const outside = event => { if (!dialog.current?.contains(event.target) && !opener?.contains(event.target)) setMenu(false) }
    dialog.current.querySelector('button')?.focus()
    document.addEventListener('keydown', close)
    document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); opener?.focus({ preventScroll: true }) }
  }, [menu])

  useEffect(() => {
    if (reading) return
    let disposed = false, runtime, frame = 0, previous = -1, displayed = NaN, lastTime = 0
    const controller = new AbortController()
    const container = host.current
    const mobileViewport = window.matchMedia('(max-width: 600px)')
    const update = (now = performance.now()) => {
      frame = 0
      if (disposed || document.hidden || !root.current || !viewport.current) return
      const rect = root.current.getBoundingClientRect()
      if (rect.top > innerHeight || rect.bottom < 0) return
      const target = Math.max(0, Math.min(1, -rect.top / Math.max(1, root.current.offsetHeight - viewport.current.offsetHeight)))
      const dt = lastTime ? Math.min(.05, (now - lastTime) / 1000) : 1 / 60
      lastTime = now
      if (!Number.isFinite(displayed) || !runtime) displayed = target
      else displayed += (target - displayed) * (1 - Math.exp(-dt / (mobileViewport.matches ? .18 : .085)))
      if (Math.abs(target - displayed) < .000012) displayed = target
      const p = displayed
      runtime?.update(p)
      meter.current?.style.setProperty('--tj-progress', p)
      const index = chapterAt(p)
      if (index !== previous) { previous = index; setActive(index) }
      if (runtime && p !== target) frame = requestAnimationFrame(update)
      else lastTime = 0
    }
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update) }
    const resize = () => { runtime?.resize(); schedule() }
    const lost = e => { e.preventDefault(); if (!disposed) setStatus('error') }
    const observer = new ResizeObserver(resize)
    observer.observe(viewport.current)
    container.addEventListener('webglcontextlost', lost, true)
    window.addEventListener('scroll', schedule, { passive: true })
    document.addEventListener('visibilitychange', schedule)
    import('./journey/createHouseScene.js').then(async ({ createHouseScene }) => {
      if (disposed) return
      runtime = await createHouseScene(container, value => { if (!disposed) setLoaded(value) }, controller.signal)
      if (disposed) { runtime.dispose(); return }
      runtime.resize()
      cancelAnimationFrame(frame)
      frame = 0
      update()
      setStatus('ready')
    }).catch(error => {
      if (!disposed && error.name !== 'AbortError') { console.error('Tejas interior scene:', error); setStatus('error') }
    })
    schedule()
    return () => {
      disposed = true
      controller.abort()
      cancelAnimationFrame(frame)
      observer.disconnect()
      container.removeEventListener('webglcontextlost', lost, true)
      window.removeEventListener('scroll', schedule)
      document.removeEventListener('visibilitychange', schedule)
      runtime?.dispose()
    }
  }, [reading, retry])

  const read = () => { setMode('read'); requestAnimationFrame(() => document.getElementById(`tejas-chapter-${active + 1}`)?.scrollIntoView({ behavior: 'instant' })) }
  return <div className={`tj-home tj-home--house ${reading ? 'tj-home--reading' : ''}`} ref={root} data-chapter={active + 1} data-visual-mode={reading ? 'reading' : 'house-walkthrough'} data-scene-status={reading ? (status === 'error' ? 'error' : 'static') : status} onKeyDown={event => {
    if (reading || menu || event.target.closest('a,button')) return
    const jump = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: 11 }[event.key]
    if (jump !== undefined) { event.preventDefault(); go(Math.max(0, Math.min(11, jump))) }
  }}>
    <div className="tj-viewport" ref={viewport}>
      <div className="tj-scene" ref={host} aria-hidden="true" />
      {!reading && status === 'loading' && <div className="tj-poster" aria-hidden="true"><TejasHouseStill index={0} priority decorative /></div>}
      <header className="tj-header">
        <Link to={routePaths.tejes.home} className="tj-logo" aria-label="Tejas Interiors home"><img src="/assets/tejes/brand/wordmark.svg" width="700" height="300" alt="Tejas Interiors" /></Link>
        <span className="tj-edition">The interior collection <i /> A spatial journey</span>
        <button className="tj-menu-trigger" ref={trigger} aria-expanded={menu} aria-controls="tejas-menu" onClick={() => setMenu(value => !value)}>Menu <Menu size={18} strokeWidth={1.2} /></button>
      </header>
      <div className="tj-story" tabIndex={0} aria-label="Interior story. Use arrow keys to explore chapters.">
        {tejasChapters.map((chapter, i) => <article key={chapter.label} id={`tejas-chapter-${i + 1}`} className={`tj-chapter ${i === active ? 'is-active' : ''}`} aria-hidden={!reading && i !== active ? true : undefined}>
          {reading && <TejasHouseStill index={i} priority={i === 0} />}
          <div className="tj-chapter-copy"><p className="tj-eyebrow"><span>{num(i + 1)} / 12</span> {chapter.label}</p>
            {i === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}
            <p className="tj-description">{chapter.text}</p>
            <p className="tj-detail">{chapter.detail}</p>
            {i === 11 && <Link className="tj-contact" to={routePaths.tejes.contact} tabIndex={!reading && active !== 11 ? -1 : undefined}>Get in touch <ArrowRight size={17} /></Link>}
          </div>
        </article>)}
      </div>
      {!reading && <Link className="tj-mobile-contact" to={routePaths.tejes.contact}>Discuss your space <ArrowRight size={16} /></Link>}
      {!reading && <aside className="tj-chapter-rail" aria-label="Choose a chapter">{tejasChapters.map((c, i) => <button key={c.label} aria-label={`${num(i + 1)} — ${c.label}`} aria-current={active === i ? 'step' : undefined} onClick={() => go(i)}><span>{num(i + 1)}</span><i /></button>)}</aside>}
      <footer className="tj-foot">
        <button className="tj-explore" onClick={() => reading ? go(0) : go(Math.min(11, active + 1))}><ArrowDown size={18} strokeWidth={1} /><span>{reading ? 'Back to the beginning' : 'Scroll to feel the space'}<small>{reading ? 'Twelve chapters of interior inspiration' : 'Twelve chapters. One continuous story.'}</small></span></button>
        <div className="tj-disclosure"><span>AI-reconstructed concept house · Not a client project</span><button onClick={() => setCredits(v => !v)} aria-expanded={credits}>Asset credits</button></div>
        {!reading && <div className="tj-progress" ref={meter} aria-label={`Chapter ${active + 1} of 12`}><span>{num(active + 1)}</span><i><b /></i><span>12</span></div>}
      </footer>
      {!reading && <div className="tj-tools"><button onClick={read}>Read without motion</button><button disabled={active === 0} onClick={() => go(active - 1)} aria-label="Previous chapter"><ArrowLeft size={15} /></button><button disabled={active === 11} onClick={() => go(active + 1)} aria-label="Next chapter"><ArrowRight size={15} /></button></div>}
      {!reading && status === 'loading' && <SceneLoading brand="tejes" progress={loaded} onContinue={read} />}
      {status === 'error' && <div className="tj-error" role="status">The 3D view is unavailable. Explore the illustrated chapters below. <button onClick={() => { setStatus('loading'); setLoaded(0); setMode('scene'); setRetry(v => v + 1); window.scrollTo({ top: 0, behavior: 'instant' }) }}>Retry 3D</button></div>}
      {credits && <div className="tj-credits"><button onClick={() => setCredits(false)} aria-label="Close credits"><X size={17} /></button><p>Original house imagery generated with OpenAI image generation, combined with textured 3D furnishings and connected architectural surfaces. A conceptual interior, not a Tejas client project. <a href="/assets/tejes/cinematic/house/generation-prompts.json" target="_blank" rel="noreferrer">Generation prompts</a>. <a href="/assets/tejes/cinematic/house/README.md" target="_blank" rel="noreferrer">Asset credits and approach</a>.</p></div>}
    </div>
    {menu && <div className="tj-menu" id="tejas-menu" role="dialog" aria-modal="false" aria-labelledby="tejas-menu-title" ref={dialog} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && !trigger.current?.contains(event.relatedTarget)) setMenu(false) }}>
      <button className="tj-close" onClick={() => setMenu(false)} aria-label="Close menu"><X size={22} /></button>
      <div className="tj-menu-main"><p className="tj-eyebrow" id="tejas-menu-title">TEJAS INTERIORS</p><nav aria-label="Tejas navigation"><Link to={routePaths.tejes.projects} onClick={() => setMenu(false)}>Projects <ArrowRight /></Link><Link to={routePaths.tejes.interiorDesign} onClick={() => setMenu(false)}>Services <ArrowRight /></Link><Link to={routePaths.tejes.design3d} onClick={() => setMenu(false)}>Design &amp; development <ArrowRight /></Link><Link to={routePaths.tejes.contact} onClick={() => setMenu(false)}>Get in touch <ArrowRight /></Link></nav></div>
    </div>}
  </div>
}




