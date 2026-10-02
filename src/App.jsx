import { useRoutes } from 'react-router-dom'
import RouteMetadata from './components/routing/RouteMetadata.jsx'
import RouteFocusManager from './components/routing/RouteFocusManager.jsx'
import PageTransition from './components/routing/PageTransition.jsx'
import { appRoutes } from './routes/appRoutes.jsx'

function App() {
  return <RouteMetadata><RouteFocusManager /><PageTransition>{useRoutes(appRoutes)}</PageTransition></RouteMetadata>
}

export default App
