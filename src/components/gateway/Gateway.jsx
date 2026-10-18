import { brands } from '../../brands/index.js'
import BrandPanel from './BrandPanel.jsx'
import '../../styles/gateway.css'

const gatewayBrands = [brands.spoorthi, brands.tejes]

function ScrollMark() {
  return <><span className="gateway__mouse"><i /></span><span>Scroll down</span></>
}

function Gateway() {
  return <main className="gateway" id="gateway-content" tabIndex="-1">
    <header className="gateway__intro"><h1>Two visions <span aria-hidden="true">•</span> One journey</h1></header>
    <div className="gateway__panels">{gatewayBrands.map(brand => <BrandPanel key={brand.id} brand={brand} />)}</div>
    <div className="gateway__divider" aria-hidden="true" />
    <div className="gateway__scroll gateway__scroll--desktop" aria-hidden="true"><ScrollMark /></div>
    <a className="gateway__scroll gateway__scroll--mobile" href="#gateway-tejes" aria-label="Scroll to Tejes Interiors"><ScrollMark /></a>
  </main>
}
export default Gateway
