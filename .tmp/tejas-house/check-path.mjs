import fs from 'node:fs'
import {PerspectiveCamera} from 'three'
import {applyHouseCamera} from '../../src/components/tejes/journey/houseCameraPath.js'
const layout=JSON.parse(fs.readFileSync('public/assets/tejes/cinematic/house/layout.json'))
let outside=[];const camera=new PerspectiveCamera()
for(let i=0;i<=5000;i++){const p=i/5000;applyHouseCamera(camera,p);const v=camera.position.toArray();if(!layout.rooms.some(r=>v.every((n,a)=>n>=r.min[a]-.01&&n<=r.max[a]+.01)))outside.push({p,v})}
console.log('outside count',outside.length,outside.slice(0,5),outside.slice(-5))
