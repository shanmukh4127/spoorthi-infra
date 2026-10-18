import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const {chromium}=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright')
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']})
const output='docs/tejes-cinematic-qa/house',report={}
const reading=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
await reading.goto('http://127.0.0.1:5174/tejes')
assert.equal(await reading.locator('.tj-scene canvas').count(),0)
assert.equal(await reading.locator('.tj-chapter').count(),12)
for(let i=0;i<12;i++){
 await reading.locator('.tj-chapter').nth(i).scrollIntoViewIfNeeded()
 await reading.locator('.tj-chapter img').nth(i).evaluate(image=>image.decode())
}
report.reading=await reading.evaluate(()=>({canvas:document.querySelectorAll('.tj-scene canvas').length,chapters:document.querySelectorAll('.tj-chapter').length,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),overflow:document.documentElement.scrollWidth>innerWidth,paths:[...document.querySelectorAll('.tj-chapter img')].map(i=>i.currentSrc)}))
assert.equal(report.reading.broken.length,0);assert.equal(report.reading.overflow,false)
await reading.locator('.tj-chapter').nth(0).scrollIntoViewIfNeeded();await reading.screenshot({path:`${output}/reduced-motion.png`});await reading.close()
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[]
page.on('pageerror',e=>errors.push(e.message))
await page.goto('http://127.0.0.1:5174/tejes')
await page.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready')
await page.getByRole('button',{name:'Menu',exact:true}).click()
assert.equal(await page.getByRole('dialog').count(),1)
await page.keyboard.press('Shift+Tab')
assert.ok(await page.locator('.tj-menu-chapters button').last().evaluate(e=>e===document.activeElement))
await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0)
await page.getByRole('button',{name:'Menu',exact:true}).click()
await page.locator('.tj-menu-chapters button').nth(7).click()
await page.waitForFunction(()=>document.querySelector('.tj-home').dataset.chapter==='8')
await page.getByRole('button',{name:'Asset credits',exact:true}).click()
for(const link of await page.locator('.tj-credits a').all()){const response=await page.request.get(new URL(await link.getAttribute('href'),page.url()).href);assert.equal(response.status(),200)}
await page.getByRole('button',{name:'Close credits'}).click()
await page.getByRole('button',{name:'Read without motion'}).click()
assert.equal(await page.locator('.tj-scene canvas').count(),0)
report.menuAndDisposal={focusTrap:true,escape:true,chapterSeek:true,creditLinks:true,canvasRemoved:true,errors}
assert.equal(errors.length,0);await page.close()
const failure=await browser.newPage({viewport:{width:390,height:844}})
await failure.route('**/house/main-clean-1280.webp',r=>r.fulfill({status:503,body:'Intentional QA asset failure'}))
await failure.goto('http://127.0.0.1:5174/tejes')
await failure.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='error')
assert.equal(await failure.locator('.tj-scene canvas').count(),0)
assert.equal(await failure.locator('.tj-chapter').count(),12)
await failure.unroute('**/house/main-clean-1280.webp')
await failure.getByRole('button',{name:'Retry 3D',exact:true}).click()
await failure.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready',null,{timeout:60000})
assert.equal(await failure.locator('.tj-scene canvas').count(),1)
report.assetFailure={fullReadingFallback:true,retry:true,canvasCount:1};await failure.close()
await fs.writeFile(`${output}/fallback-and-controls.json`,JSON.stringify(report,null,2))
console.log(JSON.stringify(report));await browser.close()

