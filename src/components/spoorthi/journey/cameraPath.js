import { CatmullRomCurve3, CubicBezierCurve3, PerspectiveCamera, Vector3 } from 'three'

// The first curve is deliberately unchanged: extending its control-point list
// would alter the final original segment. Chapters 13–20 use a joined curve.
export const journeyWaypoints = [
  [38, 14, 64], [30, 7, 52], [24, 4, 44], [22, 3.5, 35],
  [17, 3, 25], [12, 2.8, 18], [10, 3.2, 12], [5, 2.5, 8],
  [2.5, 2, 5.5], [.8, 2, -3], [-3, 2.2, -6.5], [-10, 3.2, -15],
  [-18, 5, -23], [-20, 9, -34], [-20, 13, -46], [-20, 16, -57],
  [-28, 12, -65], [-39, 8, -66], [-52, 6, -59], [-61, 5, -47],
  [-63, 4, -32], [-61, 5, -18], [-53, 7, -8], [-39, 9, 0], [-24, 11, 2],
]
const position = new CatmullRomCurve3(journeyWaypoints.map(point => new Vector3(...point)), false, 'centripetal')
const targets = [
  [-4, 2, 8], [-2, 1, 22], [3, -.4, 32], [4, -.5, 31],
  [2, .5, 17], [0, 1.8, 8], [-2, 2, -1], [-4, 2, -4],
  [-4, 2, -4], [-6, 2, -7], [-8.8, 1.8, -6.5], [-10, 5, -30],
  [-4, 8, -44], [-1, 10, -46], [-1, 14, -46], [-5, 14, -48],
  [-30, 7, -49], [-35, 5, -48], [-39, 5, -45], [-38, 5, -35],
  [-38, 4, -27], [-39, 5, -30], [-43, 5, -34], [-46, 5, -34], [-47, 5, -33],
].map(point => new Vector3(...point))
const fieldsOfView = [46, 46, 47, 48, 46, 45, 48, 49, 50, 48, 44, 46, 46, 45, 45, 46, 47, 45, 44, 45, 46, 46, 46, 45, 44]
const referenceCamera = new PerspectiveCamera()
const orientations = position.points.map((point, index) => {
  referenceCamera.position.copy(point)
  referenceCamera.lookAt(targets[index])
  return referenceCamera.quaternion.clone()
})

export const appendedWaypoints = [
  [-24, 11, 2], [19, 9, 22], [29, 5, 27],
  [32, 13, 27], [45, 17, 20], [66, 11, 22], [88, 7, 16],
  [99, 6, 7], [100, 5, -8], [100, 5, -26], [92, 6, -39],
  [78, 5, -47], [64, 4, -49], [48, 6, -49], [35, 9, -42],
  [18, 13, -28], [20, 12, 8],
]
const continuation = new CatmullRomCurve3(appendedWaypoints.map(point => new Vector3(...point)), false, 'centripetal')
// Match the velocity leaving the preserved route, then accelerate across the
// site to the utilities view. The join has neither a direction nor speed jump.
const epsilon = 1e-6
const originalExit = position.getPoint(1).sub(position.getPoint(1 - epsilon)).multiplyScalar(1 / (epsilon * 24))
const continuationArrival = continuation.getPoint(1 / 16 + epsilon).sub(continuation.getPoint(1 / 16 - epsilon)).multiplyScalar(1 / (2 * epsilon * 16))
const firstLink = new CubicBezierCurve3(
  continuation.points[0], continuation.points[0].clone().addScaledVector(originalExit, 1 / 3),
  continuation.points[1].clone().addScaledVector(continuationArrival, -1 / 3), continuation.points[1],
)
const continuationTargets = [
  [-47, 5, -33], [35, -.3, 20], [39, -.3, 20],
  [52, 8, 7], [53, 9, 5], [79, 4, 3], [84, 4, 2],
  [85, 5, -11], [85, 5, -14], [85, 2, -31], [83, 2, -32],
  [65, 3, -35], [62, 3, -35], [49, 6, -25], [49, 6, -25],
  [49, 6, -24], [49, 6, -25],
].map(point => new Vector3(...point))
const continuationFov = [44, 46, 47, 46, 44, 45, 44, 45, 44, 46, 45, 44, 43, 44, 43, 44, 43]
const continuationOrientations = continuation.points.map((point, index) => {
  referenceCamera.position.copy(point)
  referenceCamera.lookAt(continuationTargets[index])
  return referenceCamera.quaternion.clone()
})

export const originalJourneyEnd = 12 / 20

export function applyJourneyCamera(camera, progress) {
  const overall = Math.max(0, Math.min(1, progress))
  const original = overall <= originalJourneyEnd
  const t = original ? overall / originalJourneyEnd : (overall - originalJourneyEnd) / (1 - originalJourneyEnd)
  const curve = original ? position : continuation
  const rotations = original ? orientations : continuationOrientations
  const fovs = original ? fieldsOfView : continuationFov
  if (!original && t < 1 / 16) firstLink.getPoint(t * 16, camera.position)
  else curve.getPoint(t, camera.position)
  const segmentCount = curve.points.length - 1
  const segment = Math.min(segmentCount - 1, Math.floor(t * segmentCount))
  const local = t * segmentCount - segment
  const ease = local * local * (3 - 2 * local)
  camera.quaternion.slerpQuaternions(rotations[segment], rotations[segment + 1], ease)
  // Portrait framing preserves the same reversible route.
  camera.fov = fovs[segment] + (fovs[segment + 1] - fovs[segment]) * ease + (camera.aspect < 1 ? 22 : 0)
  camera.updateProjectionMatrix()
}
