import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { getBrandNavigation } from '../../data/navigation.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-cinematic-tokens.css'
import '../../styles/spoorthi-cinematic-header.css'

function OfficialLogo() {
  return <img src="/assets/spoorthi/brand/official-logo-600.webp" srcSet="/assets/spoorthi/brand/official-logo-600.webp 600w, /assets/spoorthi/brand/official-logo-1200.webp 1200w" sizes="(max-width: 540px) 150px, 196px" alt="Spoorthi Infra" width="600" height="243" />
}

export default function SpoorthiCinematicHeader() {
  const [open, setOpen] = useState(false)
  const dialog = useRef(null)
  const trigger = useRef(null)
  const id = useId()
  useEffect(() => {
    if (!open) return
    const panel = dialog.current
    const menuTrigger = trigger.current
    const previousOverflow = document.body.style.overflow
    panel.showModal()
    panel.querySelector('button')?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'
    return () => {
      panel.close()
      document.body.style.overflow = previousOverflow
      menuTrigger?.focus({ preventScroll: true })
    }
  }, [open])
  return <header className="si-cinematic-header">
    <Link className="si-official-logo" to={routePaths.spoorthi.home} aria-label="Spoorthi Infra home"><OfficialLogo /></Link>
    <button className="si-menu-trigger" ref={trigger} type="button" onClick={() => setOpen(true)} aria-label="Open Spoorthi navigation" aria-expanded={open} aria-controls={id}><span>Menu</span><i><Menu size={20} strokeWidth={1.5} aria-hidden="true" /></i></button>
    <dialog id={id} ref={dialog} className="si-menu-overlay" aria-labelledby={`${id}-title`} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="si-menu-overlay__head"><Link to={routePaths.spoorthi.home} className="si-official-logo" aria-label="Spoorthi Infra home" onClick={() => setOpen(false)}><OfficialLogo /></Link><button autoFocus type="button" className="si-menu-trigger" onClick={() => setOpen(false)} aria-label="Close Spoorthi navigation"><span>Close</span><i><X size={20} strokeWidth={1.5} aria-hidden="true" /></i></button></div>
      <div className="si-menu-overlay__body"><div className="si-menu-overlay__intro"><p id={`${id}-title`}>Explore Spoorthi</p><h2>Building <br />tomorrow’s <br /><em>spaces.</em></h2><span>Construction / Infrastructure / Engineering</span></div>
        <nav aria-label="Spoorthi Infra overlay navigation">{getBrandNavigation('spoorthi').map((item, index) => <NavLink to={item.path} end={item.end} key={item.path} onClick={() => setOpen(false)}><small>0{index + 1}</small><span>{item.label}</span><ArrowUpRight size={22} strokeWidth={1.3} aria-hidden="true" /></NavLink>)}</nav>
      </div>
      <div className="si-menu-overlay__foot"><span>Spoorthi Infra</span><span>From vision to built form.</span></div>
    </dialog>
  </header>
}
