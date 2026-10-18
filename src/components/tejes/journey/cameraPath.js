import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from 'three'
import { interiorCameraStops } from '../../../data/tejes/cinematicJourney.js'
const route = new CatmullRomCurve3(interiorCameraStops.map(([p]) => new Vector3(...p)), false, 'centripetal')
const reference = new PerspectiveCamera()
const orientations = interiorCameraStops.map(([p, target]) => {
  reference.position.set(...p)
  reference.lookAt(new Vector3(...target))
  return reference.quaternion.clone()
})
// Native document scroll is the sole clock. No accumulated camera state.
export function applyInteriorCamera(camera, progress) {
  const t = Math.max(0, Math.min(1, progress))
  route.getPoint(t, camera.position)
  const segment = Math.min(10, Math.floor(t * 11))
  const local = t * 11 - segment
  camera.quaternion.slerpQuaternions(orientations[segment], orientations[segment + 1], local * local * (3 - 2 * local))
  camera.fov = camera.aspect < 1 ? 72 : 57
  camera.updateProjectionMatrix()
}
