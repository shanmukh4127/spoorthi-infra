import { useContext } from 'react'
import { BrandContext } from './brandContext.js'

export function useBrandContext() {
  const brand = useContext(BrandContext)
  if (!brand) throw new Error('useBrandContext must be used inside a BrandProvider')
  return brand
}
