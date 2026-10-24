import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import TejesFeaturedProjects from '../../components/tejes/TejesFeaturedProjects.jsx'
import { routePaths } from '../../data/routePaths.js'
import '../../styles/tejes-static-home.css'

export default function TejesHomePage() {
  return <div className="tejes-static-home">
    <section className="tsh-hero" aria-labelledby="tejes-static-title">
      <div className="tsh-hero__copy">
        <p className="tsh-eyebrow">Tejes Interiors / Considered spaces</p>
        <h1 id="tejes-static-title">A feeling.<br /><em>Before a word.</em></h1>
        <p>A framed doorway. A glimpse of light. The first moment of a space stays with you. Explore interiors through proportion, material and the details that bring them together.</p>
        <div className="tsh-actions"><Link className="tsh-button" to={routePaths.tejes.contact}>Discuss your space <ArrowUpRight size={17} aria-hidden="true" /></Link><a className="tsh-link" href="#tejes-featured-projects">Explore projects <ArrowDown size={16} aria-hidden="true" /></a></div>
      </div>
      <figure className="tsh-hero__visual"><picture><source media="(max-width: 600px)" srcSet="/assets/tejes/cinematic/photoreal/01-first-impression-portrait-480.webp 480w, /assets/tejes/cinematic/photoreal/01-first-impression-portrait-640.webp 640w" /><img src="/assets/tejes/cinematic/photoreal/01-first-impression-1280.webp" srcSet="/assets/tejes/cinematic/photoreal/01-first-impression-640.webp 640w, /assets/tejes/cinematic/photoreal/01-first-impression-1280.webp 1280w, /assets/tejes/cinematic/photoreal/01-first-impression-1672.webp 1672w" sizes="(max-width: 800px) 90vw, 48vw" width="1672" height="1024" alt="Illustrative interior with warm natural materials and softly lit architectural details" fetchPriority="high" /></picture><figcaption><span>Light. Material. Atmosphere.</span><small>Illustrative concept · Not a client project</small></figcaption></figure>
    </section>
    <TejesFeaturedProjects />
  </div>
}
