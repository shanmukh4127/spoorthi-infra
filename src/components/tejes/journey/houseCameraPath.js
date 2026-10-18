import {CatmullRomCurve3,Vector3,Euler} from 'three'
import {houseWaypoints} from '../../../data/tejes/houseWalkthrough.js'
const positions=new CatmullRomCurve3(houseWaypoints.map(point=>new Vector3(...point.p)),false,'centripetal')
// Interpolating look-at points can send the target through the camera during a
// doorway U-turn and flip the view by 180 degrees. Unwrapped yaw and pitch keep
// the same intended views while taking a smooth, continuous turn between them.
let previousYaw
const directions=houseWaypoints.map(({p,target})=>{
 const dx=target[0]-p[0],dy=target[1]-p[1],dz=target[2]-p[2]
 let yaw=Math.atan2(-dx,-dz)
 if(previousYaw!==undefined){while(yaw-previousYaw>Math.PI)yaw-=Math.PI*2;while(yaw-previousYaw< -Math.PI)yaw+=Math.PI*2}
 previousYaw=yaw
 return new Vector3(yaw,Math.atan2(dy,Math.hypot(dx,dz)),0)
})
const rotations=new CatmullRomCurve3(directions,false,'centripetal')
const angle=new Vector3(),euler=new Euler(0,0,0,'YXZ')
export function applyHouseCamera(camera,progress){
 const t=Math.max(0,Math.min(1,progress))
 positions.getPoint(t,camera.position)
 rotations.getPoint(t,angle)
 euler.set(angle.y-(camera.aspect<1?.12:0),angle.x,0,'YXZ');camera.quaternion.setFromEuler(euler)
 const final=Math.max(0,(t-.91)/.09)
 const eased=final*final*(3-2*final)
 camera.fov=(camera.aspect<1?79:65)+eased*7
 camera.updateProjectionMatrix()
}
