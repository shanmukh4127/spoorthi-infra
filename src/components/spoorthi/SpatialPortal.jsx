import { useRef, useState } from 'react'
import { Move, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))
const limitOffset = (value, zoom) => clamp(value, -(zoom - 1) * 50, (zoom - 1) * 50)

function SpatialPortal({ content }) {
  const { media, viewpoints } = content
  const [activeId, setActiveId] = useState(viewpoints[0].id)
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragOrigin = useRef(null)
  const activeViewpoint = viewpoints.find(point => point.id === activeId)

  function selectViewpoint(point) {
    setActiveId(point.id)
    setView({
      zoom: point.zoom,
      x: limitOffset((50 - point.x) * point.zoom, point.zoom),
      y: limitOffset((50 - point.y) * point.zoom, point.zoom),
    })
  }

  function changeZoom(nextZoom) {
    const zoom = clamp(nextZoom, 1, 2.5)
    setView(current => ({ zoom, x: limitOffset(current.x, zoom), y: limitOffset(current.y, zoom) }))
  }

  function resetView() {
    selectViewpoint(viewpoints[0])
  }

  function startDrag(event) {
    if (view.zoom === 1 || event.button !== 0 || event.target.closest('button')) return
    const bounds = event.currentTarget.getBoundingClientRect()
    dragOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, x: view.x, y: view.y, width: bounds.width, height: bounds.height }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  function moveDrag(event) {
    if (!dragOrigin.current) return
    const origin = dragOrigin.current
    setView(current => ({
      ...current,
      x: limitOffset(origin.x + (event.clientX - origin.pointerX) / origin.width * 100, current.zoom),
      y: limitOffset(origin.y + (event.clientY - origin.pointerY) / origin.height * 100, current.zoom),
    }))
  }

  function endDrag() {
    dragOrigin.current = null
    setDragging(false)
  }

  function navigateWithKeyboard(event) {
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return
    const actions = {
      ArrowLeft: () => setView(current => ({ ...current, x: limitOffset(current.x + 5, current.zoom) })),
      ArrowRight: () => setView(current => ({ ...current, x: limitOffset(current.x - 5, current.zoom) })),
      ArrowUp: () => setView(current => ({ ...current, y: limitOffset(current.y + 5, current.zoom) })),
      ArrowDown: () => setView(current => ({ ...current, y: limitOffset(current.y - 5, current.zoom) })),
      '+': () => changeZoom(view.zoom + .25),
      '=': () => changeZoom(view.zoom + .25),
      '-': () => changeZoom(view.zoom - .25),
      Home: resetView,
    }
    if (actions[event.key]) {
      event.preventDefault()
      actions[event.key]()
    }
  }

  return (
    <figure className="spatial-explorer" aria-label={content.title}>
      <div className="spatial-explorer__header"><span className="type-label">Interactive concept / 01</span><span><Move size={14} aria-hidden="true" /> Select a detail. Take a closer look.</span></div>
      <div className="spatial-explorer__layout">
        <div className="spatial-explorer__canvas">
          <div
            className={`spatial-explorer__viewport ${view.zoom > 1 ? 'is-zoomed' : ''} ${dragging ? 'is-dragging' : ''}`}
            tabIndex={0}
            role="group"
            aria-label="Interior concept explorer"
            aria-describedby="spatial-explorer-instructions"
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onKeyDown={navigateWithKeyboard}
          >
            <div className="spatial-explorer__scene" style={{ transform: `translate(${view.x}%, ${view.y}%) scale(${view.zoom})` }}>
              <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="eager" draggable="false" />
              {viewpoints.filter(point => point.id !== 'overview').map((point, index) => <button
                key={point.id}
                type="button"
                className="spatial-explorer__hotspot"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => selectViewpoint(point)}
                aria-label={`Explore ${point.title.toLowerCase()}`}
                aria-pressed={point.id === activeId}
              >{index + 1}</button>)}
            </div>
            <span className="spatial-explorer__badge">Concept interior</span>
          </div>
          <div className="spatial-explorer__controls" role="group" aria-label="Image navigation">
            <button type="button" aria-label="Zoom out" onClick={() => changeZoom(view.zoom - .25)} disabled={view.zoom === 1}><ZoomOut size={18} aria-hidden="true" /></button>
            <label className="spatial-explorer__zoom"><span className="sr-only">Zoom level</span><input type="range" min="1" max="2.5" step=".05" value={view.zoom} aria-valuetext={`${Math.round(view.zoom * 100)}% magnification`} onChange={event => changeZoom(Number(event.target.value))} /><output>{Math.round(view.zoom * 100)}%</output></label>
            <button type="button" aria-label="Zoom in" onClick={() => changeZoom(view.zoom + .25)} disabled={view.zoom === 2.5}><ZoomIn size={18} aria-hidden="true" /></button>
            <button type="button" className="spatial-explorer__reset" aria-label="Reset view" onClick={resetView}><RotateCcw size={16} aria-hidden="true" /><span>Reset view</span></button>
          </div>
          <p id="spatial-explorer-instructions" className="spatial-explorer__instructions">Zoom, then drag to explore. With the image focused, use arrow keys to pan, + / − to zoom, or Home to reset.</p>
        </div>
        <div className="spatial-explorer__panel">
          <p className="type-label">A different way to see</p>
          <h3>Every detail<br />shapes the space.</h3>
          <nav className="spatial-explorer__viewpoints" aria-label="Interior perspectives">{viewpoints.map((point, index) => <button type="button" key={point.id} aria-pressed={point.id === activeId} onClick={() => selectViewpoint(point)}><span>0{index + 1}</span>{point.title}<span aria-hidden="true">↗</span></button>)}</nav>
          <div className="spatial-explorer__detail" aria-live="polite" aria-atomic="true"><span className="type-label">{activeViewpoint.label}</span><p>{activeViewpoint.description}</p></div>
        </div>
      </div>
      <figcaption><span>{content.caption}</span><span>{content.note}</span></figcaption>
    </figure>
  )
}
export default SpatialPortal
