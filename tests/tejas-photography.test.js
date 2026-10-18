import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { photographicWeight } from '../src/components/tejes/journey/photographicTimeline.js'
const directory=new URL('../public/assets/tejes/cinematic/photoreal/',import.meta.url)
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',directory)))
test('twelve distinct original images and all responsive variants exist locally',()=>{
 assert.equal(manifest.length,12)
 const hashes=new Set()
 manifest.forEach((asset,index)=>{
  assert.equal(asset.chapter,index+1)
  const original=fs.readFileSync(new URL(`originals/${asset.id}.png`,directory))
  assert.equal(original.readUInt32BE(16),asset.width)
  assert.equal(original.readUInt32BE(20),asset.height)
  assert.ok(asset.width>=1536&&asset.height>=941)
  hashes.add(crypto.createHash('sha256').update(original).digest('hex'))
  assert.equal(asset.portrait.length,2)
  for(const variant of [...asset.variants,...asset.portrait]){
   assert.ok(variant.src.startsWith('/assets/tejes/cinematic/photoreal/'))
   const file=new URL(`../public${variant.src}`,import.meta.url)
   assert.equal(fs.statSync(file).size,variant.bytes)
   assert.ok(variant.bytes<600000)
   assert.ok(variant.width<=asset.width)
  }
 })
 assert.equal(hashes.size,12)
})
test('photographic reveals align with every existing chapter anchor and reverse exactly',()=>{
 for(let i=0;i<12;i++){
  assert.equal(photographicWeight(i/11,i),1)
  for(let j=0;j<12;j++)if(j!==i)assert.equal(photographicWeight(i/11,j),0)
 }
 const frames=Array.from({length:1001},(_,i)=>manifest.map((_,j)=>photographicWeight(i/1000,j)))
 for(let i=1000;i>=0;i--){
  assert.deepEqual(manifest.map((_,j)=>photographicWeight(i/1000,j)),frames[i])
  assert.ok(frames[i].filter(v=>v>0).length<=2)
  assert.ok(frames[i].every(v=>Number.isFinite(v)&&v>=0&&v<=1))
  assert.ok(Math.max(...frames[i])>=.49)
 }
 for(let i=0;i<11;i++){
  const p=(i+.5)/11
  assert.ok(Math.abs(photographicWeight(p,i)-.5)<1e-10)
  assert.ok(Math.abs(photographicWeight(p,i+1)-.5)<1e-10)
 }
})
