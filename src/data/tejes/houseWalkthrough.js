// One continuous world-space route. Untagged controls steer through doorways;
// chapters are editorial markers on this route, never scene-change commands.
export const houseWaypoints = [
 { chapter:0, p:[-3.6,1.6,10], target:[-3.6,1.5,5.5] },
 { chapter:1, p:[-3.6,1.6,8.2], target:[-3.6,1.5,4.8] },
 { p:[-3.6,1.6,6.2], target:[-3.2,1.45,2] },
 { p:[-3.6,1.6,5.5], target:[-2.8,1.45,0] },
 { chapter:2, p:[-3.4,1.6,4.5], target:[0,1.4,-3] },
 { chapter:3, p:[-1.4,1.6,.6], target:[-3.1,1,-2.5] },
 { chapter:4, p:[0,1.6,-1.5], target:[0,1.2,-5] },
 { p:[-.5,1.6,.5], target:[-.6,1.5,5.5] },
 { p:[-.6,1.6,3.8], target:[-.6,1.5,7.5] },
 { p:[-.6,1.6,5.5], target:[-.2,1.4,9.5] },
 { p:[-.3,1.6,6.4], target:[.4,1.35,10.7] },
 { chapter:5, p:[.4,1.6,8.3], target:[.4,1.15,10.8] },
 { p:[2.5,1.6,8.7], target:[6.8,1.35,8.6] },
 { p:[4.4,1.6,8.6], target:[8,1.25,8.5] },
 { p:[5.5,1.6,8.5], target:[8,1.2,8.5] },
 { p:[4.4,1.6,8.6], target:[1,1.45,8] },
 { p:[2.2,1.6,8], target:[-.6,1.45,5.5] },
 { p:[-.3,1.6,6.4], target:[-.6,1.45,3] },
 { p:[-.6,1.6,5.5], target:[.3,1.4,.8] },
 { p:[-.3,1.6,4.4], target:[2.8,1.25,-.5] },
 { chapter:6, p:[1.2,1.6,.8], target:[4,1.15,-.7] },
 { chapter:7, p:[2.5,1.6,3.8], target:[3.6,1.7,5.4] },
 { chapter:8, p:[2.4,1.6,2.3], target:[4.4,2.5,-.2] },
 { chapter:9, p:[.5,1.75,.5], target:[0,1.4,-3.8] },
 { chapter:10, p:[-1,1.6,-1.4], target:[0,1.25,-4.9] },
 { p:[-1.4,1.7,.5], target:[.7,1.2,-.5] },
 { chapter:11, p:[0,1.9,4.4], target:[0,1.35,-1.5] },
]
export const houseChapterProgress = Array.from({length:12},(_,chapter)=>houseWaypoints.findIndex(point=>point.chapter===chapter)/(houseWaypoints.length-1))
export function houseChapterAt(progress){
 const p=Math.max(0,Math.min(1,progress))
 for(let index=0;index<11;index++) if(p<(houseChapterProgress[index]+houseChapterProgress[index+1])/2)return index
 return 11
}
