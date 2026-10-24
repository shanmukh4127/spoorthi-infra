import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-cinematic-tokens.css'
import '../../styles/spoorthi-cinematic-header.css'

function OfficialLogo() {
  return <img src="/assets/spoorthi/brand/official-logo-dark.svg" alt="Spoorthi Infra" width="2500" height="1012" />
}

export default function SpoorthiCinematicHeader({ inFlow = false }) {
  const [open, setOpen] = useState(false)
  const [overScene, setOverScene] = useState(false)
  const menu = useRef(null)
  const trigger = useRef(null)
  const header = useRef(null)
  const id = useId()
  useEffect(() => {
    const journey = document.querySelector('.si-journey')
    if (!journey) return
    const update = () => {
      // A queued observer/scroll callback can arrive during route teardown.
      if (!header.current || !journey.isConnected) return
      setOverScene(!journey.classList.contains('si-journey--static') && journey.getBoundingClientRect().bottom > header.current.getBoundingClientRect().height)
    }
    const observer = new IntersectionObserver(update, { rootMargin: '-76px 0px 0px 0px' })
    const mode = new MutationObserver(update)
    observer.observe(journey)
    mode.observe(journey, { attributes: true, attributeFilter: ['class'] })
    // Native scrolling also covers the small mobile/desktop header-height difference.
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => { observer.disconnect(); mode.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = event => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus({ preventScroll: true }) }
    }
    const onPointer = event => { if (!menu.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])
  const moveFocus = event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const links = [...menu.current.querySelectorAll('nav a')]
    const current = links.indexOf(document.activeElement)
    if (!open && event.target !== trigger.current) return
    event.preventDefault()
    setOpen(true)
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : event.key === 'ArrowDown' ? (current + 1) % links.length : (current <= 0 ? links.length - 1 : current - 1)
    requestAnimationFrame(() => links[index]?.focus())
  }
  return <header ref={header} className={`si-cinematic-header${inFlow ? ' si-cinematic-header--in-flow' : ''}${overScene ? ' si-cinematic-header--over-scene' : ''}`}>
    <Link className="si-official-logo" to={routePaths.spoorthi.home} aria-label="Spoorthi Infra home"><OfficialLogo /></Link>
    <div className="si-menu" ref={menu} onKeyDown={moveFocus} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <button className="si-menu-trigger" ref={trigger} type="button" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close Spoorthi navigation' : 'Open Spoorthi navigation'} aria-expanded={open} aria-controls={id}><span>Menu</span><i>{open ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}</i></button>
      <nav id={id} className="si-menu-panel" aria-label="Spoorthi navigation" hidden={!open}>
        {[
          ['Home', routePaths.spoorthi.home],
          ['Projects', routePaths.spoorthi.projects],
          ['Contact', routePaths.spoorthi.contact],
          ['Shift to Tejes', routePaths.tejes.home],
        ].map(([label, path]) => <NavLink key={path} to={path} end onClick={() => setOpen(false)}><span>{label}</span><ArrowUpRight size={15} strokeWidth={1.4} aria-hidden="true" /></NavLink>)}
      </nav>
    </div>
  </header>
}
