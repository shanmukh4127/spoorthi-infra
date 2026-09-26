function FinalOutputVisual({ variant, label = '[REAL FINAL OUTPUT MEDIA REQUIRED]' }) {
  return (
    <div className={`final-output-visual final-output-visual--${variant}`} role="img" aria-label={label}>
      <div className="final-output-visual__frame">
        <span aria-hidden="true" className="final-output-visual__field" />
        <span aria-hidden="true" className="final-output-visual__result" />
        <span aria-hidden="true" className="final-output-visual__label">{label}</span>
      </div>
    </div>
  )
}

export default FinalOutputVisual
