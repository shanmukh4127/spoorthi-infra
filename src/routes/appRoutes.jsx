import GatewayPage from '../pages/gateway/GatewayPage.jsx'
import NotFoundPage from '../pages/gateway/NotFoundPage.jsx'
import AdminPage from '../pages/spoorthi/AdminPage.jsx'
import { SpoorthiLayout, TejesLayout } from '../components/layout/index.js'
import { routeMetadata } from '../data/routeMetadata.js'
import { brandRouteConfig } from './routeConfig.js'

function createBrandRoutes({ home, sections }) {
  return [
    { index: true, element: createPageElement(home), handle: home.metadata },
    ...sections.map(({ path, component: Page, metadata }) => ({
      path,
      element: createPageElement({ component: Page }),
      handle: metadata,
    })),
  ]
}

function createPageElement({ component: Page }) {
  return <Page />
}

export const appRoutes = [
  { path: '/', element: <GatewayPage />, handle: routeMetadata['/'] },
  { path: 'admin', element: <AdminPage />, handle: routeMetadata['/admin'] },
  {
    path: 'spoorthi',
    element: <SpoorthiLayout />,
    children: createBrandRoutes(brandRouteConfig.spoorthi),
  },
  {
    path: 'tejes',
    element: <TejesLayout />,
    children: createBrandRoutes(brandRouteConfig.tejes),
  },
  { path: '*', element: <NotFoundPage /> },
]
