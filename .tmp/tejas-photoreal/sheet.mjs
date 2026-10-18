import {createRequire} from 'node:module'
const sharp=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')('sharp')
const tiles=[]
for(let i=1;i<=12;i++)tiles.push({input:await sharp(`docs/tejes-cinematic-qa/photoreal/1440-${String(i).padStart(2,'0')}.png`).resize(360,250).png().toBuffer(),left:(i-1)%4*360,top:Math.floor((i-1)/4)*250})
await sharp({create:{width:1440,height:750,channels:3,background:'#eee8df'}}).composite(tiles).jpeg({quality:92}).toFile('docs/tejes-cinematic-qa/photoreal/desktop-all-chapters.jpg')
