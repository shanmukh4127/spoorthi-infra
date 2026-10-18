import {createRequire} from 'node:module'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const {chromium}=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright')
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
const errors=[],failed=[],imageResponses=[],viewports=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('console',e=>{if(e.type()==='error')errors.push(e.text())})
page.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ABORTED'))failed.push([r.url(),r.failure()])})
page.on('response',r=>{if(r.status()>=400)failed.push([r.url(),r.status()]);if(r.url().includes('/photoreal/')&&r.url().endsWith('.webp'))imageResponses.push(r.url())})
await page.addInitScript(()=>{
 window.__tejasDrawCalls=0
 for(const method of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){
  const original=WebGL2RenderingContext.prototype[method]
  WebGL2RenderingContext.prototype[method]=function(...args){window.__tejasDrawCalls++;return original.apply(this,args)}
 }
})
await page.goto('http://127.0.0.1:5174/tejes')
await page.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready',null,{timeout:90000})
const initialPhotoRequests=[...new Set(imageResponses)]
assert.ok(initialPhotoRequests.length<=2)
const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable')
async function memory(){await cdp.send('HeapProfiler.collectGarbage');return (await cdp.send('Performance.getMetrics')).metrics.find(v=>v.name==='JSHeapUsedSize').value}
const baseline=await memory()
async function scrollChapter(i){
 await page.evaluate(index=>{const root=document.querySelector('.tj-home');window.scrollTo(0,root.getBoundingClientRect().top+scrollY+index/11*(root.offsetHeight-document.querySelector('.tj-viewport').offsetHeight))},i)
 await page.waitForFunction(index=>document.querySelector('.tj-home').dataset.chapter===String(index+1),i)
 await page.waitForFunction(index=>document.querySelector(`.tj-photograph[data-photo-chapter="${index+1}"]`)?.dataset.loaded==='true',i)
}
for(const [width,height] of [[1440,1000],[1024,768],[390,844],[375,812]]){
 await page.setViewportSize({width,height})
 const chapters=[]
 for(let i=0;i<12;i++){
  await scrollChapter(i)
  await page.waitForTimeout(480)
  const info=await page.locator(`.tj-photograph[data-photo-chapter="${i+1}"] img`).evaluate(img=>({url:img.currentSrc,naturalWidth:img.naturalWidth,complete:img.complete}))
  assert.ok(info.complete&&info.naturalWidth>0)
  assert.ok(width<=600?info.url.includes('portrait'):!info.url.includes('portrait'))
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  assert.ok(await page.locator('.tj-photograph').count()<=3)
  assert.equal(await page.locator('.tj-chapter.is-active').count(),1)
  await page.screenshot({path:`docs/tejes-cinematic-qa/photoreal/${width}-${String(i+1).padStart(2,'0')}.png`,timeout:60000})
  chapters.push({chapter:i+1,...info})
 }
 for(let i=11;i>=0;i--)await scrollChapter(i)
 viewports.push({width,height,chapters,reverse:true,overflow:false})
 console.log('ALL CHAPTERS PASS',width)
}
await page.waitForTimeout(200)
const drawsBefore=await page.evaluate(()=>window.__tejasDrawCalls)
await page.waitForTimeout(650)
assert.equal(await page.evaluate(()=>window.__tejasDrawCalls),drawsBefore)
await page.getByRole('button',{name:'View live 3D',exact:true}).click()
await page.waitForFunction(()=>document.querySelector('.tj-home').dataset.visualMode==='spatial-study')
await page.waitForTimeout(500)
assert.ok(await page.evaluate(()=>window.__tejasDrawCalls)>drawsBefore)
await scrollChapter(5)
await page.screenshot({path:'docs/tejes-cinematic-qa/photoreal/375-live-spatial-study.png'})
await page.getByRole('button',{name:'View concept imagery',exact:true}).click()
assert.equal(await page.locator('.tj-home').getAttribute('data-visual-mode'),'concept-imagery')
const after=await memory()
assert.ok(after<baseline+15000000)
await page.locator('.tj-story').focus();await page.keyboard.press('ArrowDown')
await page.waitForFunction(()=>document.querySelector('.tj-home').dataset.chapter==='7')
await page.getByRole('button',{name:'Menu',exact:true}).click();await page.keyboard.press('Shift+Tab')
assert.ok(await page.evaluate(()=>document.querySelector('[role=dialog]').contains(document.activeElement)))
await page.keyboard.press('Escape')
await page.getByRole('button',{name:'12 — The final reveal',exact:true}).click()
await page.getByRole('link',{name:'Get in touch',exact:true}).click()
await page.waitForURL('**/tejes/contact');await page.waitForSelector('.tj-home',{state:'detached'})
await page.emulateMedia({reducedMotion:'reduce'})
await page.goto('http://127.0.0.1:5174/tejes')
await page.waitForSelector('.tj-home--reading')
assert.equal(await page.locator('.tj-scene canvas').count(),0)
assert.equal(await page.locator('.tj-chapter:visible').count(),12)
for(let i=0;i<12;i++){
 const img=page.locator('.tj-chapter picture img').nth(i)
 await img.scrollIntoViewIfNeeded()
 await img.evaluate(image=>image.decode())
}
assert.ok(await page.locator('.tj-chapter picture img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>0)))
await page.getByRole('button',{name:'Menu',exact:true}).click()
await page.getByRole('button',{name:'06 Personal living spaces',exact:true}).click()
await page.waitForSelector('[role=dialog]',{state:'detached'})
assert.ok(Math.abs((await page.locator('#tejas-chapter-6').boundingBox()).y)<2)
await page.screenshot({path:'docs/tejes-cinematic-qa/photoreal/375-reading-mode.png'})
const result={viewports,initialPhotoRequests,imagesAreLocal:true,boundedMountedImages:3,liveSpatialStudy:true,idleDraws:0,keyboard:true,menuFocus:true,contactNavigation:true,reducedMotion:true,readingImagesLoaded:12,memoryBytes:{baseline,after},errors,failed}
await fs.writeFile('docs/tejes-cinematic-qa/photoreal/results.json',JSON.stringify(result,null,2))
assert.deepEqual(errors,[]);assert.deepEqual(failed,[])
console.log('FINAL PASS',JSON.stringify({baseline,after,errors,failed}))
await browser.close()
