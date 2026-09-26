function FeatureCard({ feature }) {
  return (
    <article className="feature-card">
      {feature.label && <p className="type-label">{feature.label}</p>}
      <h3 className="type-h3">{feature.title}</h3>
      {feature.description && <p className="type-body">{feature.description}</p>}
    </article>
  )
}

export default FeatureCard
