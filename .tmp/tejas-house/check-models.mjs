import fs from 'node:fs'
for(const name of ['sofa','armchair','dining-table','dining-chair','coffee-table']){const b=fs.readFileSync(`public/assets/tejes/cinematic/house/models/${name}.glb`);const j=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());console.log(name,j.materials?.map(m=>({name:m.name,c:m.pbrMetallicRoughness?.baseColorFactor})),j.scene,j.scenes?.[0])}
