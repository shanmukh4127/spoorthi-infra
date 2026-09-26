import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/brandThemes.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/media.css'
import './styles/motion.css'
import './styles/typography.css'
import './styles/ui.css'
import './styles/architecture.css'
import './styles/hero.css'
import './styles/about.css'
import './styles/services.css'
import './styles/two-d.css'
import './styles/three-d.css'
import './styles/final-output.css'
import './styles/vr-experience.css'
import './styles/projects.css'
import './styles/process.css'
import './styles/why-choose-us.css'
import './styles/cta-footer.css'
import './styles/responsive-pass.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
