import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { signatureProject, selectedProjects } from '../../data/tejes/projectArchive.js'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/tejes-featured-projects.css'

const projects = [signatureProject, ...selectedProjects.slice(0, 2)]
// Fast Refresh can preserve an old imperative scroll subscription while replacing
// its text nodes. Remount only these project stages after a development edit;
// the preceding house walkthrough and production rendering are unaffected.
const motionRevision = import.meta.hot ? (import.meta.hot.data.tejesMotionRevision ?? 0) + 1 : 0
if (import.meta.hot) import.meta.hot.data.tejesMotionRevision = motionRevision
const stages = [
  { key: 'twoDImages', copyKey: 'twoD', label: '2D design', title: 'First, a sense of space.', note: 'Illustrative planning study · Shared concept plan, not an approved project drawing' },
  { key: 'threeDImages', copyKey: 'threeD', label: '3D design', title: 'An idea takes dimension.', note: 'Illustrative spatial perspective' },
  { key: 'visualizationImages', copyKey: 'visualization', label: 'Final output', title: 'The atmosphere, resolved.', note: 'Final concept visualization · Not completed-project photography' },
]
const featuredCopy = {
  'signature-residence': {
    twoD: { heading: 'A plan for everyday living.', description: 'Living, dining and kitchen areas form the social heart of this concept plan. Furnished room layouts show how everyday movement can connect shared spaces with quieter places to rest.' },
    threeD: { heading: 'Giving the plan depth.', description: 'A low, sculptural table anchors the seating arrangement, while tall glazing opens the room toward greenery. Warm timber and soft upholstery give the spatial study a calm, welcoming character.' },
    visualization: { heading: 'Light brings it together.', description: 'Daylight draws out the grain of timber, the softness of pale seating and the weight of the stone table. This final visualization brings those textures into one quiet, garden-facing composition.' },
  },
  'harmony-home': {
    twoD: { heading: 'Room to cook, gather and move.', description: 'The planning study explores a clear connection between the kitchen, dining table and living area. Furniture placement gives shared routines room to flow, while keeping the quieter rooms easy to reach.' },
    threeD: { heading: 'Shared spaces, in perspective.', description: 'An open kitchen perspective tests the scale of timber joinery, the island and seating. Long sightlines toward the living space show how gathering areas can feel connected without losing definition.' },
    visualization: { heading: 'A warmer way to gather.', description: 'Pale upholstery, natural wood and a sculptural table soften the shared living space. The final concept image explores a warm material palette and a generous relationship with the garden.' },
  },
  'serenity-villa': {
    twoD: { heading: 'Space for a quieter rhythm.', description: 'The layout considers the balance between shared rooms and private retreat. Furniture outlines and circulation paths help test how resting, reading and everyday movement can fit within a considered residential plan.' },
    threeD: { heading: 'A retreat takes shape.', description: 'The bedroom perspective studies the relationship between the upholstered bed, full-height timber surfaces and natural light. Soft furnishings bring warmth, while built-in elements give the room a clear, calm structure.' },
    visualization: { heading: 'An atmosphere of ease.', description: 'Soft seating and a low stone table sit within a bright, nature-facing interior. This final visualization explores how layered neutral tones, gentle daylight and an open outlook can create a feeling of retreat.' },
  },
}
const motionQuery = '(min-width: 901px) and (min-height: 440px) and (prefers-reduced-motion: no-preference), (max-width: 900px) and (min-height: 651px) and (prefers-reduced-motion: no-preference)'
const stageStops = [0, .48, .9]
const clamp = value => Math.max(0, Math.min(1, value))
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t) }

function FeaturedProject({ project, index }) {
  const copy = featuredCopy[project.id]
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const [animated, setAnimated] = useState(() => window.matchMedia(motionQuery).matches)

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
    element.dataset.motionRevision = String(motionRevision)
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
        const progress = clamp(-bounds.top / Math.max(1, element.offsetHeight - element.querySelector('.tfp-project-pin').offsetHeight))
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
          if (i > 0) images[i].style.transform = `scale(${1 + incoming * .06 + leave * .035})`
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
          images[i].style.removeProperty('transform')
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
  }, [animated])

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
      </div>
    </div>}
    <div className="tfp-media-sequence">
      {stages.map((stage, i) => {
        const media = project[stage.key][0]
        return <section className={`tfp-stage tfp-stage--${i + 1}`} id={animated ? undefined : `featured-${project.id}-${i}`} key={stage.key} aria-hidden={animated && active !== i ? true : undefined} aria-labelledby={`featured-${project.id}-stage-${i}`}>
          {!animated && <div className="tfp-static-description"><h3 className="tfp-description-title">{copy[stage.copyKey].heading}</h3><p className="tfp-description">{copy[stage.copyKey].description}</p></div>}
          <figure className="tfp-card">
            <div className="tfp-card-heading"><span>{stage.label}</span><span>{project.title}</span></div>
            <div className={`tfp-image ${i === 0 ? 'tfp-image--plan' : ''}`}><img src={media.image.src} srcSet={media.image.srcSet} sizes="(max-width: 900px) 88vw, 51vw" width={media.image.width} height={media.image.height} alt={media.alt} style={{ objectPosition: media.image.focalPoint }} loading="lazy" decoding="async" /></div>
            <figcaption><h4 id={`featured-${project.id}-stage-${i}`}>{stage.title}</h4><p>{stage.note}</p></figcaption>
          </figure>
        </section>
      })}
      <div className="tfp-stage-hint" aria-hidden="true"><span>{active < 2 ? `Scroll to reveal · ${stages[active + 1].label}` : index < projects.length - 1 ? 'Continue to the next story' : 'Continue your story'}</span><ArrowDown size={14} /></div>
    </div>
    </div>
  </article>
}

export default function TejesFeaturedProjects() {
  return <section className="tfp" id="tejes-featured-projects" aria-labelledby="tejes-featured-title">
    <header className="tfp-intro"><p className="tfp-kicker">Tejes Interiors <span>A closer look</span></p><div><h2 id="tejes-featured-title">From a first line.<br /><em>To a lasting feeling.</em></h2><p>Three selected design studies. Follow each space from its planning idea to a three-dimensional view and the final imagined atmosphere.</p></div><a className="tfp-intro-scroll" href="#featured-signature-residence">Discover the collection <ArrowDown size={17} aria-hidden="true" /></a></header>
    {projects.map((project, index) => <FeaturedProject key={`${project.id}-${motionRevision}`} project={project} index={index} />)}
    <footer className="tfp-closing"><p className="tfp-kicker">Your next chapter</p><h2>A space that feels<br /><em>like you.</em></h2><div><Link className="tfp-link" to={routePaths.tejes.contact}>Start a conversation <ArrowRight size={17} aria-hidden="true" /></Link><Link className="tfp-link" to={routePaths.tejes.projects}>View all projects <ArrowRight size={17} aria-hidden="true" /></Link></div><p className="tfp-concept">Tejes Interiors · Interior design & spatial storytelling</p></footer>
  </section>
}
