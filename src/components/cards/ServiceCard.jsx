function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <p className="type-label">{service.label}</p>
      <h3 className="type-h3">{service.title}</h3>
      {service.description && <p className="type-body">{service.description}</p>}
    </article>
  )
}

export default ServiceCard
