import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { archive } from '../../data/tejes/projectArchive.js'
import { routePaths } from '../../data/routePaths.js'

export default function TejesProjectsHeader() {
  const [open, setOpen] = useState(false)
  const container = useRef(null)
  const trigger = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const key = event => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('pointerdown', outside) }
  }, [open])
  return <header className="tp-header">
    <Link to={routePaths.tejes.home} aria-label="Tejes Interiors home"><img className="tp-logo" src="/assets/tejes/brand/wordmark.svg" width="140" height="60" alt="Tejes Interiors" /></Link>
    <span className="tp-page-indicator">Projects</span>
    <div className="tp-menu" ref={container} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <button ref={trigger} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="tejes-projects-menu" onClick={() => setOpen(value => !value)}>
        Menu <span>{open ? <X size={16} /> : <Menu size={16} />}</span>
      </button>
      <nav id="tejes-projects-menu" aria-label="Projects navigation" hidden={!open}>
        {archive.navigation.map(item => item.path.startsWith('#')
          ? <a key={item.title} href={item.path} onClick={() => setOpen(false)}>{item.title}</a>
          : <Link key={item.title} to={item.path} onClick={() => setOpen(false)}>{item.title}</Link>)}
      </nav>
    </div>
  </header>
}
