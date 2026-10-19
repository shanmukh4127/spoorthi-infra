import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import '../../styles/tejes-featured-projects.css'

const scrollStoryRevision = import.meta.hot ? (import.meta.hot.data.scrollStoryRevision ?? 0) + 1 : 0
if (import.meta.hot) import.meta.hot.data.scrollStoryRevision = scrollStoryRevision
const motionQuery = '(min-width: 901px) and (min-height: 440px) and (prefers-reduced-motion: no-preference), (max-width: 900px) and (min-height: 651px) and (prefers-reduced-motion: no-preference)'
const stageStops = [0, .48, .9]
const clamp = value => Math.max(0, Math.min(1, value))
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t) }

function StoryImage({ media }) {
  const [failed, setFailed] = useState(false)
  const missingLabel = failed ? 'Project image unavailable' : media.missingLabel || 'Project image not yet added'
  if (!media.image.src || failed) return <div className="tfp-image-missing" role="img" aria-label={missingLabel}>{missingLabel}</div>
  return <img src={media.image.src} srcSet={media.image.srcSet} sizes="(max-width: 900px) 88vw, 51vw" width={media.image.width} height={media.image.height} alt={media.alt} style={{ objectPosition: media.image.focalPoint }} loading="lazy" decoding="async" onError={() => setFailed(true)} />
}

