import {createRequire} from 'node:module'
import {houseChapterProgress} from '../../src/data/tejes/houseWalkthrough.js'
const {chromium}=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright')
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())});page.on('pageerror',e=>console.log('ERROR',e.message))
await page.goto('http://127.0.0.1:5174/tejes')
await page.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready',null,{timeout:90000})
for(const i of [0,1,2,3,4,5,6,11]){
 await page.evaluate(p=>{const e=document.querySelector('.tj-home');window.scrollTo(0,e.getBoundingClientRect().top+scrollY+p*(e.offsetHeight-document.querySelector('.tj-viewport').offsetHeight))},houseChapterProgress[i])
 await page.waitForTimeout(550)
 await page.screenshot({path:`docs/tejes-cinematic-qa/house/revised-${i+1}.png`,timeout:60000})
 console.log(i+1,await page.evaluate(()=>document.querySelector('.tj-scene').__tejasHouse.inspect()))
}
await browser.close()

