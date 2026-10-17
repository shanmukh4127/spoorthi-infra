import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { brands } from '../../brands/index.js'
import { footerConfig } from '../../data/footer.js'
import { getBrandNavigation } from '../../data/navigation.js'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import AppShell from './AppShell.jsx'
import BrandProvider from './BrandProvider.jsx'
import PageShell from './PageShell.jsx'

function BrandLayout({ brandId, children, header }) {
  const { pathname } = useLocation()
  const brand = brands[brandId]
  const navigation = getBrandNavigation(brandId)
  const navigationWithCta = navigation.filter((item) => item.path !== brand.primaryCta?.path)
  return (
    <BrandProvider brand={brand}>
      <AppShell>
        <div className={`brand-layout brand-layout--${brandId}`} data-brand={brand.themeId} data-pathname={pathname}>
          <PageShell
            header={header ?? <Header brand={brand} navigation={navigationWithCta} cta={brand.primaryCta} />}
            footer={<Footer brand={brand} navigation={navigation} config={footerConfig[brandId]} />}
          >
            {children ?? <Outlet />}
          </PageShell>
        </div>
      </AppShell>
    </BrandProvider>
  )
}

export default BrandLayout
