import * as THREE from 'three'
import layout from '../../../../public/assets/tejes/cinematic/house/layout.json'
import {applyHouseCamera} from './houseCameraPath.js'
import {reconstructRoom} from './reconstructHouseRoom.js'

const base='/assets/tejes/cinematic/house/'
export async function createHouseScene(host,onProgress,signal){
 const scene=new THREE.Scene()
 scene.background=new THREE.Color('#d7c6ad')
 const camera=new THREE.PerspectiveCamera(65,1,.025,70)
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'})
 const mobile=innerWidth<700
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.65))
 renderer.outputColorSpace=THREE.SRGBColorSpace
 renderer.toneMapping=THREE.NoToneMapping
 host.appendChild(renderer.domElement)
 let disposed=false,lastProgress=0,loaded=0
 const textures=new Set(),geometries=new Set(),materials=new Set()
 const register=mesh=>{geometries.add(mesh.geometry);materials.add(mesh.material);scene.add(mesh);return mesh}
 function dispose(){
  if(disposed)return
  disposed=true
  signal.removeEventListener('abort',dispose)
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose())
  textures.forEach(t=>{t.image?.close?.();t.dispose()})
  renderer.renderLists.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()
  delete host.__tejasHouse
 }
 signal.addEventListener('abort',dispose,{once:true})
 async function texture(url){
  const response=await fetch(url,{signal})
  if(!response.ok)throw Error(`Unable to load house imagery: ${response.status}`)
  const bitmap=await createImageBitmap(await response.blob(),{imageOrientation:'flipY'})
  if(disposed){bitmap.close();throw new DOMException('Aborted','AbortError')}
  const result=new THREE.Texture(bitmap)
  result.colorSpace=THREE.SRGBColorSpace;result.needsUpdate=true
  result.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy())
  textures.add(result);return result
 }
 async function roomMesh(room){
  const [image,clean,mask,response]=await Promise.all([texture(`${base}${room.id}-${mobile?1280:1774}.webp`),texture(`${base}${room.id}-clean-${mobile?1280:1774}.webp`),texture(`${base}${room.id}-foreground-mask.png`),fetch(`${base}${room.id}-depth.bin`,{signal})])
  if(!response.ok)throw Error('Unable to load room depth')
  const depth=new Float32Array(await response.arrayBuffer())
  if(disposed)throw new DOMException('Aborted','AbortError')
  mask.colorSpace=THREE.NoColorSpace
  const background=new THREE.MeshBasicMaterial({map:clean,side:THREE.FrontSide,toneMapped:false})
  const material=new THREE.MeshBasicMaterial({map:image,alphaMap:mask,alphaTest:.3,side:THREE.FrontSide,toneMapped:false})
  materials.add(material);materials.add(background)
  for(const foreground of [false,true]){
   const geometry=reconstructRoom(room,depth,layout.depthWidth,layout.depthHeight,{detail:mobile?2:1,foreground})
   register(new THREE.Mesh(geometry,foreground?material:background))
  }
  loaded++;onProgress(Math.round(loaded/4*90))
 }
 try{
  // Rooms are spatial neighbours, not chapters. Load the entrance and great room
  // first, then the private wing; every surface stays registered in one world.
  await Promise.all(layout.rooms.slice(0,2).map(roomMesh))
  await Promise.all(layout.rooms.slice(2).map(roomMesh))
  const wood=await texture('/assets/tejes/cinematic/oak-color.jpg')
  wood.wrapS=wood.wrapT=THREE.RepeatWrapping;wood.repeat.set(.4,2)
  const trim=new THREE.MeshBasicMaterial({map:wood,color:'#806247',toneMapped:false})
  materials.add(trim)
  function beam(w,h,d,x,y,z,material=trim){
   const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material)
   mesh.position.set(x,y,z);return register(mesh)
  }
  const doorKeys=new Set()
  for(const room of layout.rooms)for(const portal of room.portals){
   const key=`${portal.axis}:${portal.plane}:${portal.range.join(',')}`
   if(doorKeys.has(key))continue;doorKeys.add(key)
   const middle=(portal.range[0]+portal.range[1])/2,width=portal.range[1]-portal.range[0]
   if(portal.axis===2){
    for(const edge of portal.range)beam(.12,portal.height,.2,edge,portal.height/2,portal.plane)
    beam(width+.12,.13,.2,middle,portal.height+.04,portal.plane)
    beam(width,.018,.23,middle,.009,portal.plane)
   }else{
    for(const edge of portal.range)beam(.2,portal.height,.12,portal.plane,portal.height/2,edge)
    beam(.2,.13,width+.12,portal.plane,portal.height+.04,middle)
    beam(.23,.018,width,portal.plane,.009,middle)
   }
  }
  // The commercial chapter is an architectural concept print inside the house,
  // not a new room spliced into the residential walkthrough.
  const commercial=await texture('/assets/tejes/cinematic/photoreal/08-workspace-1280.webp')
  const print=new THREE.MeshBasicMaterial({map:commercial,toneMapped:false})
  const frame=new THREE.MeshBasicMaterial({color:'#382a31',toneMapped:false})
  const study=register(new THREE.Mesh(new THREE.PlaneGeometry(1.75,.985),print))
  study.position.set(3.6,1.7,5.37);study.rotation.y=Math.PI
  beam(1.84,1.075,.045,3.6,1.7,5.41,frame)
  const runtime={
   resize(){if(disposed)return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix()},
   update(progress){if(disposed)return;lastProgress=Math.max(0,Math.min(1,progress));applyHouseCamera(camera,lastProgress);renderer.render(scene,camera)},
   dispose,
   inspect(){return {progress:lastProgress,position:camera.position.toArray(),quaternion:camera.quaternion.toArray(),fov:camera.fov,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,memory:{...renderer.info.memory},rooms:layout.rooms.map(r=>r.id)}}
  }
  if(import.meta.env.DEV)host.__tejasHouse=runtime
  runtime.resize();runtime.update(0);onProgress(100)
  return runtime
 }catch(error){dispose();throw error}
}

