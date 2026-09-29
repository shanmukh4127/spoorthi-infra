import Media from '../common/Media.jsx'
import TextLink from '../common/TextLink.jsx'

function DemoVisual({ variant }) {
  return (
    <figure className={`spoorthi-project-visual spoorthi-project-visual--${variant}`}>
      <div className="spoorthi-project-visual__drawing" aria-hidden="true">
        <svg viewBox="0 0 500 340" fill="none" focusable="false">
          <path className="portfolio-sketch__ground" d="m25 273 230 52 225-89-229-43Z" />
          {variant === 'frames' ? <>
            <path className="portfolio-sketch__light" d="M65 60h365v225H65Z" />
            <path className="portfolio-sketch__shade" d="m65 60 90 60v110l-90 55ZM430 60l-90 60v110l90 55Z" />
            <path className="portfolio-sketch__line" d="M155 120h185v110H155ZM65 60l90 60M430 60l-90 60M65 285l90-55M430 285l-90-55M108 89v168M386 89v168M155 172h185" />
            <path className="portfolio-sketch__accent" d="M200 170h75v60h-75Z" />
          </> : <>
            <path className="portfolio-sketch__shade" d="M80 135v125l190 40V165Z" />
            <path className="portfolio-sketch__light" d="m270 165 150-70v145l-150 60Z" />
            <path className="portfolio-sketch__accent" d="m80 135 145-65 195 25-150 70Z" />
            <g className="portfolio-sketch__line"><path d="M80 195l190 42 150-67M125 145v125M175 155v125M225 166v123M315 143v136M365 118v139" />{variant === 'facade' && <path d="M80 165l190 37 150-68M80 225l190 43 150-62M102 139v126M150 151v124M200 161v124M292 155v136M340 132v135M392 107v140" />}</g>
            {variant === 'planes' && <path className="portfolio-sketch__light" d="m55 127 168-78 220 29-23 17-195-25-145 65Z" />}
          </>}
          <path className="portfolio-sketch__guide" d="M35 300H465M50 30V305M450 30V305" />
        </svg>
      </div>
      <figcaption>Illustrative demo / Not a project image</figcaption>
    </figure>
  )
}

function cleanText(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const text = String(value).trim()
  return text && !text.includes('[') ? text : null
}

function ProjectImage({ src, settings = {} }) {
  // Meaningful portfolio images require approved image-specific alternative text.
  const alt = cleanText(settings.alt)
  if (!cleanText(src) || !alt) return null
  return <Media key={src} src={src} alt={alt} caption={cleanText(settings.caption)} aspect={settings.aspect ?? 'landscape'} objectPosition={settings.objectPosition ?? 'center'} srcSet={settings.srcSet} sizes={settings.sizes} width={settings.width} height={settings.height} />
}

function SpoorthiProjectEntry({ project, anchorId, presentation = {}, preview = false, number }) {
  const category = cleanText(project.category)
  const location = cleanText(project.location)
  const year = cleanText(project.year)
  const description = cleanText(project.description)
  const hasCover = Boolean(cleanText(project.coverImage) && cleanText(presentation.cover?.alt))
  const gallery = Array.isArray(project.gallery) ? project.gallery : []
  const usableGallery = gallery.map((src, index) => ({ src, settings: presentation.gallery?.[index] })).filter(({ src, settings }) => cleanText(src) && cleanText(settings?.alt))

  if (preview) {
    return (
      <article id={`${anchorId}-preview`} tabIndex={-1} className="spoorthi-project-preview" aria-labelledby={`${anchorId}-preview-title`}>
        <header className="spoorthi-project-preview__copy">
          <span className="spoorthi-project-preview__number type-label" aria-hidden="true">{String(number).padStart(2, '0')}</span>
          <p className="type-label">{category}</p>
          <h3 id={`${anchorId}-preview-title`} tabIndex={-1} className="type-h3">{project.title}</h3>
          <p className="type-body">{cleanText(project.summary) ?? description}</p>
        </header>
        <div className="spoorthi-project-preview__visual">
          {hasCover ? <ProjectImage src={project.coverImage} settings={presentation.cover} /> : project.isDemo ? <DemoVisual variant={project.visualVariant ?? 'planes'} /> : <p className="type-body">Project imagery is not available.</p>}
        </div>
        <div className="spoorthi-project-preview__actions">
          <p className="spoorthi-project-preview__metadata">{project.isDemo ? 'Demo / Not a real project' : cleanText(project.projectType)}</p>
          {(location || year) && <p className="type-body-small">{[location, year].filter(Boolean).join(' · ')}</p>}
          <TextLink variant="arrow" to={`/spoorthi/projects/${encodeURIComponent(project.id)}`} aria-label={`View project: ${project.title}`}>View Project</TextLink>
        </div>
      </article>
    )
  }

  return (
    <article id={anchorId} tabIndex={-1} aria-labelledby={`${anchorId}-title`} className={`spoorthi-project-entry${hasCover ? ' spoorthi-project-entry--with-image' : ''}`}>
      <header className="spoorthi-project-entry__heading">
        {project.isDemo === true ? <p className="type-label">Temporary demo — not a real project</p> : project.featured === true && <p className="type-label">Featured project</p>}
        <h3 id={`${anchorId}-title`} className="type-h2">{project.title}</h3>
      </header>
      <div className="spoorthi-project-entry__body">
        {hasCover && <ProjectImage src={project.coverImage} settings={presentation.cover} />}
        {(category || location || year || description) && (
          <div className="spoorthi-project-entry__information">
            {(category || location || year) && (
              <dl>
                {category && <div><dt>Category</dt><dd>{category}</dd></div>}
                {location && <div><dt>Location</dt><dd>{location}</dd></div>}
                {year && <div><dt>Year</dt><dd>{year}</dd></div>}
              </dl>
            )}
            {description && <p className="type-body">{description}</p>}
          </div>
        )}
      </div>
      {usableGallery.length > 0 && <div className="spoorthi-project-entry__gallery">{usableGallery.map(({ src, settings }, index) => <ProjectImage key={`${src}-${index}`} src={src} settings={settings} />)}</div>}
      <TextLink variant="arrow" href={`#${anchorId}-preview`} onClick={() => document.getElementById(`${anchorId}-preview`)?.focus({ preventScroll: true })}>Back to preview</TextLink>
    </article>
  )
}

export default SpoorthiProjectEntry
