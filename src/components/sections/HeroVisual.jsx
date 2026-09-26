function HeroVisual({ variant, label = '[REAL HERO MEDIA REQUIRED]' }) {
  return (
    <div className={`hero-visual hero-visual--${variant}`} role="img" aria-label={label}>
      <div className="hero-visual__frame">
        <span aria-hidden="true" className="hero-visual__grid" />
        <span aria-hidden="true" className="hero-visual__focus" />
        <span aria-hidden="true" className="hero-visual__label">{label}</span>
      </div>
    </div>
  )
}

export default HeroVisual
