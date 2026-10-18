import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {PerspectiveCamera,Vector3} from 'three'
import {tejasChapters} from '../src/data/tejes/cinematicJourney.js'
import {houseWaypoints,houseChapterAt,houseChapterProgress} from '../src/data/tejes/houseWalkthrough.js'
import {applyHouseCamera} from '../src/components/tejes/journey/houseCameraPath.js'
import {projectRoomArchitecture} from '../src/components/tejes/journey/reconstructHouseRoom.js'
const layout=JSON.parse(fs.readFileSync(new URL('../public/assets/tejes/cinematic/house/layout.json',import.meta.url)))
const pose=c=>[...c.position.toArray(),...c.quaternion.toArray(),c.fov,...c.projectionMatrix.elements]
const inside=(v,r)=>v.every((n,a)=>n>=r.min[a]-1e-7&&n<=r.max[a]+1e-7)

test('exactly twelve editable chapters mark locations on one nonuniform route',()=>{
 assert.equal(tejasChapters.length,12)
 assert.equal(houseChapterProgress.length,12)
 assert.ok(houseWaypoints.length>12)
 const camera=new PerspectiveCamera()
 houseChapterProgress.forEach((p,i)=>{
  assert.equal(houseChapterAt(p),i)
  assert.ok(tejasChapters[i].title&&tejasChapters[i].text)
  applyHouseCamera(camera,p)
  camera.position.toArray().forEach((v,a)=>assert.ok(Math.abs(v-houseWaypoints.find(w=>w.chapter===i).p[a])<1e-8))
  if(i)assert.ok(p>houseChapterProgress[i-1])
 })
 assert.ok(houseChapterProgress.some((p,i)=>Math.abs(p-i/11)>.02))
})

test('forward, reverse and arbitrary seeks reproduce the complete pose on desktop and portrait',()=>{
 for(const aspect of [1.44,1024/768,390/844,375/812]){
  const camera=new PerspectiveCamera(65,aspect,.035,65)
  const frames=Array.from({length:1001},(_,i)=>{applyHouseCamera(camera,i/1000);return pose(camera)})
  for(let i=1000;i>=0;i--){applyHouseCamera(camera,i/1000);assert.deepEqual(pose(camera),frames[i])}
  for(const i of [101,455,0,1000,14,300]){applyHouseCamera(camera,i/1000);assert.deepEqual(pose(camera),frames[i])}
 }
})

test('no camera reset or look-at flip, including every doorway U-turn',()=>{
 const camera=new PerspectiveCamera(65,1.44,.035,65)
 let previous
 for(let i=0;i<=10000;i++){
  applyHouseCamera(camera,i/10000)
  assert.ok(pose(camera).every(Number.isFinite))
  assert.ok(layout.rooms.some(r=>inside(camera.position.toArray(),r)))
  if(previous){
   assert.ok(camera.position.distanceTo(previous.position)<.014)
   assert.ok(camera.quaternion.angleTo(previous.quaternion)<.013)
  }
  previous=camera.clone()
 }
 applyHouseCamera(camera,-1);assert.deepEqual(camera.position.toArray(),houseWaypoints[0].p)
 applyHouseCamera(camera,2);camera.position.toArray().forEach((v,i)=>assert.ok(Math.abs(v-houseWaypoints.at(-1).p[i])<1e-9))
})

test('each room crossing passes through a paired, unobstructed door aperture',()=>{
 const camera=new PerspectiveCamera();let room,previous, crossings=0
 for(let i=0;i<=10000;i++){
  applyHouseCamera(camera,i/10000);const point=camera.position.toArray()
  const next=layout.rooms.find(r=>inside(point,r))
  assert.ok(next)
  if(room&&room.id!==next.id){
   const portal=room.portals.find(p=>p.to===next.id)
   assert.ok(portal,`${room.id} must connect to ${next.id}`)
   const fraction=(portal.plane-previous[portal.axis])/(point[portal.axis]-previous[portal.axis])
   const across=portal.axis===2?0:2,at=previous[across]+fraction*(point[across]-previous[across])
   assert.ok(at>portal.range[0]+.18&&at<portal.range[1]-.18)
   assert.ok(point[1]<portal.height-.2)
   assert.ok(next.portals.some(p=>p.to===room.id&&p.axis===portal.axis&&p.plane===portal.plane))
   crossings++
  }
  room=next;previous=point
 }
 assert.equal(crossings,5)
})

test('photographic architecture has exact wall edges, inward normals and no portal walls',()=>{
 for(const room of layout.rooms){
  const geometry=projectRoomArchitecture(room),position=geometry.getAttribute('position'),uv=geometry.getAttribute('uv'),normal=geometry.getAttribute('normal')
  const center=new Vector3(...room.center)
  for(let i=0;i<position.count;i++){
   const point=new Vector3().fromBufferAttribute(position,i),n=new Vector3().fromBufferAttribute(normal,i)
   assert.ok(Number.isFinite(uv.getX(i))&&Number.isFinite(uv.getY(i)))
   assert.ok(n.dot(center.clone().sub(point))>0)
  }
  for(let i=0;i<geometry.index.count;i+=3){
   const a=new Vector3().fromBufferAttribute(position,geometry.index.getX(i)),b=new Vector3().fromBufferAttribute(position,geometry.index.getX(i+1)),c=new Vector3().fromBufferAttribute(position,geometry.index.getX(i+2))
   const middle=a.add(b).add(c).divideScalar(3)
   assert.ok(!room.portals.some(p=>Math.abs(middle.getComponent(p.axis)-p.plane)<.001))
  }
  geometry.dispose()
 }
})
