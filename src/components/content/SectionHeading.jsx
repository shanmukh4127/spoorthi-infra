function SectionHeading({ eyebrow, title, description, as: Heading = 'h2', align = 'left', className = '' }) {
  const headingClass = Heading === 'h1' ? 'type-h1' : 'type-h2'
  return (
    <header className={['section-heading', `section-heading--${align}`, className].filter(Boolean).join(' ')}>
      {eyebrow && <p className="type-label section-heading__eyebrow">{eyebrow}</p>}
      <Heading className={`${headingClass} section-heading__title`}>{title}</Heading>
      {description && <p className="type-body-large section-heading__description">{description}</p>}
    </header>
  )
}

export default SectionHeading
