import { SphereGeometry, PlaneGeometry, LatheGeometry, TorusGeometry, Vector2 } from 'three'

// Additional work areas in the existing metre-scale world. Everything shares
// the renderer, scanned assets, physical materials and spatial instance batches.
export function extendConstruction({ box, rod, cage, batchModel, shape, own, assets, materials: m, compact }) {
  const { concrete, cutConcrete, soil, steel, rebar, formwork, timber, asphalt, amber, orange, white, glazing, facadeMetal, facadeStone, paving, joint, rubber, leaf, bark } = m

  // Entrance: a real opening between barrier runs, a graded haul road, gate
  // posts and a working excavation. The soil itself is cut out in the owner.
  box([13, .025, 55], [24, -.18, 36], asphalt, 0, false)
  batchModel(assets.barrier, [-15, -10, -5, 0, 5, 12, 36, 41].map(x => ({ at: [x, -.2, 51] })))
  for (const x of [17, 31]) {
    box([.28, 3.6, .28], [x, 1.6, 51], steel)
    box([.32, .22, .32], [x, 3.45, 51], amber)
  }
  batchModel(assets.excavator, [{ at: [-8, -.2, 44], angle: 1.1 }])
  box([18, .09, 17], [7, -1.6, 33], cutConcrete)
  for (const x of [0, 6, 12]) for (const z of [27, 33, 39]) {
    box([2.8, .4, 2.8], [x, -1.35, z], concrete)
    box([.9, .7, .9], [x, -.8, z], cutConcrete)
    cage(x, z, -.5, 1.25)
    for (let offset = -1; offset <= 1; offset += .35) {
      rod([x - 1.2, -1.1, z + offset], [x + 1.2, -1.1, z + offset], .013, rebar)
      rod([x + offset, -1.08, z - 1.2], [x + offset, -1.08, z + 1.2], .013, rebar)
    }
  }
  // Open trench shoring, walers and safety rails remain legible at close range.
  for (let z = 24; z < 43; z += .65) box([.12, 1.65, .22], [-2.85, -.9, z], formwork)
  for (const y of [-1.1, -.35]) rod([-2.65, y, 23.5], [-2.65, y, 42.5], .065, steel)
  for (let z = 23; z <= 43; z += 2.5) rod([17.5, -.2, z], [17.5, 1.1, z], .035, orange)
  for (const y of [.45, 1]) rod([17.5, y, 23], [17.5, y, 43], .025, orange)
  const mound = own(new SphereGeometry(1, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2))
  const vertices = mound.attributes.position
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i); const y = vertices.getY(i); const z = vertices.getZ(i)
    const variation = 1 + Math.sin(x * 12 + z * 7) * .12 + Math.cos(z * 17) * .07
    vertices.setXYZ(i, x * variation, Math.max(0, y * variation), z * variation)
  }
  mound.computeVertexNormals()
  for (let i = 0; i < 5; i++) shape(mound, [2.4 + i * .18, 1.25 + i * .1, 2], [-7 - i * 2.2, -.2, 36 + Math.sin(i) * 2], soil)

  // A reinforcement assembly station beside the first concrete frame.
  for (const x of [-9, -4]) {
    for (const z of [15.5, 18]) {
      box([.12, .9, .12], [x, .25, z], steel)
      rod([x - .6, -.2, z], [x + .6, -.2, z], .05, steel)
    }
    box([2.4, .12, 4], [x, .75, 16.8], formwork)
    for (let dx = -.9; dx <= .9; dx += .22) rod([x + dx, .85, 15], [x + dx, .85, 18.5], .018, rebar)
    for (let z = 15; z <= 18.5; z += .3) rod([x - .9, .88, z], [x + .9, .88, z], .012, rebar)
  }
  for (const x of [-13, -12.3, -11.6]) for (let y = 0; y < .55; y += .18) rod([x, y, 23], [x, y, 29], .07, steel)
  for (const x of [3, 6]) {
    box([2.4, 3.2, .14], [x, 1.4, 11.7], formwork)
    for (const y of [.2, 1.2, 2.4]) box([2.5, .12, .16], [x, y, 11.83], steel)
    rod([x, .1, 14.5], [x, 2.3, 11.9], .055, steel)
  }

  // Towable site mixer: tapered spun-steel drum, open mouth, tubular chassis,
  // rubber tyres, axle, ring gear, tipping handwheel and guarded motor.
  const drum = own(new LatheGeometry([[.38, 0], [.57, .16], [.65, .55], [.5, 1.1], [.31, 1.36], [.28, 1.36], [.28, 1.28], [.45, 1.02]].map(p => new Vector2(...p)), compact ? 20 : 32))
  const tyre = own(new TorusGeometry(.3, .095, 8, 20))
  const wheel = own(new TorusGeometry(.32, .025, 6, 24))
  shape(drum, [1, 1, 1], [9.5, 1, 4.4], amber, [.55, 0, .25])
  for (const x of [8.9, 10.1]) {
    shape(tyre, [1, 1, 1], [x, .22, 4.9], rubber, [0, Math.PI / 2, 0])
    rod([x, .25, 4.9], [9.5, 1.3, 4.4], .045, steel)
  }
  rod([8.9, .22, 4.9], [10.1, .22, 4.9], .06, steel)
  rod([9.5, .4, 4.9], [9.5, .05, 3.2], .06, steel)
  box([.55, .45, .65], [9.5, .8, 5.25], facadeMetal)
  shape(wheel, [1, 1, 1], [10.28, 1.22, 4.6], steel, [0, Math.PI / 2, 0])
  for (const z of [4.6, 4.85, 5.1]) rod([9.18, 1.05, z], [9.82, 1.05, z], .014, steel)
  for (const x of [-6, 0, 6]) for (const z of [-7, -1]) {
    rod([x + 1, .1, z], [x + 1, 3.95, z], .04, steel)
    box([.35, .08, .35], [x + 1, .02, z], steel)
    box([.15, .14, .28], [x + 1, 3.95, z], amber)
  }

  // Separate six-level building: a core, open lower levels, infill progressing
  // upward, deck shoring and exposed roof cages. Never a repeated empty bay.
  const highX = [-10, -4, 2, 8]
  const highZ = [-53, -47, -41]
  box([23, .35, 18], [-1, -.05, -47], concrete)
  box([5.5, 22, 5.5], [5, 10.8, -50], cutConcrete)
  for (let floor = 0; floor < 6; floor++) {
    const bottom = floor * 3.65
    const top = bottom + 3.65
    for (const x of highX) for (const z of highZ) box([.65, 3.4, .65], [x, bottom + 1.65, z], concrete)
    box([21.5, .25, 16], [-1, top, -47], floor === 5 ? cutConcrete : concrete)
    for (const z of highZ) box([21, .46, .45], [-1, top - .28, z], concrete)
    for (let z = -54; z <= -40; z += 2.8) {
      rod([-11.7, top + .15, z], [-11.7, top + 1.2, z], .025, orange)
    }
    for (const y of [.65, 1.15]) rod([-11.7, top + y, -54], [-11.7, top + y, -40], .023, orange)
    if (floor < 3) for (const z of [-53, -41]) for (const x of [-7, -1]) {
      box([3.9, 1.1, .2], [x, bottom + .6, z], facadeStone)
      box([.6, 2.25, .2], [x - 1.65, bottom + 2.2, z], facadeStone)
    }
    if (floor === 4) for (const x of [-8, -2, 4]) for (const z of [-44, -49]) rod([x, bottom + .2, z], [x, top - .2, z], .035, steel)
  }
  for (const x of highX) cage(x, -53, 22, 23.6)
  for (let z = -53; z <= -43; z += .55) rod([-10, 22.07, z], [2, 22.07, z], .016, rebar)
  for (let x = -10; x <= 2; x += .55) rod([x, 22.1, -53], [x, 22.1, -43], .016, rebar)
  batchModel(assets.crane, [{ at: [16, -.2, -47], angle: -.7 }])
  batchModel(assets.generator, [{ at: [-13, -.2, -35], angle: .6 }])

  // Facade work area. A partly clad building lets visitors see installed stone,
  // empty mullions, glass, palletised panels and scaffold in a single view.
  box([18, .28, 12], [-35, -.05, -51], concrete)
  box([17.6, 11.5, .3], [-35, 5.7, -45.2], concrete)
  for (const y of [3.8, 7.6, 11.4]) box([18, .28, 12], [-35, y, -51], concrete)
  for (const x of [-43, -37.5, -32, -26.5]) box([.55, 11.2, .55], [x, 5.6, -56.5], concrete)
  for (let x = -43; x < -26; x += 2.7) {
    box([.09, 11.4, .18], [x, 5.7, -57.1], facadeMetal)
    for (const y of [1.9, 5.7, 9.5]) {
      if (x < -35) box([2.55, 3.5, .08], [x + 1.35, y, -57.05], glazing)
      if (x > -32) box([2.55, 3.5, .24], [x + 1.35, y, -57.2], facadeStone)
      box([2.7, .12, .18], [x + 1.35, y + 1.8, -57.15], facadeMetal)
    }
  }
  for (const x of [-43, -40, -37, -34]) for (const z of [-59.6, -58.4]) {
    rod([x, -.2, z], [x, 12.5, z], .025, steel)
    for (const y of [2, 4, 6, 8, 10, 12]) rod([x, y, -59.6], [x, y, -58.4], .024, steel)
  }
  for (let x = -43; x < -34; x += 3) for (const y of [2, 4, 6, 8, 10, 12]) {
    box([3, .075, .9], [x + 1.5, y, -59], formwork)
    rod([x, y - 2, -59.6], [x + 3, y, -59.6], .022, steel)
    for (const offset of [.6, 1.1]) rod([x, y + offset, -59.6], [x + 3, y + offset, -59.6], .022, steel)
  }
  for (let i = 0; i < 5; i++) box([2.6, .12, 1.4], [-47, .12 + i * .14, -52], facadeStone)
  for (const z of [-54, -51]) {
    box([1.9, .15, 1.9], [-48, -.05, z], formwork)
    rod([-48.7, .05, z], [-48, 2.4, z], .04, steel)
    rod([-47.3, .05, z], [-48, 2.4, z], .04, steel)
    box([.06, 2.2, 1.6], [-48.15, 1.1, z], glazing, -.08)
  }

  // Finish the previously existing building on its west and rear elevations,
  // now visible because the extended path follows its entire perimeter.
  for (let z = -40; z < -24; z += 2.8) {
    box([.16, 12, .09], [-54.1, 6, z], facadeMetal)
    for (const y of [2.1, 6.1, 10.1]) box([.08, 3.6, 2.6], [-54.05, y, z + 1.35], glazing)
    for (const y of [4.1, 8.1, 12.1]) box([.17, .5, 2.8], [-54.12, y - .24, z + 1.35], facadeMetal)
  }
  for (let x = -53; x < -31; x += 2.4) {
    box([2.35, 11.7, .18], [x + 1.1, 5.9, -39.7], facadeStone)
    for (const y of [2, 6, 10]) box([1.8, 2.7, .06], [x + 1.1, y, -39.81], glazing)
  }

  // Quiet arrival garden: scored paths, raised beds, natural trunks and
  // deterministic foliage clusters. No time-based movement or random rebuilds.
  const foliage = own(new PlaneGeometry(1, 1))
  const crownCount = compact ? 24 : 42
  for (const [x, z] of [[-57, -39], [-57, -25], [-55, -18], [-48, -17], [-36, -17], [-28, -32]]) {
    box([2.3, .45, 2.3], [x, .02, z], facadeStone)
    box([2.05, .07, 2.05], [x, .28, z], soil)
    rod([x, .3, z], [x + .12, 3.8, z], .1, bark)
    for (let i = 0; i < crownCount; i++) {
      const angle = i * 2.39996
      const radius = .25 + (i % 7) * .17
      const end = [x + Math.cos(angle) * radius, 3.2 + (i % 9) * .19, z + Math.sin(angle) * radius]
      if (i % 3 === 0) rod([x, 2.5, z], end, .035, bark)
      shape(foliage, [1.35, 1.25, 1], end, leaf[i % leaf.length], [Math.sin(i) * .65, angle, Math.cos(i) * .3])
    }
  }
  box([5, .1, 30], [-58, -.18, -30], paving)
  for (let z = -44; z < -15; z += 1.5) box([5, .009, .015], [-58, -.122, z], joint, 0, false)
  for (const z of [-36, -29, -22]) {
    box([.15, .8, .15], [-60, .2, z], facadeMetal)
    box([.17, .08, .17], [-60, .56, z], white)
  }
  for (const z of [-36, -27]) {
    box([.65, .16, 2.2], [-55.6, .5, z], timber)
    for (const dz of [-.75, .75]) box([.5, .5, .14], [-55.6, .15, z + dz], facadeMetal)
  }
}
