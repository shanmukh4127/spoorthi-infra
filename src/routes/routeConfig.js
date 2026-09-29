import CivilConstructionPage from '../pages/spoorthi/CivilConstructionPage.jsx'
import SpoorthiContactPage from '../pages/spoorthi/ContactPage.jsx'
import SpoorthiDesign3DPage from '../pages/spoorthi/Design3DPage.jsx'
import SpoorthiHomePage from '../pages/spoorthi/SpoorthiHomePage.jsx'
import SpoorthiProjectsPage from '../pages/spoorthi/ProjectsPage.jsx'
import SpoorthiProjectDetailPage from '../pages/spoorthi/ProjectDetailPage.jsx'
import SpoorthiVrPage from '../pages/spoorthi/VrPage.jsx'
import TejesContactPage from '../pages/tejes/ContactPage.jsx'
import TejesDesign3DPage from '../pages/tejes/Design3DPage.jsx'
import TejesHomePage from '../pages/tejes/TejesHomePage.jsx'
import TejesInteriorDesignPage from '../pages/tejes/InteriorDesignPage.jsx'
import TejesProjectsPage from '../pages/tejes/ProjectsPage.jsx'
import TejesVrPage from '../pages/tejes/VrPage.jsx'
import { routeMetadata } from '../data/routeMetadata.js'
import { routePaths } from '../data/routePaths.js'

function withMetadata(path, component) {
  return { path, component, metadata: routeMetadata[path] }
}

export const brandRouteConfig = Object.freeze({
  spoorthi: Object.freeze({
    home: withMetadata(routePaths.spoorthi.home, SpoorthiHomePage),
    sections: Object.freeze([
      withMetadata(routePaths.spoorthi.civilConstruction, CivilConstructionPage),
      withMetadata(routePaths.spoorthi.projects, SpoorthiProjectsPage),
      withMetadata(routePaths.spoorthi.projectDetail(), SpoorthiProjectDetailPage),
      withMetadata(routePaths.spoorthi.design3d, SpoorthiDesign3DPage),
      withMetadata(routePaths.spoorthi.vr, SpoorthiVrPage),
      withMetadata(routePaths.spoorthi.contact, SpoorthiContactPage),
    ]),
  }),
  tejes: Object.freeze({
    home: withMetadata(routePaths.tejes.home, TejesHomePage),
    sections: Object.freeze([
      withMetadata(routePaths.tejes.interiorDesign, TejesInteriorDesignPage),
      withMetadata(routePaths.tejes.projects, TejesProjectsPage),
      withMetadata(routePaths.tejes.design3d, TejesDesign3DPage),
      withMetadata(routePaths.tejes.vr, TejesVrPage),
      withMetadata(routePaths.tejes.contact, TejesContactPage),
    ]),
  }),
})
