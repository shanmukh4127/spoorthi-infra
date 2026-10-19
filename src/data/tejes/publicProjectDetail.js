import { projectById } from './projectArchive.js'
import { routePaths } from '../routePaths.js'

export function publicTejesProject(record) {
  const original = projectById[record.id]
  const media = (src, title) => ({ image: { src, width: 1536, height: 1024 }, alt: `${record.title} — ${title}`, title })
  return {
    ...original, ...record,
    number: original?.number || '—',
    label: record.category || 'Interior design',
    image: media(record.coverImage, 'Project cover').image,
    alt: record.coverAlt || record.title,
    heroImage: media(record.coverImage, 'Project cover'),
    detailRoute: routePaths.tejes.projectDetail(record.id),
    projectInfo: { ...original?.projectInfo, ...(record.area ? { Area: `${record.area} sq.ft` } : {}), ...(record.location ? { Location: record.location } : {}) },
    twoDImages: record.twoDImage ? [media(record.twoDImage, '2D drawing')] : original?.twoDImages || [],
    threeDImages: record.threeDImage ? [media(record.threeDImage, '3D structure')] : original?.threeDImages || [],
    visualizationImages: record.finalOutputImage ? [media(record.finalOutputImage, 'Final output')] : original?.visualizationImages || [],
    vrExperienceUrl: record.vrArUrl || original?.vrExperienceUrl,
    stageCopy: original?.stageCopy || { twoD: 'Explore the project drawings.', threeD: 'Review the spatial design.', visualization: 'See the project result.', vr: 'Explore the connected spatial experience when available.', video: 'Project footage can be supplied separately.' },
  }
}
