function DesignDrawing({ variant = 'model', className = '' }) {
  return <svg className={`design-drawing ${className}`} viewBox="0 0 640 400" fill="none" aria-hidden="true" focusable="false">
    <g className="design-drawing__guides">{[80,160,240,320,400,480,560].map(x => <path key={x} d={`M${x} 25V375`} />)}{[80,160,240,320].map(y => <path key={y} d={`M35 ${y}H605`} />)}</g>
    {variant === 'plan' ? <>
      <path className="design-drawing__paper" d="M115 65H525V335H115Z" />
      <g className="design-drawing__ink"><path strokeWidth="4" d="M115 65H525V335H115ZM280 65V160M280 205V335M115 205H215M250 205H380M420 205H525M400 65V135M400 175V205M400 250V335" /><path d="M122 72H518V328H122M280 160h45a45 45 0 0 1-45 45M400 135h40a40 40 0 0 1-40 40M215 205v35a35 35 0 0 0 35-35M400 250h45a45 45 0 0 0-45-45M140 95h105v65H140ZM140 108h105M435 88h60v85H435ZM435 102h60M145 235h45v65h-45ZM198 248h52v38h-52ZM308 250h65v55h-65ZM440 272h60v35h-60ZM305 82h70v45h-70ZM312 88h55v32h-55M120 345H520M105 65V335M115 340v10M525 340v10M100 65h10M100 335h10" /></g>
    </> : variant === 'material' ? <>
      <path className="design-drawing__stone" d="M90 105H275V335H90Z" /><path className="design-drawing__timber" d="M290 60H525V220H290Z" /><path className="design-drawing__paper" d="M310 235H550V345H310Z" />
      <g className="design-drawing__ink" opacity=".35">{[310,335,360,385,410,435,460,485,510].map(x => <path key={x} d={`M${x} 65v150`} />)}<path d="m95 145 65 40-20 55 90 85M125 110l95 80-30 50 80 60M315 265h230M315 310h230" /></g>
    </> : <>
      <path className="design-drawing__ground" d="m40 302 335 80 235-115-337-70Z" /><path className="design-drawing__stone" d="M130 280V130l245 54v155Z" /><path className="design-drawing__glass" d="m375 184 150-73v154l-150 74Z" /><path className="design-drawing__paper" d="m105 130 160-68 285 49-175 82ZM105 215l270 59 175-86v15l-175 86-270-59Z" /><path className="design-drawing__glass" d="m160 157 180 40v55l-180-40ZM160 247l180 39v41l-180-40Z" />
      <g className="design-drawing__ink"><path d="M130 130v150l245 59 150-74V123M375 193v146M105 130l270 63 175-82M105 215l270 59 175-86M340 197v55M160 157v55M160 247v40" />{[190,220,250,280,310].map((x,i) => <path key={x} d={`M${x} ${164+i*7}v55M${x} ${254+i*7}v41`} />)}<path d="M405 178v80M440 160v80M480 141v80M510 126v80M405 274v50M440 257v49M480 237v50M510 222v50M265 62v135l110 25 150-70M265 197l-135 83M220 99v126M325 73v132" /></g>
    </>}
  </svg>
}
export default DesignDrawing
