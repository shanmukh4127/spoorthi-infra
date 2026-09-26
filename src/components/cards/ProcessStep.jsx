function ProcessStep({ step }) {
  const description = step.description?.startsWith('[') ? null : step.description

  return (
    <article className="process-step">
      <div className="process-step__marker">
        <p className="process-step__number type-label">{String(step.number).padStart(2, '0')}</p>
      </div>
      <div className="process-step__content">
        <h3 className="process-step__title type-h3">{step.title}</h3>
        {description && <p className="process-step__description type-body">{description}</p>}
      </div>
    </article>
  )
}

export default ProcessStep
