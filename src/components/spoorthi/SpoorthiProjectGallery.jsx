import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Media from '../common/Media.jsx'

function normalizeAsset(asset, index, label) {
  if (typeof asset === 'string') return { src: asset, alt: `${label} image ${index + 1}` }
  if (!asset || typeof asset !== 'object') return null
  return { src: asset.src ?? asset.url, alt: asset.alt ?? `${label} image ${index + 1}`, caption: asset.caption, aspect: asset.aspect ?? 'landscape' }
}

function SpoorthiProjectGallery({ label, assets = [] }) {
  const assetList = Array.isArray(assets) ? assets : assets?.image ? [assets.image] : []
  const slides = assetList.map((asset, index) => normalizeAsset(asset, index, label)).filter((asset) => asset?.src)
  const [selectedIndex, setSelectedIndex] = useState(0)
  if (!slides.length) return null
  const activeIndex = Math.min(selectedIndex, slides.length - 1)
  const active = slides[activeIndex]
  const multiple = slides.length > 1
  const setSlide = (index) => setSelectedIndex((index + slides.length) % slides.length)

  return <div className="spoorthi-project-gallery" role="region" aria-label={label} aria-roledescription={multiple ? 'carousel' : undefined} tabIndex={multiple ? 0 : undefined} onKeyDown={multiple ? (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      setSlide(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1))
    }
  } : undefined}>
    <Media key={active.src} src={active.src} alt={active.alt} caption={active.caption} aspect={active.aspect} />
    {multiple && <div className="spoorthi-project-gallery__controls">
      <button type="button" onClick={() => setSlide(activeIndex - 1)} aria-label={`Previous ${label} image`}><ArrowLeft aria-hidden="true" size={18} /><span>Previous</span></button>
      <span className="spoorthi-project-gallery__count" aria-live="polite" aria-atomic="true">{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => setSlide(activeIndex + 1)} aria-label={`Next ${label} image`}><span>Next</span><ArrowRight aria-hidden="true" size={18} /></button>
    </div>}
    {multiple && <div className="spoorthi-project-gallery__thumbs" role="group" aria-label={`${label} image selection`}>
      {slides.map((slide, index) => <button key={`${slide.src}-${index}`} type="button" onClick={() => setSlide(index)} aria-label={`Show ${label} image ${index + 1}`} aria-pressed={index === activeIndex}>{index + 1}</button>)}
    </div>}
  </div>
}

export default SpoorthiProjectGallery
