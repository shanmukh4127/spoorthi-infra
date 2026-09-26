function TwoDVisual({ variant, label = '[REAL 2D MEDIA REQUIRED]' }) {
  return (
    <div className={`two-d-visual two-d-visual--${variant}`} role="img" aria-label={label}>
      <div className="two-d-visual__frame">
        <span aria-hidden="true" className="two-d-visual__grid" />
        <span aria-hidden="true" className="two-d-visual__drawing" />
        <span aria-hidden="true" className="two-d-visual__label">{label}</span>
      </div>
    </div>
  )
}

export default TwoDVisual
