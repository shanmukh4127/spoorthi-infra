import fs from 'node:fs/promises'
import path from 'node:path'
import {createRequire} from 'node:module'
process.env.PLAYWRIGHT_BROWSERS_PATH=path.resolve('.tmp/tejas-house/browsers')
const {chromium}=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright')
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']})
const dir='docs/tejes-cinematic-qa/house',reports=[]
for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,recordVideo:{dir:`${dir}/raw-recordings`,size:label==='desktop'?{width:1280,height:889}:{width,height}}})
 const page=await context.newPage(),errors=[],failed=[]
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push(r.url())})
 await page.goto('http://127.0.0.1:5174/tejes')
 await page.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready',null,{timeout:90000})
 console.log(`${label}: recording continuous native scroll 1 to 12 and reverse`)
 const report=await page.evaluate(async()=>{
  const root=document.querySelector('.tj-home'),host=document.querySelector('.tj-scene'),runtime=host.__tejasHouse
  const original=runtime.update.bind(runtime),renderTimes=[],frameTimes=[],samples=[],seen=new Set()
  runtime.update=p=>{const now=performance.now();original(p);renderTimes.push(performance.now()-now)}
  const top=root.getBoundingClientRect().top+scrollY,length=root.offsetHeight-document.querySelector('.tj-viewport').offsetHeight
  const travel=(reverse=false)=>new Promise(resolve=>{
   let start,last,count=0
   function frame(now){
    start??=now;const t=Math.min(1,(now-start)/40000),p=reverse?1-t:t
    if(last)frameTimes.push(now-last);last=now
    scrollTo({top:top+p*length,behavior:'instant'})
    seen.add(Number(root.dataset.chapter))
    if(count++%30===0){const v=runtime.inspect();samples.push({direction:reverse?'reverse':'forward',requested:p,actual:v.progress,position:v.position,quaternion:v.quaternion,chapter:Number(root.dataset.chapter)})}
    if(t<1)requestAnimationFrame(frame);else resolve()
   }
   requestAnimationFrame(frame)
  })
  await travel();await new Promise(r=>setTimeout(r,1000));await travel(true);await new Promise(r=>setTimeout(r,500))
  runtime.update=original
  const percentile=(a,p)=>a.toSorted((a,b)=>a-b)[Math.min(a.length-1,Math.floor(a.length*p))]
  const summary=a=>({count:a.length,mean:a.reduce((a,b)=>a+b,0)/a.length,p50:percentile(a,.5),p95:percentile(a,.95),max:Math.max(...a)})
  const resources=performance.getEntriesByType('resource').filter(e=>/\/assets\/tejes\//.test(e.name)).map(e=>({name:e.name.split('/assets/tejes/')[1],bytes:e.decodedBodySize}))
  return {seen:[...seen].sort((a,b)=>a-b),renderMs:summary(renderTimes),frameMs:summary(frameTimes),samples,resources,final:runtime.inspect(),overflow:document.documentElement.scrollWidth>innerWidth}
 })
 const video=page.video();await context.close();await video.saveAs(`${dir}/${label}-forward-reverse.webm`);await video.delete()
 reports.push({label,width,height,errors,failed,...report});console.log(JSON.stringify({label,errors,failed,seen:report.seen,renderMs:report.renderMs,frameMs:report.frameMs}))
 await fs.writeFile(`${dir}/recording-results.json`,JSON.stringify(reports,null,2))
}
await browser.close()
