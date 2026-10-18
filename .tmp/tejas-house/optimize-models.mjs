import fs from 'node:fs/promises'
import {createRequire} from 'node:module'
const sharp=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')('sharp')
for(const name of ['sofa','armchair','dining-table','dining-chair','coffee-table']){
 const file=`public/assets/tejes/cinematic/house/models/${name}.glb`, input=await fs.readFile(file)
 const jsonSize=input.readUInt32LE(12), doc=JSON.parse(input.subarray(20,20+jsonSize).toString()),bin=input.subarray(28+jsonSize)
 const replacements=new Map()
 for(const im of doc.images||[]){
  if(im.bufferView===undefined)continue
  const v=doc.bufferViews[im.bufferView],raw=bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength)
  const stats=await sharp(raw).stats(),process=sharp(raw).resize({width:1024,height:1024,fit:'inside',withoutEnlargement:true})
  const out=stats.isOpaque?await process.jpeg({quality:89,mozjpeg:true}).toBuffer():await process.png({compressionLevel:9}).toBuffer()
  im.mimeType=stats.isOpaque?'image/jpeg':'image/png';replacements.set(im.bufferView,out)
 }
 let size=0;const parts=[]
 for(let i=0;i<doc.bufferViews.length;i++){
  const v=doc.bufferViews[i],part=replacements.get(i)||bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength)
  v.byteOffset=size;v.byteLength=part.length;parts.push(part);size+=part.length
  const pad=(4-size%4)%4;if(pad){parts.push(Buffer.alloc(pad));size+=pad}
 }
 doc.buffers[0].byteLength=size
 let j=Buffer.from(JSON.stringify(doc));j=Buffer.concat([j,Buffer.alloc((4-j.length%4)%4,32)])
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+j.length+size,8);header.writeUInt32LE(j.length,12);header.writeUInt32LE(0x4e4f534a,16)
 const bh=Buffer.alloc(8);bh.writeUInt32LE(size,0);bh.writeUInt32LE(0x004e4942,4)
 await fs.writeFile(file,Buffer.concat([header,j,bh,...parts]));console.log(name,input.length,'->',28+j.length+size)
}
