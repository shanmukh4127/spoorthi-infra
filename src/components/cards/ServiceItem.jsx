import TextLink from '../common/TextLink.jsx'

function ServiceItem({ service, index }) {
  const number = String(index + 1).padStart(2, '0')
  const description = service.description?.startsWith('[') ? null : service.description

  return (
    <article className="service-item">
      <p className="service-item__number type-label">{number}</p>
      <div className="service-item__content">
        <h3 className="service-item__title type-h3">{service.label}</h3>
        {description && <p className="service-item__description type-body">{description}</p>}
      </div>
      {service.route && (
        <TextLink className="service-item__link" to={service.route} variant="arrow">
          Explore service
        </TextLink>
      )}
    </article>
  )
}

export default ServiceItem
