from pathlib import Path
p=Path('src/components/tejes/TejasInteriorJourney.jsx')
s=p.read_text(encoding='utf-8')
s=s.replace("import { tejasChapters, chapterAt, chapterProgress } from '../../data/tejes/cinematicJourney.js'","import { tejasChapters } from '../../data/tejes/cinematicJourney.js'\nimport { houseChapterAt as chapterAt, houseChapterProgress } from '../../data/tejes/houseWalkthrough.js'")
s=s.replace("import TejasChapterImage, { chapterImages } from './TejasChapterImage.jsx'","import TejasChapterImage from './TejasChapterImage.jsx'")
s=s.replace("import { photographicWeight } from './journey/photographicTimeline.js'\n",'')
s=s.replace("const num = n => String(n).padStart(2, '0')","const num = n => String(n).padStart(2, '0')\nconst chapterProgress = index => houseChapterProgress[Math.max(0, Math.min(11, index))]")
s=s.replace("  const [study, setStudy] = useState(false)\n",'').replace("  const studyRef = useRef(false), photographs = useRef([]), progress = useRef(0)\n",'')
a=s.index('      progress.current = p')
b=s.index('      meter.current',a)
s=s[:a]+'      runtime?.update(p)\n'+s[b:]
s=s.replace("import('./journey/createInteriorScene.js').then(async ({ createInteriorScene })", "import('./journey/createHouseScene.js').then(async ({ createHouseScene })")
s=s.replace('runtime = await createInteriorScene(', 'runtime = await createHouseScene(')
s=s.replace("className={`tj-home ${reading ? 'tj-home--reading' : ''}${study ? ' tj-home--study' : ''}`} ","className={`tj-home tj-home--house ${reading ? 'tj-home--reading' : ''}`} ")
s=s.replace("data-visual-mode={reading ? 'reading' : study ? 'spatial-study' : 'concept-imagery'}", "data-visual-mode={reading ? 'reading' : 'house-walkthrough'}")
a=s.index('      {!reading && <div className="tj-photographs"')
b=s.index('      <div className="tj-wash"',a)
s=s[:a]+'''      {!reading && status === 'loading' && <div className="tj-poster" aria-hidden="true"><img src="/assets/tejes/cinematic/house/foyer-1280.webp" alt="" /></div>}
'''+s[b:]
s=s.replace("{study && !reading ? 'Live 3D spatial study' : 'AI concept imagery'} · Not client projects", "AI-reconstructed concept house · Not a client project")
a=s.index('      {!reading && <div className="tj-tools"')
b=s.index('      {!reading && status',a)
s=s[:a]+'''      {!reading && <div className="tj-tools"><button onClick={read}>Read without motion</button><button disabled={active === 0} onClick={() => go(active - 1)} aria-label="Previous chapter"><ArrowLeft size={15} /></button><button disabled={active === 11} onClick={() => go(active + 1)} aria-label="Next chapter"><ArrowRight size={15} /></button></div>}
'''+s[b:]
s=s.replace('Preparing spatial study', 'Preparing the house')
a=s.index('      {credits && <div className="tj-credits"')
b=s.index('\n    </div>',a)
s=s[:a]+'''      {credits && <div className="tj-credits"><button onClick={() => setCredits(false)} aria-label="Close credits"><X size={17} /></button><p>Original house panoramas generated with OpenAI image generation, reconstructed using estimated depth and connected architectural surfaces. This is a constrained conceptual walkthrough, not a surveyed building or a Tejas client project. <a href="/assets/tejes/cinematic/house/generation-prompts.json" target="_blank" rel="noreferrer">Generation prompts</a>. <a href="/assets/tejes/cinematic/house/README.md" target="_blank" rel="noreferrer">Asset and reconstruction details</a>.</p></div>}'''+s[b:]
p.write_text(s,encoding='utf-8')
