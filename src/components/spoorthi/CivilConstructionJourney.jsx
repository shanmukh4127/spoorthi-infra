import TextLink from '../common/TextLink.jsx'

function CivilConstructionJourney({ steps }) {
  return (
    <ol className="civil-journey">
      {steps.map((step) => (
        <li className="civil-journey__step" key={step.id}>
          <span className="civil-journey__number type-label" aria-hidden="true">{String(step.number).padStart(2, '0')}</span>
          <div className="civil-journey__copy">
            <h3 className="type-h3">{step.title}</h3>
            <p className="type-body">{step.description}</p>
            {step.link && <TextLink variant="arrow" to={step.link.path}>{step.link.label}</TextLink>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default CivilConstructionJourney
