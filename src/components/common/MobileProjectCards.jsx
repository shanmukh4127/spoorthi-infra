import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function MobileProjectCards({ id, projects, stages, copyFor, linkLabel = 'Explore project', floating = false }) {
  const track = useRef(null)
  const [active, setActive] = useState(0)
  if (!projects.length) return null
  const activeIndex = Math.min(active, projects.length - 1)
  const project = projects[activeIndex]
  const copy = copyFor(project)?.[stages.at(-1).copyKey]
  const update = () => {
    const cards = [...track.current.children]
    const center = track.current.getBoundingClientRect().left + track.current.clientWidth / 2
    let nearest = 0, distance = Infinity
    cards.forEach((card, index) => {
      const bounds = card.getBoundingClientRect()
      const delta = Math.abs(bounds.left + bounds.width / 2 - center)
      if (delta < distance) { distance = delta; nearest = index }
      if (floating) {
        const phase = Math.max(-1, Math.min(1, (bounds.left + bounds.width / 2 - center) / (bounds.width + 18)))
        const amount = Math.abs(phase)
        const content = card.querySelector('.tfp-mobile-float')
        content.style.transform = `translate3d(${phase * 4}%, ${phase * (phase > 0 ? 18 : 24)}%, ${-amount * 80}px) rotateX(${amount * 3}deg) rotateY(${-phase * 3}deg) rotateZ(${phase * 2}deg) scale(${1 - amount * .08})`
        content.style.opacity = 1 - amount * .55
      }
    })
    setActive(nearest)
  }
  const go = index => {
    const card = track.current.children[index]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.current.scrollTo({ left: card.offsetLeft - track.current.children[0].offsetLeft, behavior: reduced ? 'instant' : 'smooth' })
  }
  return <div id={id} className={`tfp-mobile-projects${floating ? ' tfp-mobile-projects--floating' : ''}`} aria-label="Swipe through projects" role="region" aria-roledescription="carousel">
    <div className="tfp-mobile-track" ref={track} onScroll={update} tabIndex={0} aria-label={floating ? 'Project cards. Swipe left or right, or use the arrow keys.' : 'Project cards. Swipe left or right, or use the previous and next buttons.'} onKeyDown={event => {
      if (!floating || event.target.closest('a')) return
      const next = { ArrowLeft: activeIndex - 1, ArrowRight: activeIndex + 1, Home: 0, End: projects.length - 1 }[event.key]
      if (next !== undefined) { event.preventDefault(); go(Math.max(0, Math.min(projects.length - 1, next))) }
    }}>
      {projects.map((item, index) => {
        const media = item[stages.at(-1).key]?.[0] || { image: {}, alt: item.title }
        return <div className="tfp-mobile-slide" key={item.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${projects.length}: ${item.title}`}>
          <div className={floating ? 'tfp-mobile-float' : undefined}>
          <figure className="tfp-mobile-card">
            {media.image.src ? <img src={media.image.src} srcSet={media.image.srcSet} sizes="(max-width: 900px) 86vw, 650px" width={media.image.width || 1600} height={media.image.height || 1000} alt={media.alt} loading="lazy" draggable="false" /> : <div className="tfp-image-missing" role="img" aria-label="Project image not yet added">Project image not yet added</div>}
          </figure>
          {floating && <div className="tfp-mobile-caption">
            <p className="tfp-mobile-count">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
            <h3>{item.title}</h3>
            {copyFor(item)?.[stages.at(-1).copyKey] && <p>{copyFor(item)[stages.at(-1).copyKey].heading}</p>}
            {item.detailRoute && <Link className="tfp-link" to={item.detailRoute} tabIndex={activeIndex === index ? undefined : -1}>{linkLabel}<ArrowRight size={15} aria-hidden="true" /></Link>}
          </div>}
          </div>
        </div>
      })}
    </div>
    {!floating && <div className="tfp-mobile-caption" aria-live="polite" aria-atomic="true">
      <p className="tfp-mobile-count">{String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
      <h3>{project.title}</h3>
      {copy && <p>{copy.heading}</p>}
      {project.detailRoute && <Link className="tfp-link" to={project.detailRoute}>{linkLabel}<ArrowRight size={15} aria-hidden="true" /></Link>}
    </div>}
    {floating ? <p className="tfp-mobile-swipe-hint">Swipe to explore <span className="tfp-sr-only" aria-live="polite">{project.title}</span></p> : <div className="tfp-mobile-controls"><span>Swipe to explore</span><button type="button" aria-label="Previous project" disabled={activeIndex === 0} onClick={() => go(activeIndex - 1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next project" disabled={activeIndex === projects.length - 1} onClick={() => go(activeIndex + 1)}><ArrowRight size={18} /></button></div>}
  </div>
}
