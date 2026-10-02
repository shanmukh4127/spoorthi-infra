import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function RouteFocusManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const main = document.getElementById('main-content') || document.querySelector('main')
    main?.focus({ preventScroll: true })
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      target?.scrollIntoView({ block: 'start' })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return null
}

export default RouteFocusManager
