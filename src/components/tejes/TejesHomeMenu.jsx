import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/tejes-shared-header.css'

const items = [
  ['Home', routePaths.tejes.home], ['Projects', routePaths.tejes.projects],
  ['Contact', routePaths.tejes.contact], ['Shift to Spoorthi', routePaths.spoorthi.home],
]

export function TejesWordmark() {
  return <Link to={routePaths.tejes.home} className="th-wordmark" aria-label="Tejes Interiors home"><img src="/assets/tejes/brand/wordmark.svg" alt="Tejes Interiors" width="700" height="300" /></Link>
}

export default function TejesHomeMenu({ initialOpen = false, navigationItems = items, navigationLabel = 'Tejes navigation' }) {
  const [open, setOpen] = useState(initialOpen)
  const trigger = useRef(null), menu = useRef(null)
  const id = useId()
  useEffect(() => {
    if (!open) return
    const onKey = event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    const onPointer = event => { if (!menu.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) }
  }, [open])
  const moveFocus = event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const links = [...menu.current.querySelectorAll('nav a')]
    const current = links.indexOf(document.activeElement)
    event.preventDefault(); setOpen(true)
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : event.key === 'ArrowDown' ? (current + 1) % links.length : current <= 0 ? links.length - 1 : current - 1
    requestAnimationFrame(() => links[index]?.focus())
  }
  return <header className="th-header tejes-shared-header">
    <TejesWordmark />
    <div ref={menu} className="th-menu" onKeyDown={moveFocus} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <button ref={trigger} type="button" className="th-menu-trigger" aria-label={open ? 'Close Tejes navigation' : 'Open Tejes navigation'} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}><span>Menu</span><span className="th-menu-symbol">{open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}</span></button>
      <nav id={id} className={`th-menu-panel${open ? ' is-open' : ''}`} aria-label={navigationLabel} hidden={!open}>
        {navigationItems.map(([label, path]) => <NavLink key={label} to={path} end onClick={() => setOpen(false)}><span>{label}</span><ArrowUpRight size={14} aria-hidden="true" /></NavLink>)}
      </nav>
    </div>
  </header>
}
