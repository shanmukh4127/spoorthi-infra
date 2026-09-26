import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMetadata } from '../../data/routeMetadata.js'

function RouteMetadata({ children }) {
  const { pathname } = useLocation()
  const metadata = getRouteMetadata(pathname)

  useEffect(() => {
    document.title = metadata.title
    const description = document.head.querySelector('meta[name="description"]')
    if (description && metadata.description) description.setAttribute('content', metadata.description)
  }, [metadata])

  return children
}

export default RouteMetadata
