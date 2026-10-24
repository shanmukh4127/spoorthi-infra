import BrandLayout from './BrandLayout.jsx'
import { useLocation } from 'react-router-dom'
import SpoorthiCinematicHeader from '../spoorthi/SpoorthiCinematicHeader.jsx'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/spoorthi-warm-palette.css'

function SpoorthiLayout({ children }) {
  const { pathname } = useLocation()
  const home = pathname.replace(/\/$/, '') === routePaths.spoorthi.home
  return <BrandLayout brandId="spoorthi" header={<SpoorthiCinematicHeader key={pathname} inFlow={!home} />}>{children}</BrandLayout>
}

export default SpoorthiLayout
