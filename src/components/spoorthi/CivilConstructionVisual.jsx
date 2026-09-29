import Media from '../common/Media.jsx'

function CivilConstructionVisual({ media }) {
  if (media.src) return <Media {...media} />

  return (
    <figure className="civil-study">
      <div className="civil-study__frame">
        <div className="civil-study__annotation type-label" aria-hidden="true"><span>Form / Spatial study</span><span>Not to scale</span></div>
        <svg className="civil-study__drawing" viewBox="0 0 720 560" fill="none" aria-hidden="true" focusable="false">
          <g className="civil-study__guides">
            <path d="M60 430 370 540 670 365M60 280 370 390 670 215M60 130 370 240 670 65M110 100V465M270 155V520M450 190V495M610 95V400" />
          </g>
          <g className="civil-study__planes">
            <path d="m145 335 235 85 195-115-235-85Z" />
            <path d="m145 225 235 85 195-115-235-85Z" />
            <path d="m145 115 235 85 195-115-235-70Z" />
          </g>
          <g className="civil-study__structure">
            <path d="M145 115v220l235 85 195-115V85M380 200v220M340 15v205M225 144v220M460 152v220M535 109v220" />
            <path d="m145 225 235 85 195-115M145 115l235 85L575 85" />
          </g>
          <g className="civil-study__detail">
            <path d="m185 450 195 70 155-90M185 442v16M380 512v16M535 422v16" />
            <circle cx="380" cy="310" r="7" />
            <path d="M395 310h70l55 45h65" />
          </g>
        </svg>
        <p className="civil-study__footnote type-label" aria-hidden="true">Plan <span>→</span> Form <span>→</span> Built intent</p>
      </div>
      <figcaption>{media.caption}</figcaption>
    </figure>
  )
}

export default CivilConstructionVisual
