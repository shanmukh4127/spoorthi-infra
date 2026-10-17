import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import { PerspectiveCamera } from 'three'
import { applyJourneyCamera, journeyWaypoints, originalJourneyEnd } from '../src/components/spoorthi/journey/cameraPath.js'
import { homeJourney } from '../src/data/spoorthi/homeJourney.js'
import { constructionLayout as site } from '../src/components/spoorthi/journey/constructionLayout.js'

const pose = camera => [...camera.position.toArray(), ...camera.quaternion.toArray(), camera.fov, ...camera.projectionMatrix.elements]
const original = JSON.parse(fs.readFileSync(new URL('./fixtures/original-twelve-chapter-journey.json', import.meta.url)))

test('the original twelve chapter texts and all sampled camera poses are preserved', () => {
  assert.deepEqual(homeJourney.stages.slice(0, 12), original.chapters)
  const camera = new PerspectiveCamera(43, 16 / 9, .1, 280)
  for (const sample of original.poses) {
    applyJourneyCamera(camera, sample.progress * originalJourneyEnd)
    const actual = [...camera.position.toArray(), ...camera.quaternion.toArray(), camera.fov]
    const expected = [...sample.position, ...sample.rotation, sample.fov]
    actual.forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < 1e-10))
  }
})

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
  assert.deepEqual(camera.position.toArray(), journeyWaypoints[0])
})

test('the whole path stays above the floor, finite, continuous and free of sudden turns', () => {
  const camera = new PerspectiveCamera()
  let previous
  for (let index = 0; index <= 16000; index++) {
    applyJourneyCamera(camera, index / 16000)
    assert.ok(pose(camera).every(Number.isFinite))
    assert.ok(camera.position.y > 1.8)
    assert.ok(camera.fov >= 43 && camera.fov <= 50)
    if (previous) {
      assert.ok(camera.position.distanceTo(previous.position) < .23)
      assert.ok(camera.quaternion.angleTo(previous.quaternion) < .045)
    }
    previous = { position: camera.position.clone(), quaternion: camera.quaternion.clone() }
  }
})

test('the chapter twelve continuation joins with matching position and velocity', () => {
  const camera = new PerspectiveCamera()
  const delta = 1e-7
  applyJourneyCamera(camera, originalJourneyEnd - delta); const before = camera.position.clone()
  applyJourneyCamera(camera, originalJourneyEnd); const join = camera.position.clone()
  applyJourneyCamera(camera, originalJourneyEnd + delta); const after = camera.position.clone()
  const entering = join.clone().sub(before)
  const leaving = after.sub(join)
  assert.ok(entering.angleTo(leaving) < .001)
  assert.ok(Math.abs(entering.length() / leaving.length() - 1) < .001)
})

test('exactly twenty meaningful chapters follow a substantial continuous site route', () => {
  assert.equal(homeJourney.stages.length, 20)
  assert.equal(new Set(homeJourney.stages.map(stage => stage.label)).size, 20)
  const camera = new PerspectiveCamera(43, 16 / 9)
  let length = 0
  applyJourneyCamera(camera, 0)
  let previous = camera.position.clone()
  for (let index = 1; index <= 2400; index++) {
    applyJourneyCamera(camera, index / 2400)
    length += previous.distanceTo(camera.position)
    previous.copy(camera.position)
  }
  assert.ok(length > 500, `Expected over 500m of site, received ${length}`)
  for (const stage of homeJourney.stages) assert.ok(stage.title.includes(stage.emphasis))
})

test('portrait camera retains its route and reverses the exact same framing', () => {
  const desktop = new PerspectiveCamera(43, 16 / 9)
  const mobile = new PerspectiveCamera(43, 390 / 844)
  for (const progress of [0, .1, .25, .5, .7, .9, 1]) {
    applyJourneyCamera(desktop, progress)
    applyJourneyCamera(mobile, progress)
    assert.deepEqual(mobile.position.toArray(), desktop.position.toArray())
    assert.deepEqual(mobile.quaternion.toArray(), desktop.quaternion.toArray())
    assert.equal(mobile.fov, desktop.fov + 22)
    const forward = pose(mobile)
    applyJourneyCamera(mobile, 1 - progress)
    applyJourneyCamera(mobile, progress)
    assert.deepEqual(pose(mobile), forward)
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

test('the extended route clears the upper floors, facade scaffold and completed building', () => {
  const camera = new PerspectiveCamera()
  // Exterior envelopes with a clearance margin, using the model coordinates.
  const envelopes = [
    { x: [-12, 10], y: [-.3, 24], z: [-55.5, -38.5], name: 'six-level frame' },
    { x: [-44.3, -25.7], y: [-.3, 13.5], z: [-60, -44.7], name: 'facade work and scaffold' },
    { x: [-54.6, -29.4], y: [-.3, 13], z: [-41.3, -22.5], name: 'completed building' },
    { x: [44.7, 63.3], y: [-.3, 10.7], z: [-.3, 12.3], name: 'roof pavilion' },
    { x: [74.7, 91.3], y: [-.3, 8.5], z: [-2.3, 12.7], name: 'masonry frame and platform' },
    { x: [79.7, 92.4], y: [-.3, 12.4], z: [-19.3, -5.7], name: 'glazing wing' },
    { x: [78, 92.5], y: [-.3, 4.6], z: [-38, -24.7], name: 'MEP plant' },
    { x: [55.7, 72.3], y: [-.3, 7.8], z: [-41.5, -39.7], name: 'material facade study' },
    { x: [35.5, 59.5], y: [-.3, 15.3], z: [-35, -12.6], name: 'final courtyard building' },
  ]
  for (let index = 0; index <= 8000; index++) {
    applyJourneyCamera(camera, index / 8000)
    for (const envelope of envelopes) {
      const inside = ['x', 'y', 'z'].every(axis => camera.position[axis] >= envelope[axis][0] && camera.position[axis] <= envelope[axis][1])
      assert.ok(!inside, `${envelope.name} collision at ${index / 8000}`)
    }
  }
})
