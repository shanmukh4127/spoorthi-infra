import {PerspectiveCamera} from 'three'
import {applyHouseCamera} from '../../src/components/tejes/journey/houseCameraPath.js'
const c=new PerspectiveCamera();let previous,maxDistance=0,maxAngle=0,where=0
for(let i=0;i<=10000;i++){applyHouseCamera(c,i/10000);if(previous){maxDistance=Math.max(maxDistance,c.position.distanceTo(previous.position));const a=c.quaternion.angleTo(previous.quaternion);if(a>maxAngle){maxAngle=a;where=i/10000}}previous=c.clone()}
console.log({maxDistance,maxAngle,where})
