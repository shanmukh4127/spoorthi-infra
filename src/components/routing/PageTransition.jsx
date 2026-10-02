import { useLocation } from 'react-router-dom'

function PageTransition({ children }) {
  const { pathname } = useLocation()
  return <div key={pathname} className="page-transition">{children}</div>
}

export default PageTransition
