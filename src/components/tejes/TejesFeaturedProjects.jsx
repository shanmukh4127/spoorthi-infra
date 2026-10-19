import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { signatureProject, selectedProjects } from '../../data/tejes/projectArchive.js'
import usePublicProjects from '../../data/usePublicProjects.js'
import { publicTejesProject } from '../../data/tejes/publicProjectDetail.js'
import { routePaths } from '../../data/routePaths.js'
import ProjectScrollStory from '../common/ProjectScrollStory.jsx'

const scrollStoryRevision = import.meta.hot ? (import.meta.hot.data.projectRevision ?? 0) + 1 : 0
if (import.meta.hot) import.meta.hot.data.projectRevision = scrollStoryRevision

const projects = [signatureProject, ...selectedProjects.slice(0, 2)]
const stages = [
  { key: 'twoDImages', copyKey: 'twoD', label: '2D design', title: 'First, a sense of space.', note: 'Illustrative planning study · Shared concept plan, not an approved project drawing' },
  { key: 'threeDImages', copyKey: 'threeD', label: '3D design', title: 'An idea takes dimension.', note: 'Illustrative spatial perspective' },
  { key: 'visualizationImages', copyKey: 'visualization', label: 'Final output', title: 'The atmosphere, resolved.', note: 'Final concept visualization · Not completed-project photography' },
]
const featuredCopy = {
  'signature-residence': {
    twoD: { heading: 'A plan for everyday living.', description: 'Living, dining and kitchen areas form the social heart of this concept plan. Furnished room layouts show how everyday movement can connect shared spaces with quieter places to rest.' },
    threeD: { heading: 'Giving the plan depth.', description: 'A low, sculptural table anchors the seating arrangement, while tall glazing opens the room toward greenery. Warm timber and soft upholstery give the spatial study a calm, welcoming character.' },
    visualization: { heading: 'Light brings it together.', description: 'Daylight draws out the grain of timber, the softness of pale seating and the weight of the stone table. This final visualization brings those textures into one quiet, garden-facing composition.' },
  },
  'harmony-home': {
    twoD: { heading: 'Room to cook, gather and move.', description: 'The planning study explores a clear connection between the kitchen, dining table and living area. Furniture placement gives shared routines room to flow, while keeping the quieter rooms easy to reach.' },
    threeD: { heading: 'Shared spaces, in perspective.', description: 'An open kitchen perspective tests the scale of timber joinery, the island and seating. Long sightlines toward the living space show how gathering areas can feel connected without losing definition.' },
    visualization: { heading: 'A warmer way to gather.', description: 'Pale upholstery, natural wood and a sculptural table soften the shared living space. The final concept image explores a warm material palette and a generous relationship with the garden.' },
  },
  'serenity-villa': {
    twoD: { heading: 'Space for a quieter rhythm.', description: 'The layout considers the balance between shared rooms and private retreat. Furniture outlines and circulation paths help test how resting, reading and everyday movement can fit within a considered residential plan.' },
    threeD: { heading: 'A retreat takes shape.', description: 'The bedroom perspective studies the relationship between the upholstered bed, full-height timber surfaces and natural light. Soft furnishings bring warmth, while built-in elements give the room a clear, calm structure.' },
    visualization: { heading: 'An atmosphere of ease.', description: 'Soft seating and a low stone table sit within a bright, nature-facing interior. This final visualization explores how layered neutral tones, gentle daylight and an open outlook can create a feeling of retreat.' },
  },
}


export default function TejesFeaturedProjects() {
  const { projects: publicProjects } = usePublicProjects()
  const visibleProjects = projects.flatMap(project => { const record = publicProjects.find(record => record.id === project.id && record.brand === 'Tejes Interiors'); return record ? [publicTejesProject(record)] : [] })
  return <section className="tfp" id="tejes-featured-projects" aria-labelledby="tejes-featured-title">
    <header className="tfp-intro"><p className="tfp-kicker">Tejes Interiors <span>A closer look</span></p><div><h2 id="tejes-featured-title">From a first line.<br /><em>To a lasting feeling.</em></h2><p>Selected design studies. Follow each space from its planning idea to a three-dimensional view and the final imagined atmosphere.</p></div>{visibleProjects.length > 0 && <a className="tfp-intro-scroll" href={`#featured-${visibleProjects[0].id}`}>Discover the collection <ArrowDown size={17} aria-hidden="true" /></a>}</header>
    {visibleProjects.map((project, index) => <ProjectScrollStory key={`${project.id}-${scrollStoryRevision}`} project={project} index={index} total={visibleProjects.length} stages={stages} copy={featuredCopy[project.id]} />)}
    <footer className="tfp-closing"><p className="tfp-kicker">Your next chapter</p><h2>A space that feels<br /><em>like you.</em></h2><div><Link className="tfp-link" to={routePaths.tejes.contact}>Start a conversation <ArrowRight size={17} aria-hidden="true" /></Link><Link className="tfp-link" to={routePaths.tejes.projects}>View all projects <ArrowRight size={17} aria-hidden="true" /></Link></div><p className="tfp-concept">Tejes Interiors · Interior design & spatial storytelling</p></footer>
  </section>
}
