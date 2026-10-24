import { useLocation } from 'react-router-dom'
import BrandLayout from './BrandLayout.jsx'
import TejesHomeMenu from '../tejes/TejesHomeMenu.jsx'

export default function TejesLayout({ children }) {
  const { pathname } = useLocation()
  return <BrandLayout brandId="tejes" header={<TejesHomeMenu key={pathname} />}>{children}</BrandLayout>
}
