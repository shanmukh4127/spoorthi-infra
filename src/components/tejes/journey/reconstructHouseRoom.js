import {BufferGeometry,Float32BufferAttribute} from 'three'

// Rectangular, metrically fitted walls avoid the serrated floor/ceiling edges
// produced by clipping a spherical depth mesh against a box. Each vertex gets
// its photographic UV from the original panorama's calibrated viewing ray.
export function projectRoomArchitecture(room,{segments=72,rows=32,omitWalls=[]}={}){
 const positions=[],uvs=[],indices=[]
 for(const axis of [0,2])for(const side of [0,1]){
  const plane=(side?room.max:room.min)[axis],across=axis===2?0:2
  if(omitWalls.some(wall=>wall.axis===axis&&wall.plane===plane))continue
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

