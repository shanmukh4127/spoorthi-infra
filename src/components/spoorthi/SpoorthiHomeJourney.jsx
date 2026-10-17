import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight } from 'lucide-react'
import { homeJourney } from '../../data/spoorthi/homeJourney.js'
import '../../styles/spoorthi-cinematic-tokens.css'
import '../../styles/spoorthi-home-journey.css'

const sceneQuery = '(min-width: 320px) and (min-height: 480px) and (prefers-reduced-motion: no-preference)'
const canUseScene = () => typeof window !== 'undefined' && window.matchMedia(sceneQuery).matches && !navigator.connection?.saveData
const number = value => String(value).padStart(2, '0')

export default function SpoorthiHomeJourney() {
  const [interactive, setInteractive] = useState(canUseScene)
  const [status, setStatus] = useState('loading')
  const [active, setActive] = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [retry, setRetry] = useState(0)
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const sceneRef = useRef(null)
  const progressRef = useRef(null)
  const optedOutRef = useRef(false)
  const fallback = !interactive || status === 'error'
  const readIntroduction = () => {
    optedOutRef.current = true
    setInteractive(false)
    requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }))
  }

  useEffect(() => {
    const media = window.matchMedia(sceneQuery)
    const change = () => setInteractive(!optedOutRef.current && canUseScene())
    media.addEventListener('change', change)
    navigator.connection?.addEventListener('change', change)
    return () => {
      media.removeEventListener('change', change)
      navigator.connection?.removeEventListener('change', change)
    }
  }, [])

  useEffect(() => {
    if (!interactive) return
    let disposed = false
    let runtime
    let frame = 0
    let stage = -1
    let loading = false
    const controller = new AbortController()
    const section = sectionRef.current
    const viewport = viewportRef.current
    const update = () => {
      frame = 0
      if (disposed || !runtime || document.hidden) return
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      // Native document scrolling is the only timeline. No wheel interception,
      // elapsed-time interpolation, scroll snapping or accumulated camera state.
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, section.offsetHeight - viewport.offsetHeight)))
      runtime.update(progress)
      progressRef.current?.style.setProperty('--journey-progress', progress)
      const next = Math.min(homeJourney.stages.length - 1, Math.floor(progress * homeJourney.stages.length))
      if (next !== stage) { stage = next; setActive(next) }
    }
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update) }
    const resize = () => { runtime?.resize(); schedule() }
    const contextLost = event => {
      event.preventDefault()
      if (!disposed) { setStatus('error'); setInteractive(false) }
    }
    sceneRef.current.addEventListener('webglcontextlost', contextLost, true)
    const host = sceneRef.current
    const observer = new ResizeObserver(resize)
    observer.observe(viewport)
    window.addEventListener('scroll', schedule, { passive: true })
    document.addEventListener('visibilitychange', schedule)
    const load = () => {
      if (loading || disposed) return
      loading = true
      import('./journey/createArchitecturalScene.js').then(async ({ createArchitecturalScene }) => {
      if (disposed) return
      setStatus('loading')
      setLoadProgress(0)
      runtime = await createArchitecturalScene(host, progress => { if (!disposed) setLoadProgress(Math.round(progress * 95)) }, { signal: controller.signal })
      if (disposed) { runtime.dispose(); return }
      runtime.resize()
      update()
      setLoadProgress(100)
      setStatus('ready')
      }).catch(() => { if (!disposed) { setStatus('error'); setInteractive(false) } })
    }
    // The 3D module and local assets are requested only near the introduction,
    // including when a visitor returns directly to a protected section below.
    const visibility = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { load(); visibility.disconnect() }
    }, { rootMargin: '300px' })
    visibility.observe(section)
    return () => {
      disposed = true
      controller.abort()
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibility.disconnect()
      host.removeEventListener('webglcontextlost', contextLost, true)
      window.removeEventListener('scroll', schedule)
      document.removeEventListener('visibilitychange', schedule)
      runtime?.dispose()
    }
  }, [interactive, retry])

  return <section ref={sectionRef} style={{ '--journey-chapters': homeJourney.stages.length }} className={`si-journey${fallback ? ' si-journey--static' : ''}`} aria-label="Spoorthi construction journey" data-chapter={active + 1} data-scene-status={fallback ? (status === 'error' ? 'error' : 'static') : status}>
    <div className="si-journey__viewport" ref={viewportRef}>
      <div className="si-journey__scene" ref={sceneRef} aria-hidden="true" />
      <div className="si-journey__poster" aria-hidden="true"><img src="/assets/spoorthi/cinematic/construction-reference-1600.webp" srcSet="/assets/spoorthi/cinematic/construction-reference-640.webp 640w, /assets/spoorthi/cinematic/construction-reference-960.webp 960w, /assets/spoorthi/cinematic/construction-reference-1600.webp 1600w, /assets/spoorthi/cinematic/construction-reference-2560.webp 2560w" sizes={fallback ? '90vw' : '100vw'} alt="" width="5408" height="3600" loading="eager" fetchPriority="high" /></div>
      <div className="si-journey__wash" aria-hidden="true" />
      <div className="si-journey__masthead"><span>{homeJourney.label}</span><div className="si-journey__actions">{!fallback && <button type="button" onClick={readIntroduction}>Read without 3D</button>}<a href="#spoorthi-home-content">Skip introduction <ArrowDownRight size={15} aria-hidden="true" /></a></div></div>
      <div className="si-journey__story">
        {homeJourney.stages.map((step, index) => <article className={`si-journey__chapter${index === active ? ' is-active' : ''}`} aria-hidden={!fallback && index !== active ? true : undefined} key={step.label}>
          <p className="si-journey__label"><span>{number(index + 1)}</span>{step.label}</p>
          <h2>{step.title.slice(0, step.title.indexOf(step.emphasis))}<em>{step.emphasis}</em>{step.title.slice(step.title.indexOf(step.emphasis) + step.emphasis.length)}</h2><p className="si-journey__description">{step.text}</p>
          <span className="si-journey__detail">{step.detail}</span>
          {index === homeJourney.stages.length - 1 && <a href="#spoorthi-home-content" tabIndex={!fallback && active !== index ? -1 : undefined} className="si-journey__continue">Discover Spoorthi <ArrowRight size={17} aria-hidden="true" /></a>}
        </article>)}
      </div>
      <div className="si-journey__foot">
        <div className="si-journey__scroll"><ArrowDown size={16} aria-hidden="true" /><span>Scroll to explore<br /><small>Reverse to retrace the journey</small></span></div>
        <p className="si-journey__notice">{fallback ? 'Reference photograph · Not a Spoorthi project' : homeJourney.notice}</p>
        <div className="si-journey__progress" ref={progressRef} aria-label={`Chapter ${active + 1} of ${homeJourney.stages.length}`}><span>{number(active + 1)}</span><i aria-hidden="true"><b /></i><span>{number(homeJourney.stages.length)}</span></div>
      </div>
      {!fallback && status === 'loading' && <div className="si-journey__loading" role="status"><span>Loading construction scene · {loadProgress}%</span><progress aria-label="Construction scene assets" max="100" value={loadProgress} /></div>}
      {status === 'error' && <div className="si-journey__error" role="status">The interactive view is unavailable. You can read the introduction below. <button type="button" onClick={() => { setStatus('loading'); setRetry(value => value + 1); setInteractive(canUseScene()) }}>Retry 3D view</button></div>}
    </div>
  </section>
}
