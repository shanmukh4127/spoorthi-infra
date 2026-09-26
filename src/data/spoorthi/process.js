import { createProcessStep } from '../shared/index.js'

export const spoorthiProcess = Object.freeze([
  createProcessStep({ number: 1, id: '2d-design', title: '2D Design' }),
  createProcessStep({ number: 2, id: '3d-design', title: '3D Design' }),
  createProcessStep({ number: 3, id: 'final-output', title: 'Final Output' }),
  createProcessStep({ number: 4, id: 'vr-experience', title: 'VR Experience' }),
])
