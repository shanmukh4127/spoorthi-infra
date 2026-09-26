import { brands } from '../../brands/index.js'
import { routePaths } from '../../data/routePaths.js'
import { spoorthiHomeSections, spoorthiProcess, spoorthiProjects, spoorthiServices, spoorthiWhyPrinciples } from '../../data/spoorthi/index.js'
import { tejesHomeSections, tejesProcess, tejesProjects, tejesServices, tejesWhyPrinciples } from '../../data/tejes/index.js'
import {
  AboutSection,
  CTASection,
  Design2DSection,
  Design3DSection,
  FinalOutputSection,
  HeroSection,
  ProcessSection,
  ProjectsSection,
  ServicesSection,
  VRExperienceSection,
  WhyChooseUsSection,
} from '../../components/sections/index.js'

const homeDataByBrand = Object.freeze({
  spoorthi: Object.freeze({ sections: spoorthiHomeSections, services: spoorthiServices, projects: spoorthiProjects, projectRoute: routePaths.spoorthi.projects, process: spoorthiProcess, why: spoorthiWhyPrinciples }),
  tejes: Object.freeze({ sections: tejesHomeSections, services: tejesServices, projects: tejesProjects, projectRoute: routePaths.tejes.projects, process: tejesProcess, why: tejesWhyPrinciples }),
})

function HomePage({ brandId }) {
  const brand = brands[brandId]
  const homeData = homeDataByBrand[brandId]
  const contentById = Object.fromEntries(homeData.sections.map((section) => [section.id, section]))
  const getContent = (sectionId) => contentById[sectionId]
  const sectionRenderers = {
    hero: () => <HeroSection eyebrow={brand.industry} title={getContent('hero').title} description={getContent('hero').description} cta={brand.primaryCta} visualVariant={brandId} visualLabel="Architectural study" />,
    about: () => <AboutSection eyebrow={getContent('about').eyebrow} title={getContent('about').title} description={getContent('about').description} supporting={getContent('about').supporting} visualVariant={brandId} visualLabel="Structural study" />,
    services: () => <ServicesSection eyebrow={getContent('services').eyebrow} title={getContent('services').title} description={getContent('services').description} services={homeData.services} brandVariant={brandId} />,
    '2d-design': () => <Design2DSection eyebrow={getContent('2d-design').eyebrow} title={getContent('2d-design').title} description={getContent('2d-design').description} supporting={getContent('2d-design').supporting} cta={getContent('2d-design').cta} brandVariant={brandId} visualLabel="Technical drawing study" />,
    '3d-design': () => <Design3DSection eyebrow={getContent('3d-design').eyebrow} title={getContent('3d-design').title} description={getContent('3d-design').description} supporting={getContent('3d-design').supporting} cta={getContent('3d-design').cta} brandVariant={brandId} visualLabel="Spatial visualization study" />,
    'final-output': () => <FinalOutputSection eyebrow={getContent('final-output').eyebrow} title={getContent('final-output').title} description={getContent('final-output').description} supporting={getContent('final-output').supporting} brandVariant={brandId} visualLabel="Built-form study" />,
    'vr-experience': () => <VRExperienceSection eyebrow={getContent('vr-experience').eyebrow} title={getContent('vr-experience').title} description={getContent('vr-experience').description} supporting={getContent('vr-experience').supporting} cta={getContent('vr-experience').cta} brandVariant={brandId} visualLabel="Spatial experience study" />,
    projects: () => <ProjectsSection eyebrow={getContent('projects').eyebrow} title={getContent('projects').title} description={getContent('projects').description} projects={homeData.projects} projectRoute={homeData.projectRoute} brandVariant={brandId} />,
    process: () => <ProcessSection eyebrow={getContent('process').eyebrow} title={getContent('process').title} description={getContent('process').description} steps={homeData.process} brandVariant={brandId} />,
    [`why-${brandId}`]: () => <WhyChooseUsSection id={`why-${brandId}`} eyebrow={getContent(`why-${brandId}`).eyebrow} title={getContent(`why-${brandId}`).title} description={getContent(`why-${brandId}`).description} principles={homeData.why} brandVariant={brandId} />,
    cta: () => <CTASection eyebrow={getContent('cta').eyebrow} title={getContent('cta').title} description={getContent('cta').description} label={getContent('cta').primary.label} to={brand.primaryCta.path} secondary={getContent('cta').secondary} brandVariant={brandId} />,
  }

  return (
    <div className={`home-page home-page--${brandId}`} data-home-brand={brandId}>
      {brand.homeSections.filter((sectionId) => sectionId !== 'footer').map((sectionId) => (
        <div key={sectionId}>{sectionRenderers[sectionId]()}</div>
      ))}
    </div>
  )
}

export default HomePage