export default function ProjectScrollStory({ project, index, total, stages, copy, projectLinkLabel }) {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const [animated, setAnimated] = useState(() => typeof window !== 'undefined' && window.matchMedia(motionQuery).matches)

  useEffect(() => {
    const query = window.matchMedia(motionQuery)
    const change = () => setAnimated(query.matches)
    query.addEventListener('change', change)
    change()
    return () => query.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    const element = root.current
    element.dataset.motionDriver = animated ? 'cards-and-copy' : 'reading'
    element.dataset.motionRevision = String(scrollStoryRevision)
    const cards = [...element.querySelectorAll('.tfp-stage')]
    const images = cards.map(card => card.querySelector('.tfp-image img'))
    const descriptions = [...element.querySelectorAll('.tfp-description-stage')]
    const descriptionStack = element.querySelector('.tfp-description-stack')
    const hint = element.querySelector('.tfp-stage-hint')
    let frame = 0
    let descriptionTravel = 164
    const measureDescriptions = () => {
      if (animated) {
        const height = Math.max(...descriptions.map(description => description.offsetHeight))
        descriptionStack.style.height = `${height}px`
        descriptionTravel = height + 24
      }
    }
    const update = () => {
      frame = 0
      const height = window.innerHeight
      const bounds = element.getBoundingClientRect()
      if (bounds.bottom < 0 || bounds.top > height) return
      let nearest = 0
      if (animated) {
        // Settled holds bracket each exchange; the last hold finishes before
        // the sticky viewport releases at the end of this project's runway.
        const stickyTop = parseFloat(getComputedStyle(element).getPropertyValue('--tfp-header-offset')) || 0
        const progress = clamp((stickyTop - bounds.top) / Math.max(1, element.offsetHeight - element.querySelector('.tfp-project-pin').offsetHeight))
        const first = ease((progress - .16) / .22)
        const second = ease((progress - .58) / .22)
        nearest = first < .5 ? 0 : second < .5 ? 1 : 2
        hint.style.opacity = (first > 0 && first < 1) || (second > 0 && second < 1) ? 0 : 1
        element.dataset.progress = progress.toFixed(3)
        cards.forEach((card, i) => {
          const enter = i === 0 ? 1 : i === 1 ? first : second
          const leave = i === 0 ? first : i === 1 ? second : 0
          const incoming = 1 - enter
          const opacity = ease(enter / .4) * (1 - ease((leave - .7) / .3))
          // The reference is led by vertical parallax and image scale. Keep
          // the cards nearly upright, with depth confined to each exchange.
          card.style.transform = `translate3d(${incoming * 8 - leave * 6}%, ${incoming * 45 - leave * 65}%, ${-incoming * 160 + leave * 50}px) rotateX(${incoming * 3 - leave * 4}deg) rotateY(${-incoming * 3}deg) rotateZ(${incoming * 2 - leave * 2.5}deg) scale(${1 - incoming * .1 - leave * .06})`
          if (i > 0 && images[i]) images[i].style.transform = `scale(${1 + incoming * .06 + leave * .035})`
          card.style.opacity = opacity
          card.style.visibility = opacity < .001 ? 'hidden' : 'visible'
          card.style.zIndex = leave > 0 && leave < 1 ? 4 : 3 - i
          // Use the same entry/exit phases as the media, with enough vertical
          // separation to keep outgoing and incoming sentences legible.
          const textOpacity = ease(enter / .65) * (1 - ease(leave / .6))
          descriptions[i].style.transform = `translate3d(0, ${(incoming - leave) * descriptionTravel}px, 0)`
          descriptions[i].style.opacity = textOpacity
          descriptions[i].style.visibility = textOpacity < .001 ? 'hidden' : 'visible'
        })
      } else {
        let distance = Infinity
        cards.forEach((card, i) => {
          card.removeAttribute('style')
          images[i]?.style.removeProperty('transform')
          const rect = card.getBoundingClientRect()
          const delta = Math.abs(rect.top + rect.height / 2 - height / 2)
          if (delta < distance) { nearest = i; distance = delta }
        })
      }
      setActive(previous => previous === nearest ? previous : nearest)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(() => { measureDescriptions(); schedule() })
    descriptions.forEach(description => observer.observe(description))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    measureDescriptions()
    update()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [animated, stages])

  return <article className={`tfp-project ${animated ? 'tfp-project--animated' : 'tfp-project--static'}`} id={`featured-${project.id}`} ref={root} aria-label={project.title}>
    {animated && stages.map((stage, i) => <span key={stage.key} className="tfp-stage-anchor" id={`featured-${project.id}-${i}`} style={{ top: `${stageStops[i] * 300}svh` }} aria-hidden="true" />)}
    <div className="tfp-project-pin">
    {animated && <div className="tfp-project-side">
      <div className="tfp-project-copy">
        <div className="tfp-description-stack">
          {stages.map((stage, i) => <div className="tfp-description-stage" key={stage.key} aria-hidden={active !== i ? true : undefined}>
            <h3 className="tfp-description-title">{copy[stage.copyKey].heading}</h3>
            <p className="tfp-description">{copy[stage.copyKey].description}</p>
          </div>)}
        </div>
        {projectLinkLabel && project.detailRoute && <Link className="tfp-link tfp-project-link" to={project.detailRoute}>{projectLinkLabel}<ArrowRight size={15} aria-hidden="true" /></Link>}
      </div>
    </div>}
    <div className="tfp-media-sequence">
      {stages.map((stage, i) => {
        const media = project[stage.key][0]
        return <section className={`tfp-stage tfp-stage--${i + 1}`} id={animated ? undefined : `featured-${project.id}-${i}`} key={stage.key} aria-hidden={animated && active !== i ? true : undefined} aria-labelledby={`featured-${project.id}-stage-${i}`}>
          {!animated && <div className="tfp-static-description"><h3 className="tfp-description-title">{copy[stage.copyKey].heading}</h3><p className="tfp-description">{copy[stage.copyKey].description}</p></div>}
          <figure className="tfp-card">
            <div className="tfp-card-heading"><span>{stage.label}</span><span>{project.title}</span></div>
            <div className={`tfp-image ${i === 0 ? 'tfp-image--plan' : ''}`}><StoryImage key={media.image.src || 'missing'} media={media} /></div>
            <figcaption><h4 id={`featured-${project.id}-stage-${i}`}>{stage.title}</h4><p>{stage.note}</p></figcaption>
          </figure>
        </section>
      })}
      <div className="tfp-stage-hint" aria-hidden="true"><span>{active < 2 ? `Scroll to reveal · ${stages[active + 1].label}` : index < total - 1 ? 'Continue to the next story' : 'Continue your story'}</span><ArrowDown size={14} /></div>
    </div>
    </div>
    {!animated && projectLinkLabel && project.detailRoute && <div className="tfp-project-reading-link"><Link className="tfp-link" to={project.detailRoute}>{projectLinkLabel}<ArrowRight size={15} aria-hidden="true" /></Link></div>}
  </article>
}

