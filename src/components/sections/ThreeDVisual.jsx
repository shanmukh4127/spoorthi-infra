function ThreeDVisual({ variant, label = '[REAL 3D MEDIA REQUIRED]' }) {
  return (
    <div className={`three-d-visual three-d-visual--${variant}`} role="img" aria-label={label}>
      <div className="three-d-visual__frame">
        <span aria-hidden="true" className="three-d-visual__depth" />
        <span aria-hidden="true" className="three-d-visual__plane three-d-visual__plane--one" />
        <span aria-hidden="true" className="three-d-visual__plane three-d-visual__plane--two" />
        <span aria-hidden="true" className="three-d-visual__label">{label}</span>
      </div>
    </div>
  )
}

export default ThreeDVisual
