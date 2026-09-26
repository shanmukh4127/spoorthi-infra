import { useLocation } from 'react-router-dom'
import { PageShell } from '../../components/layout/index.js'
import { routePaths } from '../../data/routePaths.js'
import { PageContainer, SectionWrapper } from '../../components/layout/index.js'
import { NotFoundState } from '../../components/states/index.js'

function NotFoundPage() {
  const { pathname } = useLocation()
  const homePath = pathname.startsWith('/spoorthi')
    ? routePaths.spoorthi.home
    : pathname.startsWith('/tejes')
      ? routePaths.tejes.home
      : undefined
  const homeLabel = homePath ? 'Return to brand home' : undefined
  return <PageShell><SectionWrapper variant="hero"><PageContainer><NotFoundState homePath={homePath} homeLabel={homeLabel} /></PageContainer></SectionWrapper></PageShell>
}

export default NotFoundPage
