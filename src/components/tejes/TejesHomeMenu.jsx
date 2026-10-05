import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { routePaths } from '../../data/routePaths.js'

const items = [
  ['About Tejes', '#tejes-about'], ['Our Approach', '#tejes-approach'],
  ['Services', routePaths.tejes.interiorDesign], ['Projects', routePaths.tejes.projects],
  ['Design Development', routePaths.tejes.design3d], ['Contact', routePaths.tejes.contact],
]

export function TejesWordmark() {
  return <Link to={routePaths.tejes.home} className="th-wordmark" aria-label="Tejes Interiors home"><img src="/assets/tejes/brand/wordmark.svg" alt="Tejes Interiors" width="700" height="300" /></Link>
}

export default function TejesHomeMenu() {
  // The approved desktop reference shows the menu expanded.
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 1000px)').matches)
  const trigger = useRef(null)
  const menu = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const onKey = event => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    const onPointer = event => { if (!menu.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer) }
  }, [open])
  return <header className="th-header">
    <TejesWordmark />
    <div ref={menu} className="th-menu" onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <button ref={trigger} type="button" className="th-menu-trigger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="tejes-home-menu" onClick={() => setOpen(value => !value)}><span>Menu</span><span className="th-menu-symbol">{open ? <X size={14} aria-hidden="true" /> : <Menu size={14} aria-hidden="true" />}</span></button>
      <nav id="tejes-home-menu" className={`th-menu-panel${open ? ' is-open' : ''}`} aria-label="Tejes homepage" hidden={!open}>
        {items.map(([label, path]) => path.startsWith('#') ? <a key={label} href={path} onClick={() => setOpen(false)}>{label}</a> : <Link key={label} to={path} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
    </div>
  </header>
}
