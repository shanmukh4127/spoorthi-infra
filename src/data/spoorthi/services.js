import { createService } from '../shared/index.js'
import { routePaths } from '../routePaths.js'

export const spoorthiServices = Object.freeze([
  createService({ id: 'civil-construction', label: 'Civil Construction', route: routePaths.spoorthi.civilConstruction }),
  createService({ id: 'infrastructure', label: 'Infrastructure' }),
  createService({ id: 'design', label: 'Design' }),
  createService({ id: '2d-design', label: '2D Design' }),
  createService({ id: '3d-design', label: '3D Design', route: routePaths.spoorthi.design3d }),
  createService({ id: 'final-execution', label: 'Final Execution' }),
  createService({ id: 'vr-experience', label: 'VR Experience', route: routePaths.spoorthi.vr }),
])
