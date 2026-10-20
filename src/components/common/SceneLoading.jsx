import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../../styles/scene-loading.css'

export default function SceneLoading({ brand, onContinue }) {
  const isSpoorthi = brand === 'spoorthi'
  const name = isSpoorthi ? 'Spoorthi Infra' : 'Tejes Interiors'
  const logo = isSpoorthi ? '/assets/spoorthi/brand/official-logo-600.webp' : '/assets/tejes/brand/wordmark.svg'
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const escape = event => { if (event.key === 'Escape') onContinue() }
    document.addEventListener('keydown', escape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', escape)
    }
  }, [onContinue])
  if (typeof document === 'undefined') return null
  return createPortal(<div className="scene-loading" role="status" aria-label={`Loading ${name} animation. Press Escape to continue without animation.`}>
    <div className="scene-loading__logo" aria-hidden="true">
      <img src={logo} alt="" width={isSpoorthi ? 600 : 700} height={isSpoorthi ? 243 : 300} />
      <span className="scene-loading__sweep" />
    </div>
  </div>, document.body)
}
