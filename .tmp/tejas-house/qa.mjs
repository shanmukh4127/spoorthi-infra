import fs from 'node:fs/promises'
import path from 'node:path'
import {createRequire} from 'node:module'
import {houseChapterProgress} from '../../src/data/tejes/houseWalkthrough.js'
process.env.PLAYWRIGHT_BROWSERS_PATH=path.resolve('.tmp/tejas-house/browsers')
const {chromium}=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright')
const sharp=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')('sharp')
const output='docs/tejes-cinematic-qa/house'
await fs.mkdir(output,{recursive:true});await fs.mkdir('public/assets/tejes/cinematic/house/stills',{recursive:true})
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']})
const report=[]
const scroll=async(page,p)=>{await page.evaluate(p=>{const e=document.querySelector('.tj-home');window.scrollTo({top:e.getBoundingClientRect().top+scrollY+p*(e.offsetHeight-document.querySelector('.tj-viewport').offsetHeight),behavior:'instant'})},p);await page.waitForTimeout(500)}
for(const [width,height] of [[1440,1000],[1024,768],[390,844],[375,812]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1})
 const page=await context.newPage(), errors=[],failed=[]
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})})
 const start=Date.now();await page.goto('http://127.0.0.1:5174/tejes')
 await page.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready',null,{timeout:90000})
 const readyMs=Date.now()-start, chapters=[]
 for(let i=0;i<12;i++){
  await scroll(page,houseChapterProgress[i])
  const state=await page.evaluate(()=>({chapter:Number(document.querySelector('.tj-home').dataset.chapter),...document.querySelector('.tj-scene').__tejasHouse.inspect(),overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)}))
  chapters.push(state)
  await page.screenshot({path:`${output}/${width}-chapter-${String(i+1).padStart(2,'0')}.png`})
  if(width===1440||width===390){
   const hide=await page.addStyleTag({content:'.tj-viewport > :not(.tj-scene){visibility:hidden!important}'})
   const image=await page.screenshot()
   const dest=`public/assets/tejes/cinematic/house/stills/${String(i+1).padStart(2,'0')}-${width===1440?'desktop':'mobile'}.webp`
   await sharp(image).resize({width:width===1440?1280:600,withoutEnlargement:true}).webp({quality:87,effort:6}).toFile(dest)
   await hide.evaluate(e=>e.remove())
  }
 }
 if(width===1440)for(const [id,p] of [['foyer-threshold',3/26],['bedroom-threshold',9/26],['bathroom-threshold',13/26],['bathroom',14/26],['return-hall',18/26]]){await scroll(page,p);await page.screenshot({path:`${output}/${id}.png`})}
 report.push({width,height,readyMs,errors,failed,chapters})
 console.log(JSON.stringify({width,readyMs,errors,failed,chapters:chapters.map(c=>c.chapter),overflow:chapters.some(c=>c.overflow)}))
 await context.close()
}
await fs.writeFile(`${output}/browser-results.json`,JSON.stringify(report,null,2))
await browser.close()
