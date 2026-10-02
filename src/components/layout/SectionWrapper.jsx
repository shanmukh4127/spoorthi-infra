import { useEffect, useRef, useState } from 'react'

function SectionWrapper({ as: Element = 'section', id, variant = 'standard', contained = false, fullWidth = false, className = '', children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const classes = [
    'layout-section',
    variant !== 'standard' ? `layout-section--${variant}` : '',
    contained ? 'layout-section--contained' : '',
    fullWidth ? 'layout-section--full-width' : '',
    className,
  ]
    .filter(Boolean).join(' ')
  const content = contained && !fullWidth ? <div className="layout-container">{children}</div> : children
  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) { setVisible(true); return undefined }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <Element ref={ref} className={[classes, visible ? 'is-visible' : ''].filter(Boolean).join(' ')} id={id}>{content}</Element>
}

export default SectionWrapper
