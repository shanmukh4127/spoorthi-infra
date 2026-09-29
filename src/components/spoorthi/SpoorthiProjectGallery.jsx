import { useState } from 'react'
import Media from '../common/Media.jsx'

function normalizeAsset(asset, index, label) {
  if (typeof asset === 'string') return { src: asset, alt: `${label} image ${index + 1}` }
  if (!asset || typeof asset !== 'object') return null
  return { src: asset.src ?? asset.url ?? null, alt: asset.alt ?? `${label} image ${index + 1}`, caption: asset.caption ?? null, aspect: asset.aspect ?? 'landscape' }
}

function Placeholder({ label }) {
  return <figure className="spoorthi-project-detail__placeholder" role="img" aria-label={`${label} image placeholder. Approved project media will be added later.`}><span aria-hidden="true" className="spoorthi-project-detail__placeholder-grid" /><span className="type-label">{label} / IMAGE PLACEHOLDER</span><i aria-hidden="true">+</i></figure>
}

function SpoorthiProjectGallery({ label, assets = [] }) {
  const assetList = Array.isArray(assets) ? assets : (assets?.image ? [assets.image] : [])
  const slides = assetList.map((asset, index) => normalizeAsset(asset, index, label)).filter((asset) => asset?.src)
  const [activeIndex, setActiveIndex] = useState(0)
  const hasSlides = slides.length > 0
  const active = slides[activeIndex]
  const setSlide = (index) => setActiveIndex((index + slides.length) % slides.length)

  return <div className="spoorthi-project-gallery">
    {hasSlides ? <Media src={active.src} alt={active.alt} caption={active.caption} aspect={active.aspect} /> : <Placeholder label={label} />}
    {slides.length > 1 && <div className="spoorthi-project-gallery__controls" aria-label={`${label} gallery controls`}>
      <button type="button" onClick={() => setSlide(activeIndex - 1)} aria-label={`Previous ${label} image`}>Previous</button>
      <span aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => setSlide(activeIndex + 1)} aria-label={`Next ${label} image`}>Next</button>
    </div>}
    {slides.length > 1 && <div className="spoorthi-project-gallery__thumbs" aria-label={`${label} image selection`}>
      {slides.map((slide, index) => <button key={`${slide.src}-${index}`} type="button" className={index === activeIndex ? 'is-active' : ''} onClick={() => setSlide(index)} aria-label={`Show ${label} image ${index + 1}`} aria-pressed={index === activeIndex}>{index + 1}</button>)}
    </div>}
  </div>
}

export default SpoorthiProjectGallery
