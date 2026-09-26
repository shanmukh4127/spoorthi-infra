import { useLocation } from 'react-router-dom'
import { getRouteMetadata } from '../../data/routeMetadata.js'
import RoutePlaceholder from '../../components/common/RoutePlaceholder.jsx'

function BrandRoutePage() {
  const { pathname } = useLocation()
  const metadata = getRouteMetadata(pathname)
  return <RoutePlaceholder title={metadata.title} description={metadata.description} />
}

export default BrandRoutePage
