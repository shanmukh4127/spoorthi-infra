import {createRequire} from 'node:module'
const sharp=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')('sharp')
for(const width of [1024,390,375]){
 const tw=width>600?360:195,th=width>600?270:422,tiles=[]
 for(let i=1;i<=12;i++)tiles.push({input:await sharp(`docs/tejes-cinematic-qa/photoreal/${width}-${String(i).padStart(2,'0')}.png`).resize(tw,th,{fit:'cover'}).png().toBuffer(),left:(i-1)%4*tw,top:Math.floor((i-1)/4)*th})
 await sharp({create:{width:tw*4,height:th*3,channels:3,background:'#eee8df'}}).composite(tiles).jpeg({quality:92}).toFile(`docs/tejes-cinematic-qa/photoreal/${width}-all-chapters.jpg`)
}
