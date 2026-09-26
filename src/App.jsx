import { useRoutes } from 'react-router-dom'
import RouteMetadata from './components/routing/RouteMetadata.jsx'
import RouteFocusManager from './components/routing/RouteFocusManager.jsx'
import { appRoutes } from './routes/appRoutes.jsx'

function App() {
  return <RouteMetadata><RouteFocusManager />{useRoutes(appRoutes)}</RouteMetadata>
}

export default App
