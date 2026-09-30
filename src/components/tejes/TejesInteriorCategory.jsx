import TextLink from '../common/TextLink.jsx'
import TejesMediaPlaceholder from './TejesMediaPlaceholder.jsx'

function TejesInteriorCategory({ category, number, href }) {
  const [, title, description] = category
  return <li className="tejes-interior-category">
    <TejesMediaPlaceholder label={`${title} image`} aspect="landscape" />
    <div className="tejes-interior-category__body">
      <p className="tejes-label">{String(number).padStart(2, '0')}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <TextLink to={href} variant="arrow">Explore interior</TextLink>
    </div>
  </li>
}

export default TejesInteriorCategory
