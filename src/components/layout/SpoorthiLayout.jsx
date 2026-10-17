import BrandLayout from './BrandLayout.jsx'
import { useLocation } from 'react-router-dom'
import SpoorthiCinematicHeader from '../spoorthi/SpoorthiCinematicHeader.jsx'
import { routePaths } from '../../data/routePaths.js'

function SpoorthiLayout({ children }) {
  const { pathname } = useLocation()
  const home = pathname.replace(/\/$/, '') === routePaths.spoorthi.home
  return <BrandLayout brandId="spoorthi" header={home ? <SpoorthiCinematicHeader /> : undefined}>{children}</BrandLayout>
}

export default SpoorthiLayout
