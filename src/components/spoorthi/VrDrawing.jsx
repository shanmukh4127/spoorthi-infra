function VrDrawing({ variant = 'perspective', className = '' }) {
  return (
    <svg className={`vr-drawing ${className}`} viewBox="0 0 600 400" fill="none" aria-hidden="true" focusable="false">
      <g className="vr-drawing__guides">
        {[80,160,240,320,400,480,560].map(x => <path key={x} d={`M${x} 20V380`} />)}
        {[80,160,240,320].map(y => <path key={y} d={`M20 ${y}H580`} />)}
      </g>
      {variant === 'plan' ? <g className="vr-drawing__lines">
        <path strokeWidth="2" d="M140 40H450V355H140ZM140 160H260M300 160H450M280 40V120M280 160V240M280 285V355M140 260H235M320 260H450" />
        <path d="M150 50H440V345H150M280 120h40a40 40 0 0 1-40 40M280 285h45a45 45 0 0 0-45-45M175 75h70v50h-70ZM175 86h70M330 65h70v70h-70ZM340 75h50v50h-50M165 190h30v45h-30ZM210 195h40v30h-40ZM175 280h75v45h-75ZM330 290h70v35h-70M120 40V355M110 40h25M110 355h25M140 375H450M140 365v15M450 365v15" />
      </g> : variant === 'elevation' ? <g className="vr-drawing__lines">
        <path d="M20 330H590M70 330V155H470V330M55 155H485V168H55ZM115 170V320H240V170M250 170V320H400V170M260 245H395M180 170v150M330 170v150M460 330V230H555V330M445 230h125M300 155V95H345V155M310 95V65M290 95h65M90 140h360" />
        {[85,95,105,410,420,430,440,450].map(x=><path key={x} d={`M${x} 175v145`} />)}
      </g> : variant === 'model' ? <g className="vr-drawing__lines">
        <path className="vr-drawing__plane" d="m90 240 200 85 220-120-205-65Z" />
        <path d="M120 235V110l175 65v140M120 110l180-70 180 55-185 80M480 95v130L295 315M300 40v135M120 170l175 65 185-85M205 143v127M390 133v130M90 240l200 85 220-120" />
      </g> : <g className="vr-drawing__lines">
        <path d="M40 30 225 135H385L570 30M40 370l185-100h160l185 100M225 135V270M385 135V270M40 30v340M570 30v340M100 65v272M155 97v210M440 100v199M510 64v238M255 157h105v97H255Z" />
        <path d="M40 100l185 57M40 300l185-60M570 100l-185 57M570 300l-185-60M150 30l100 105M450 30l-100 105M150 370l100-100M450 370 350 270M225 205h160M305 157v97" />
      </g>}
    </svg>
  )
}
export default VrDrawing
