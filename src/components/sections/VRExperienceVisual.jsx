function VRExperienceVisual({ variant, label = '[REAL VR EXPERIENCE MEDIA REQUIRED]' }) {
  return (
    <div className={`vr-experience-visual vr-experience-visual--${variant}`} role="img" aria-label={label}>
      <div className="vr-experience-visual__frame">
        <span aria-hidden="true" className="vr-experience-visual__field" />
        <span aria-hidden="true" className="vr-experience-visual__depth" />
        <span aria-hidden="true" className="vr-experience-visual__label">{label}</span>
      </div>
    </div>
  )
}

export default VRExperienceVisual
