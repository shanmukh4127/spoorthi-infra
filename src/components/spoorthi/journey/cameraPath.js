import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from 'three'

// Preserve every original waypoint through the construction bays. One added
// exit point clears the last column and opens the completed-building reveal.
const position = new CatmullRomCurve3([
  [30, 12, 31], [18, 5.2, 20], [10, 3.2, 12],
  [2.5, 2, 5.5], [.8, 2, -3], [-3, 2.2, -6.5], [-10, 3.2, -15],
].map(point => new Vector3(...point)), false, 'centripetal')
const targets = [
  [0, 1.5, 0], [0, 2, 1], [-2, 2, -1],
  [-4, 2, -4], [-8.8, 1.1, -6.5], [-42, 5.5, -32], [-42, 5.5, -32],
].map(point => new Vector3(...point))
const fieldsOfView = [43, 45, 48, 50, 43, 48, 46]
const referenceCamera = new PerspectiveCamera()
const orientations = position.points.map((point, index) => {
  referenceCamera.position.copy(point)
  referenceCamera.lookAt(targets[index])
  return referenceCamera.quaternion.clone()
})

export function applyJourneyCamera(camera, progress) {
  const t = Math.max(0, Math.min(1, progress))
  position.getPoint(t, camera.position)
  const segmentCount = position.points.length - 1
  const segment = Math.min(segmentCount - 1, Math.floor(t * segmentCount))
  const local = t * segmentCount - segment
  const ease = local * local * (3 - 2 * local)
  // Spherical interpolation avoids a rapid spin when a look-at target would
  // pass close to the moving camera during the final turn toward the garden.
  camera.quaternion.slerpQuaternions(orientations[segment], orientations[segment + 1], ease)
  camera.fov = fieldsOfView[segment] + (fieldsOfView[segment + 1] - fieldsOfView[segment]) * ease
  camera.updateProjectionMatrix()
}
