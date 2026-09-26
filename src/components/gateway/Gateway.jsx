import { useState } from 'react'
import { brands } from '../../brands/index.js'
import BrandPanel from './BrandPanel.jsx'
import '../../styles/gateway.css'

const gatewayBrands = [brands.spoorthi, brands.tejes]

function Gateway() {
  const [activeBrand, setActiveBrand] = useState(null)

  return (
    <main
      className={`gateway${activeBrand ? ` gateway--${activeBrand}-active` : ''}`}
      id="gateway-content"
      onMouseLeave={() => setActiveBrand(null)}
      tabIndex="-1"
    >
      <header className="gateway__intro">
        <p className="gateway__eyebrow">Spoorthi Infra × Tejes Interiors</p>
        <h1 className="gateway__statement">Two practices. One design ecosystem.</h1>
      </header>

      <div className="gateway__panels">
        {gatewayBrands.map((brand) => (
          <BrandPanel
            key={brand.id}
            brand={brand}
            isActive={activeBrand === brand.id}
            isMuted={activeBrand !== null && activeBrand !== brand.id}
            onFocusChange={setActiveBrand}
            onHoverChange={setActiveBrand}
          />
        ))}
      </div>
    </main>
  )
}

export default Gateway
