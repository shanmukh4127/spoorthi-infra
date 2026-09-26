import { BrandContext } from './brandContext.js'

function BrandProvider({ brand, children }) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
}

export default BrandProvider
