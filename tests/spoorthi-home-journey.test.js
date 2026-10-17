import assert from 'node:assert/strict'
import test from 'node:test'
import { PerspectiveCamera } from 'three'
import { applyJourneyCamera } from '../src/components/spoorthi/journey/cameraPath.js'
import { constructionLayout as site } from '../src/components/spoorthi/journey/constructionLayout.js'

const pose = camera => [...camera.position.toArray(), ...camera.quaternion.toArray(), camera.fov, ...camera.projectionMatrix.elements]

test('scroll reversal and arbitrary seeks restore the complete camera pose exactly', () => {
  const camera = new PerspectiveCamera(43, 16 / 9, .1, 230)
  const samples = Array.from({ length: 101 }, (_, index) => index / 100)
  const forward = samples.map(progress => { applyJourneyCamera(camera, progress); return pose(camera) })
  for (let index = samples.length - 1; index >= 0; index--) {
    applyJourneyCamera(camera, samples[index])
    assert.deepEqual(pose(camera), forward[index])
  }
  for (const index of [87, 12, 64, 99, 0, 43, 0]) {
    applyJourneyCamera(camera, samples[index])
    assert.deepEqual(pose(camera), forward[index])
  }
  assert.deepEqual(camera.position.toArray(), [30, 12, 31])
})

test('the whole path stays above the floor, finite, continuous and free of sudden turns', () => {
  const camera = new PerspectiveCamera()
  let previous
  for (let index = 0; index <= 2000; index++) {
    applyJourneyCamera(camera, index / 2000)
    assert.ok(pose(camera).every(Number.isFinite))
    assert.ok(camera.position.y > 1.8)
    assert.ok(camera.fov >= 43 && camera.fov <= 50)
    if (previous) {
      assert.ok(camera.position.distanceTo(previous.position) < .06)
      assert.ok(camera.quaternion.angleTo(previous.quaternion) < .012)
    }
    previous = { position: camera.position.clone(), quaternion: camera.quaternion.clone() }
  }
})

test('browser overscroll clamps to opening and closing poses', () => {
  const camera = new PerspectiveCamera()
  applyJourneyCamera(camera, 0); const opening = pose(camera)
  applyJourneyCamera(camera, -.25); assert.deepEqual(pose(camera), opening)
  applyJourneyCamera(camera, 1); const closing = pose(camera)
  applyJourneyCamera(camera, 1.25); assert.deepEqual(pose(camera), closing)
})

test('the camera clears the actual construction columns, front reinforcement and slabs', () => {
  const camera = new PerspectiveCamera()
  const clearance = .12
  for (let index = 0; index <= 4000; index++) {
    applyJourneyCamera(camera, index / 4000)
    const { x, y, z } = camera.position
    for (const columnX of site.columnsX) for (const rowZ of [...site.structuralRowsZ, 9]) {
      const top = rowZ === 9 ? site.frontCageTop(columnX) : 8.5
      if (y > top + clearance) continue
      const radius = site.columnWidth / 2 + clearance
      assert.ok(Math.abs(x - columnX) > radius || Math.abs(z - rowZ) > radius, `Column collision at progress ${index / 4000}`)
    }
    if (Math.abs(x) < site.slabSize[0] / 2 + clearance && Math.abs(z - site.slabCenterZ) < site.slabSize[2] / 2 + clearance) {
      for (const floor of site.floorsY) assert.ok(Math.abs(y - floor) > site.slabSize[1] / 2 + clearance)
    }
  }
})
