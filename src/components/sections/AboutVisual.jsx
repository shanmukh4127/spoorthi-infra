function AboutVisual({ variant, label = '[REAL ABOUT MEDIA REQUIRED]' }) {
  return (
    <div className={`about-visual about-visual--${variant}`} role="img" aria-label={label}>
      <div className="about-visual__frame">
        <span aria-hidden="true" className="about-visual__detail" />
        <span aria-hidden="true" className="about-visual__plane" />
        <span aria-hidden="true" className="about-visual__label">{label}</span>
      </div>
    </div>
  )
}

export default AboutVisual
