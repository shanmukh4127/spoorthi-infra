import { createService } from '../shared/index.js'
import { routePaths } from '../routePaths.js'

export const tejesServices = Object.freeze([
  createService({ id: 'interior-design', label: 'Interior Design', route: routePaths.tejes.interiorDesign }),
  createService({ id: 'spatial-design', label: 'Spatial Design' }),
  createService({ id: '2d-design', label: '2D Design' }),
  createService({ id: '3d-design', label: '3D Design', route: routePaths.tejes.design3d }),
  createService({ id: 'material-finish-selection', label: 'Material / Finish Selection' }),
  createService({ id: 'final-execution', label: 'Final Execution' }),
  createService({ id: 'vr-experience', label: 'VR Experience', route: routePaths.tejes.vr }),
])
