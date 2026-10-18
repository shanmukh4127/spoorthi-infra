import {createRequire} from 'node:module'
import fs from 'node:fs/promises'
const {chromium}=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json')('playwright')
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
page.on('pageerror',e=>console.log('ERROR',e.message))
page.on('console',e=>{if(e.type()==='error')console.log('CONSOLE',e.text())})
await page.goto('http://127.0.0.1:5174/tejes')
await page.waitForFunction(()=>document.querySelector('.tj-home')?.dataset.sceneStatus==='ready',null,{timeout:90000})
for(const [width,height] of [[1440,1000],[390,844]]){
 await page.setViewportSize({width,height})
 for(const i of [0,4,8,11]){
  await page.getByRole('button',{name:new RegExp('^'+String(i+1).padStart(2,'0')+' —')}).click()
  await page.waitForFunction(index=>document.querySelector(`.tj-photograph[data-photo-chapter="${index+1}"]`)?.dataset.loaded==='true',i)
  await page.waitForTimeout(500)
  await page.screenshot({path:`docs/tejes-cinematic-qa/photoreal/${width}-${String(i+1).padStart(2,'0')}.png`})
 }
 console.log('VISUAL',width)
}
await browser.close()
