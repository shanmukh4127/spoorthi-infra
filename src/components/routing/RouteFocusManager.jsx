import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function RouteFocusManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    const main = document.getElementById('main-content') || document.querySelector('main')
    main?.focus()
  }, [pathname])

  return null
}

export default RouteFocusManager
