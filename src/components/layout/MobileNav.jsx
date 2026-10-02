import { useEffect, useId, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { IconButton } from '../common/index.js'
import MobileMenu from './MobileMenu.jsx'

function MobileNav({ brandName, items = [], cta }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const closeMenu = () => setIsOpen(false)


  useEffect(() => {
    if (!isOpen) return undefined
    menuRef.current?.querySelector('a')?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) closeMenu()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isOpen])

  return (
    <div className="mobile-navigation">
      <IconButton
        ref={triggerRef}
        aria-controls={menuId}
        aria-expanded={isOpen}
        label={isOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setIsOpen((value) => !value)}
        icon={isOpen ? <X size={20} /> : <Menu size={20} />}
      />
      {isOpen && <div ref={menuRef}><MobileMenu id={menuId} brandName={brandName} items={items} cta={cta} onNavigate={closeMenu} /></div>}
    </div>
  )
}

export default MobileNav
