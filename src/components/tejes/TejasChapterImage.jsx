import chapterImages from '../../../public/assets/tejes/cinematic/photoreal/manifest.json'

const srcset = variants => variants.map(image => `${image.src} ${image.width}w`).join(', ')

// Photographic AI concept assets, never presented as navigable geometry.
export default function TejasChapterImage({ index, decorative = false, priority = false, eager = false, onLoad, onError }) {
  const asset = chapterImages[index]
  return <picture>
    <source media="(max-width: 600px)" srcSet={srcset(asset.portrait)} sizes="100vw" />
    <img src={asset.variants.find(image => image.width === 1280).src}
      srcSet={srcset(asset.variants)} sizes="100vw" width={asset.width} height={asset.height}
      style={{ objectPosition: asset.position }} alt={decorative ? '' : `AI-generated concept: ${asset.alt}`}
      loading={priority || eager ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
      decoding="async" onLoad={onLoad} onError={onError} />
  </picture>
}
