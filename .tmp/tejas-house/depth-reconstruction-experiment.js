import {BufferGeometry,Float32BufferAttribute} from 'three'

export function panoramaRay(u,v,yaw=0){
 const theta=(u-.5)*Math.PI*2+yaw, latitude=(.5-v)*Math.PI
 return [Math.cos(latitude)*Math.sin(theta),Math.sin(latitude),-Math.cos(latitude)*Math.cos(theta)]
}
export function boundaryDistance(room,direction){
 return Math.min(...direction.map((d,axis)=>Math.abs(d)<1e-9?Infinity:((d>0?room.max[axis]:room.min[axis])-room.center[axis])/d))
}
export function inDoorway(room,point,padding=0){
 return room.portals.some(portal=>{
  const across=portal.axis===2?0:2
  return Math.abs(point[portal.axis]-portal.plane)<.15 && point[across]>portal.range[0]-padding && point[across]<portal.range[1]+padding && point[1]>=-.04 && point[1]<portal.height+padding
 })
}

// Rectangular, metrically fitted walls avoid the serrated floor/ceiling edges
// produced by clipping a spherical depth mesh against a box. Each vertex gets
// its photographic UV from the original panorama's calibrated viewing ray.
export function projectRoomArchitecture(room,{segments=72,rows=32}={}){
 const positions=[],uvs=[],indices=[]
 for(const axis of [0,2])for(const side of [0,1]){
  const plane=(side?room.max:room.min)[axis],across=axis===2?0:2
  if(room.portals.some(p=>p.axis===axis&&Math.abs(p.plane-plane)<.001))continue
  const start=positions.length/3
  for(let y=0;y<=rows;y++)for(let x=0;x<=segments;x++){
   const point=[0,room.min[1]+y/rows*(room.max[1]-room.min[1]),0]
   point[axis]=plane;point[across]=room.min[across]+x/segments*(room.max[across]-room.min[across])
   const d=point.map((v,i)=>v-room.center[i])
   let theta=Math.atan2(d[0],-d[2])
   if(axis===2&&side&&theta<0)theta+=Math.PI*2
   positions.push(...point)
   uvs.push(.5+(theta-room.yaw)/(Math.PI*2),.5+Math.atan2(d[1],Math.hypot(d[0],d[2]))/Math.PI)
  }
  for(let y=0;y<rows;y++)for(let x=0;x<segments;x++){
   const a=start+y*(segments+1)+x,b=a+1,c=a+segments+1,d=c+1
   const inward=(axis===2&&side)||(axis===0&&!side)
   if(inward)indices.push(a,c,b,b,c,d)
   else indices.push(a,b,c,b,d,c)
  }
 }
 const geometry=new BufferGeometry()
 geometry.setAttribute('position',new Float32BufferAttribute(positions,3))
 geometry.setAttribute('uv',new Float32BufferAttribute(uvs,2));geometry.setIndex(indices)
 geometry.computeVertexNormals();geometry.computeBoundingSphere()
 return geometry
}

// A room is a pair of registered photographic surfaces, not a background:
// metric architectural surfaces plus nearer AI depth geometry. Doorway rays
// are absent from BOTH meshes, so neighbouring rooms are visible by depth test.
export function reconstructRoom(room,depth,width,height,{detail=1,foreground=false,architectureOnly=false}={}){
 const nx=Math.floor((width-1)/detail),ny=Math.floor((height-1)/detail)
 const positions=[],uvs=[],boundary=[],radii=[]
 for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){
  const u=x/nx,v=y/ny,direction=panoramaRay(u,v,room.yaw)
  const shell=boundaryDistance(room,direction)
  const sampleY=Math.round(v*(height-1)),sampleX=Math.round(u*(width-1))
  const radius=foreground?Math.min(shell,depth[sampleY*width+sampleX]):shell+.008
  positions.push(...direction.map((component,axis)=>room.center[axis]+component*radius))
  boundary.push(direction.map((component,axis)=>room.center[axis]+component*shell))
  radii.push([radius,shell]);uvs.push(u,1-v)
 }
 const indices=[]
 function add(a,b,c){
  const wall=[0,1,2].map(axis=>(boundary[a][axis]+boundary[b][axis]+boundary[c][axis])/3)
  if(architectureOnly){
   if(Math.abs(wall[1]-room.min[1])<.04||Math.abs(wall[1]-room.max[1])<.04)return
   if(room.portals.some(portal=>Math.abs(wall[portal.axis]-portal.plane)<.08))return
  }
  if(inDoorway(room,wall,.02))return
  if(foreground){
   // No stretched triangles bridging foreground silhouettes. The registered
   // architectural layer behind supplies the occluded colour instead of holes.
   const depths=[a,b,c].map(i=>radii[i][0])
   if(Math.max(...depths)-Math.min(...depths)>.65)return
  }
  indices.push(a,b,c)
 }
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
  const a=y*(nx+1)+x,b=a+1,c=a+nx+1,d=c+1
  add(a,c,b);add(b,c,d)
 }
 const geometry=new BufferGeometry()
 geometry.setAttribute('position',new Float32BufferAttribute(positions,3))
 geometry.setAttribute('uv',new Float32BufferAttribute(uvs,2))
 geometry.setIndex(indices)
 geometry.computeBoundingSphere()
 return geometry
}
