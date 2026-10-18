import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {houseChapterProgress} from '../../src/data/tejes/houseWalkthrough.js'
const {chromium}=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright')
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']})
const reports=[]
try{
for(const [width,height] of [[1440,1000],[390,844]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[],failed=[]
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url())})
 await page.goto('http://127.0.0.1:5174/tejes');await page.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready',null,{timeout:60000})
 for(const index of [0,4,5,11]){
  const p=houseChapterProgress[index]
  await page.evaluate(p=>{const r=document.querySelector('.tj-home');scrollTo({top:r.getBoundingClientRect().top+scrollY+p*(r.offsetHeight-document.querySelector('.tj-viewport').offsetHeight),behavior:'instant'})},p)
  await page.waitForFunction(p=>Math.abs(document.querySelector('.tj-scene').__tejasHouse.inspect().progress-p)<.0001,p)
  await page.screenshot({path:`docs/tejes-cinematic-qa/house/clear-${width}-${index+1}.png`})
 }
 const performanceResult=await page.evaluate(async()=>{
  const root=document.querySelector('.tj-home'),runtime=document.querySelector('.tj-scene').__tejasHouse,renderTimes=[],frameTimes=[]
  const original=runtime.update.bind(runtime)
  runtime.update=p=>{const t=performance.now();original(p);renderTimes.push(performance.now()-t)}
  const top=root.getBoundingClientRect().top+scrollY,length=root.offsetHeight-document.querySelector('.tj-viewport').offsetHeight
  const travel=reverse=>new Promise(resolve=>{let start,last;function frame(now){start??=now;if(last)frameTimes.push(now-last);last=now;const t=Math.min(1,(now-start)/6000);scrollTo({top:top+(reverse?1-t:t)*length,behavior:'instant'});if(t<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)})
  await travel(true);await new Promise(r=>setTimeout(r,800));await travel(false);await new Promise(r=>setTimeout(r,1000))
  const n=renderTimes.length;await new Promise(r=>setTimeout(r,200));const idleCalls=renderTimes.length-n
  runtime.update=original
  const summary=a=>({mean:a.reduce((s,v)=>s+v,0)/a.length,p95:a.toSorted((a,b)=>a-b)[Math.floor(a.length*.95)]})
  return {renderMs:summary(renderTimes),frameMs:summary(frameTimes),idleCalls,final:runtime.inspect(),overflow:document.documentElement.scrollWidth>innerWidth,chapters:document.querySelectorAll('.tj-chapter').length}
 })
 assert.equal(errors.length,0);assert.equal(failed.length,0);assert.equal(performanceResult.chapters,12);assert.equal(performanceResult.idleCalls,0);assert.equal(performanceResult.overflow,false)
 assert.ok(Math.abs(performanceResult.final.progress-1)<.0001)
 const report={width,height,errors,failed,...performanceResult};reports.push(report);console.log(JSON.stringify({width,errors,failed,renderMs:report.renderMs,frameMs:report.frameMs,idleCalls:report.idleCalls}))
 await page.close()
}
await fs.writeFile('docs/tejes-cinematic-qa/house/clarity-performance.json',JSON.stringify(reports,null,2))
}finally{await browser.close()}
