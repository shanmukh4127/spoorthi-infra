import { CylinderGeometry, PlaneGeometry, TorusGeometry } from 'three'

// Eight new work areas beyond the original tour. Locally built geometry shares
// the existing PBR textures and licensed models; all dimensions are in metres.
export function addFinalConstructionStages({ box, rod, shape, batchModel, own, assets, materials: m, compact }) {
  const { concrete, cutConcrete, steel, formwork, timber, amber, orange, white, glazing, deepGlazing, facadeStone, facadeMetal, paving, joint, soil, brick, servicePipe, rubber, leaf, bark } = m
  const cylinder = own(new CylinderGeometry(1, 1, 1, compact ? 16 : 28))
  const ring = own(new TorusGeometry(1, .055, 6, compact ? 16 : 24))

  // 13 / A genuinely open utilities trench, cut into the existing ground.
  box([21, .12, 6], [45.5, -1.6, 20], concrete)
  for (const z of [17.15, 22.85]) box([21, 1.35, .18], [45.5, -.9, z], cutConcrete)
  for (const z of [18.1, 19.2, 20.3]) {
    rod([35.4, -1.08, z], [55.5, -1.08, z], z === 18.1 ? .23 : .11, z === 18.1 ? concrete : servicePipe)
    for (let x = 36; x <= 55; x += 2.4) shape(ring, [z === 18.1 ? .24 : .12, z === 18.1 ? .24 : .12, 1], [x, -1.08, z], steel, [0, Math.PI / 2, 0])
  }
  for (const x of [38, 50]) {
    for (const z of [20.9, 22.3]) box([1.6, 1.25, .15], [x, -.9, z], concrete)
    for (const dx of [-.73, .73]) box([.15, 1.25, 1.4], [x + dx, -.9, 21.6], concrete)
    box([1.5, .1, 1.5], [x + 1.8, -.15, 24.5], steel)
    for (let z = 24; z <= 25; z += .15) box([1.25, .025, .04], [x + 1.8, -.085, z], joint)
  }
  for (let x = 35; x <= 56; x += 3) {
    rod([x, -.2, 23.6], [x, 1.05, 23.6], .03, orange)
    box([.25, .08, .25], [x, -.16, 23.6], concrete)
  }
  for (const y of [.5, 1]) rod([35, y, 23.6], [56, y, 23.6], .025, orange)
  for (let y = -1.4; y < 1; y += .3) rod([34.7, y, 19], [34.7, y, 19.65], .025, steel)
  for (const z of [19, 19.65]) rod([34.7, -1.5, z], [34.7, 1.1, z], .03, steel)

  // 14 / Steel roof pavilion: real triangulated trusses, bracing, purlins,
  // connection plates and a partial corrugated roof deck.
  box([20, .22, 15], [54, -.08, 6], concrete)
  for (const z of [0, 4, 8, 12]) {
    for (const x of [45, 63]) {
      box([.3, 8.5, .3], [x, 4.15, z], facadeMetal)
      box([.7, .1, .7], [x, .08, z], steel)
      for (const dx of [-.22, .22]) for (const dz of [-.22, .22]) rod([x + dx, .12, z + dz], [x + dx, .2, z + dz], .025, steel)
    }
    rod([45, 8.4, z], [63, 8.4, z], .1, steel)
    rod([45, 8.4, z], [54, 10.4, z], .1, steel)
    rod([54, 10.4, z], [63, 8.4, z], .1, steel)
    for (let x = 45; x < 63; x += 2.25) {
      const roofY = value => 10.4 - Math.abs(value - 54) / 4.5
      rod([x, 8.4, z], [x + 2.25, roofY(x + 2.25), z], .055, steel)
      rod([x + 2.25, 8.4, z], [x + 2.25, roofY(x + 2.25), z], .05, steel)
      box([.28, .3, .08], [x + 2.25, roofY(x + 2.25) - .05, z], facadeMetal)
    }
  }
  for (let x = 45; x <= 63; x += 1.5) rod([x, 10.4 - Math.abs(x - 54) / 4.5, 0], [x, 10.4 - Math.abs(x - 54) / 4.5, 12], .055, steel)
  for (let x = 54; x < 63; x += .22) box([.2, .06, 8.2], [x, 10.47 - (x - 54) / 4.5, 8], white)
  for (const z of [0, 12]) rod([45, .2, z], [45, 8.3, z === 0 ? 4 : 8], .055, steel)
  batchModel(assets.crane, [{ at: [67, -.2, -1], angle: 1.1 }])
  batchModel(assets.generator, [{ at: [40, -.2, 8], angle: .8 }])

  // 15 / Masonry progresses between a separate two-storey concrete frame.
  // Individual bonded courses leave genuine window openings and mortar joints.
  box([18, .25, 14], [83, -.05, 4], concrete)
  for (const y of [4.1, 8.2]) box([17, .25, 13], [83, y, 4], concrete)
  for (const x of [75, 83, 91]) for (const z of [-2, 10]) box([.5, 8, .5], [x, 4, z], concrete)
  for (let row = 0; row < 31; row++) {
    const y = .15 + row * .26
    for (let x = 75.4 + (row % 2) * .25; x < 90.7; x += .51) {
      const window = ((x > 78 && x < 81.1) || (x > 84 && x < 87.1)) && ((y > 1.2 && y < 3.45) || (y > 5.3 && y < 7.55))
      if (!window && !(y > 6.1 && x > 88)) box([.49, .24, .23], [x, y, 10], brick)
    }
    for (let z = -1.5 + (row % 2) * .25; z < 9.7; z += .51) if (y < 5.6 || z < 5) box([.23, .24, .49], [91, y, z], brick)
  }
  for (const x of [79.55, 85.55]) for (const y of [3.6, 7.7]) box([3.6, .2, .32], [x, y, 10], cutConcrete)
  for (let layer = 0; layer < 5; layer++) for (let i = 0; i < 5; i++) box([.49, .24, .23], [75 + i * .51, layer * .26, 13.8], brick)
  for (const x of [77, 80, 83, 86, 89]) {
    rod([x, -.2, 11.8], [x, 5.1, 11.8], .027, steel)
    rod([x, 2, 11], [x, 2, 12.5], .027, steel)
  }
  box([12.5, .08, .9], [83, 2, 12], formwork)
  const bags = []
  for (let layer = 0; layer < 3; layer++) for (let i = 0; i < 4; i++) bags.push({ at: [72.5 + i * .48, layer * .175, 8.2] })
  batchModel(assets.cement, bags)

  // 16 / Glazing installation: installed panes, open mullions, perimeter seals,
  // facade anchors, protective racks and a counterweighted lifting frame.
  box([13, .25, 14], [86, -.04, -12.5], concrete)
  box([.3, 12, 13], [80, 6, -12.5], cutConcrete)
  for (const y of [4, 8, 12]) box([12, .28, 13], [86, y, -12.5], concrete)
  for (let z = -19; z <= -6; z += 2.6) {
    box([.15, 12, .1], [92.1, 6, z], facadeMetal)
    for (const y of [2, 6, 10]) {
      if (z < -11 || y < 3) box([.07, 3.6, 2.45], [92.04, y, z + 1.28], glazing)
      box([.18, .1, 2.6], [92.13, y + 1.9, z + 1.3], facadeMetal)
      box([.22, .16, .18], [91.9, y + 1.7, z], steel)
    }
  }
  for (const z of [-4, -.5]) {
    box([2, .15, 2], [94, -.05, z], formwork)
    rod([93.2, .05, z], [94, 2.6, z], .045, steel)
    rod([94.8, .05, z], [94, 2.6, z], .045, steel)
    for (let i = 0; i < 3; i++) box([.055, 2.4, 1.8], [94.08 + i * .08, 1.25, z], glazing, -.05)
    for (const dz of [-.85, .85]) box([.5, .16, .15], [94, .13, z + dz], rubber)
  }
  rod([95, .1, -16], [95, 6.3, -16], .11, amber)
  rod([95, 6.3, -16], [92.8, 6.3, -16], .1, amber)
  rod([92.8, 6.3, -16], [92.8, 4.3, -16], .012, steel)
  box([1.6, .55, 1.7], [95, .2, -16], facadeMetal)
  box([.08, 1.6, 2.1], [92.8, 3.5, -16], glazing)

  // 17 / Service court: air-handling plant with intake louvres and fan guards,
  // plumbing risers, isolation wheels, cable ladder and electrical cabinets.
  box([16, .25, 15], [85, -.05, -31.5], paving)
  for (const z of [-35, -28]) {
    box([4.5, 2.5, 2.7], [84, 1.5, z], steel)
    for (const y of [.65, 1.3, 1.95]) box([4.45, .025, 2.72], [84, y, z], facadeMetal)
    for (let dz = -1.1; dz <= 1.1; dz += .14) box([.035, 1.8, .045], [86.28, 1.5, z + dz], facadeMetal)
    shape(ring, [.8, .8, .8], [86.32, 1.5, z], facadeMetal, [0, Math.PI / 2, 0])
    for (const angle of [0, Math.PI / 3, Math.PI * 2 / 3]) shape(ring, [.7, .12, .7], [86.34, 1.5, z], facadeMetal, [0, Math.PI / 2, angle])
    box([1.8, .85, 3.5], [81, 3.3, z], steel)
    box([1.8, 2, .85], [79, 2.8, z - 1.3], steel)
    for (const x of [82.3, 85.7]) for (const dz of [-.9, .9]) box([.5, .3, .45], [x, .12, z + dz], rubber)
  }
  for (const x of [88, 90]) {
    shape(cylinder, [.6, 3.3, .6], [x, 1.7, -37], steel)
    rod([x, 3.4, -37], [x, 4.3, -37], .085, servicePipe)
    rod([x, 4.3, -37], [x, 4.3, -26], .085, servicePipe)
    rod([x, 4.3, -26], [x, .3, -26], .085, servicePipe)
    shape(ring, [.22, .22, .22], [x + .1, 1.1, -26], orange, [0, Math.PI / 2, 0])
    for (const z of [-35, -31, -27]) box([.35, .18, .25], [x, 4.3, z], steel)
  }
  for (const x of [90.9, 91.6]) rod([x, 2.7, -37], [x, 2.7, -25], .035, steel)
  for (let z = -37; z <= -25; z += .35) rod([90.9, 2.7, z], [91.6, 2.7, z], .025, steel)
  for (const z of [-34, -31, -28]) {
    box([.7, 2.2, 1.7], [92, 1, z], facadeMetal)
    box([.04, .12, .3], [92.37, 1.3, z], amber)
    for (let y = .2; y < .7; y += .1) box([.04, .025, 1.2], [92.37, y, z], steel)
  }

  // 18 / A full-scale material junction study, distinct from the earlier
  // scaffold building: stone coursing, timber screen, sill, coping and flashing.
  box([18, .25, 13], [64, -.05, -35], concrete)
  box([16, 7.5, .5], [64, 3.7, -40.5], cutConcrete)
  for (let x = 56.4; x < 64; x += 1.25) for (let y = .6; y < 7.4; y += .82) box([1.22, .79, .12], [x, y, -40.82], facadeStone)
  box([4.1, 4.6, .2], [68, 3.8, -40.82], deepGlazing)
  for (let x = 66; x < 70.2; x += .3) box([.09, 6.9, .35], [x, 3.8, -41.1], timber)
  box([16.3, .08, .8], [64, 7.5, -40.6], facadeMetal)
  box([4.5, .12, .85], [68, 1.5, -40.85], facadeStone)
  for (let i = 0; i < 7; i++) box([2.6, .1, 1.3], [58, .1 + i * .11, -44], facadeStone)
  for (let x = 62; x < 65; x += .16) box([.12, .3, 3.5], [x, .1, -44], formwork)
  box([2.9, .1, 3.8], [63.5, -.1, -44], formwork)
  for (const z of [-33, -29]) box([2.2, 1, 1.2], [71, .3, z], white)

  // 19–20 / The final courtyard building. Its masonry volumes, deep-set glazing,
  // terraces and brise-soleil differ from the original completed curtain wall.
  box([35, .18, 31], [48, -.14, -24], paving)
  box([6, 12, 5], [49, 6, -26], facadeStone)
  for (const x of [38, 48, 58]) for (const z of [-33, -25, -17]) box([.5, 12, .5], [x, 6, z], cutConcrete)
  for (const bottom of [0, 4, 8]) {
    for (const z of [-33.85, -16.15]) {
      box([22, 1.05, .4], [48, bottom + .5, z], facadeStone)
      for (const x of [37.4, 44, 51, 58.6]) box([.7, 3.2, .4], [x, bottom + 2.4, z], facadeStone)
    }
    box([.4, 1.05, 18], [37.15, bottom + .5, -25], facadeStone)
    for (const z of [-33.5, -28, -22, -16.5]) box([.4, 3.2, .7], [37.15, bottom + 2.4, z], facadeStone)
  }
  box([.4, 12, 18], [58.85, 6, -25], facadeStone)
  for (const y of [4, 8, 12]) box([22.5, .28, 18.5], [48, y, -25], white)
  for (const z of [-31, -25, -19]) for (const y of [2, 6, 10]) {
    box([.09, 2.9, 4.65], [36.92, y, z], deepGlazing)
    box([.06, 2.7, 4.4], [36.86, y, z], glazing)
    for (const dz of [-2.3, 0, 2.3]) box([.12, 3, .06], [36.8, y, z + dz], facadeMetal)
    box([1.2, .14, 5], [36.4, y + 1.52, z], white)
  }
  for (const x of [40.5, 47.5, 54.5]) for (const y of [2, 6, 10]) {
    box([5.3, 2.9, .09], [x, y, -15.92], deepGlazing)
    box([5, 2.7, .06], [x, y, -15.86], glazing)
    for (const dx of [-2.6, 0, 2.6]) box([.06, 3, .12], [x + dx, y, -15.8], facadeMetal)
    box([5.7, .14, 1.2], [x, y + 1.52, -15.4], white)
    box([5.3, 2.9, .09], [x, y, -34.08], deepGlazing)
    box([5, 2.7, .06], [x, y, -34.14], glazing)
    for (const dx of [-2.6, 0, 2.6]) box([.06, 3, .12], [x + dx, y, -34.2], facadeMetal)
    box([5.7, .14, .8], [x, y + 1.52, -34.4], white)
  }
  // Roof terrace and shaded pergola, with correctly placed edge rails.
  box([12, .16, 9], [47, 12.3, -24], paving)
  for (let x = 41; x <= 53; x += 3) rod([x, 12.4, -19.5], [x, 13.45, -19.5], .025, facadeMetal)
  rod([41, 13.45, -19.5], [53, 13.45, -19.5], .025, facadeMetal)
  for (const x of [42, 52]) for (const z of [-28, -21]) box([.13, 2.7, .13], [x, 13.6, z], facadeMetal)
  for (let x = 42; x <= 52; x += .45) box([.1, .22, 7.5], [x, 15, -24.5], timber)
  box([6, .22, 3.6], [47.5, 3.3, -14.6], white)
  for (const x of [44.8, 50.2]) box([.17, 3.2, .17], [x, 1.6, -13], facadeMetal)
  box([3.6, 2.9, .08], [47.5, 1.5, -15.78], glazing)
  for (const x of [46.65, 48.35]) rod([x, 1, -15.66], [x, 1.6, -15.66], .015, steel)
  for (let i = 0; i < 3; i++) box([6.5, .12, .5], [47.5, -.08 + i * .12, -11.8 - i * .5], cutConcrete)
  for (let x = 32; x < 65; x += 2) box([.012, .007, 29], [x, -.045, -24], joint, 0, false)
  for (let z = -38; z < -9; z += 2) box([33, .007, .012], [48, -.044, z], joint, 0, false)
  const foliage = own(new PlaneGeometry(1, 1))
  for (const [x, z] of [[32, -16], [32, -31], [41, -10], [56, -10], [62, -25]]) {
    box([2.2, .4, 2.2], [x, .04, z], facadeStone)
    box([2, .06, 2], [x, .27, z], soil)
    rod([x, .3, z], [x + .1, 3.8, z], .1, bark)
    for (let i = 0; i < (compact ? 24 : 42); i++) {
      const angle = i * 2.39996; const radius = .25 + (i % 7) * .17
      const end = [x + Math.cos(angle) * radius, 3.2 + (i % 9) * .19, z + Math.sin(angle) * radius]
      if (i % 3 === 0) rod([x, 2.5, z], end, .035, bark)
      shape(foliage, [1.35, 1.25, 1], end, leaf[i % leaf.length], [Math.sin(i) * .65, angle, Math.cos(i) * .3])
    }
  }
  for (const z of [-21, -28]) {
    box([.7, .14, 2.5], [33, .5, z], timber)
    for (const dz of [-.85, .85]) box([.5, .5, .14], [33, .2, z + dz], facadeMetal)
  }
}
