import { routePaths } from './routePaths.js'

export const brandNavigation = Object.freeze({
  spoorthi: Object.freeze([
    { label: 'Home', path: routePaths.spoorthi.home, end: true },
    { label: 'Construction', path: routePaths.spoorthi.civilConstruction },
    { label: 'Projects', path: routePaths.spoorthi.projects },
    { label: 'Design & 3D', path: routePaths.spoorthi.design3d },
    { label: 'VR Experience', path: routePaths.spoorthi.vr },
    { label: 'Contact', path: routePaths.spoorthi.contact },
  ]),
  tejes: Object.freeze([
    { label: 'Home', path: routePaths.tejes.home, end: true },
    { label: 'Interior Design', path: routePaths.tejes.interiorDesign },
    { label: 'Projects', path: routePaths.tejes.projects },
    { label: 'Design / 3D', path: routePaths.tejes.design3d },
    { label: 'VR Experience', path: routePaths.tejes.vr },
    { label: 'Contact', path: routePaths.tejes.contact },
  ]),
})

export function getBrandNavigation(brandId) {
  return brandNavigation[brandId] ?? []
}
