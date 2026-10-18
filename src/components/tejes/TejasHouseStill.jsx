// Reduced-motion views are captured from the same connected house and camera
// markers. They are a reading alternative, never the moving canvas backdrop.
export default function TejasHouseStill({ index, priority = false, decorative = false }) {
  const base = `/assets/tejes/cinematic/house/stills/${String(index + 1).padStart(2, '0')}`
  return <picture>
    <source media="(max-width: 600px)" srcSet={`${base}-mobile.webp`} />
    <img src={`${base}-desktop.webp`} width="1280" height="889"
      alt={decorative ? '' : `Concept house, view ${index + 1} of 12`}
      loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
  </picture>
}
