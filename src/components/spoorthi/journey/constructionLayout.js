// Shared model coordinates let camera-clearance checks use the actual site grid.
export const constructionLayout = Object.freeze({
  columnsX: [-12, -6, 0, 6, 12],
  structuralRowsZ: [-9, -3, 3],
  columnWidth: .64,
  floorsY: [4.35, 8.75],
  slabSize: [26.5, .32, 20.5],
  slabCenterZ: -3,
  frontCageTop: x => x === 6 ? 1.5 : 3.2,
})
