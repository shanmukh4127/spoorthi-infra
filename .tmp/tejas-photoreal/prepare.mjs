import fs from 'node:fs/promises'
import {createRequire} from 'node:module'
const sharp=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')('sharp')
const dir='public/assets/tejes/cinematic/photoreal'
const provenance=JSON.parse(await fs.readFile(`${dir}/generation-prompts.json`,'utf8'))
const manifest=[],tiles=[]
const positions=[.61,.57,.61,.6,.58,.59,.66,.63,.63,.63,.62,.62]
for(const [index,item] of provenance.images.entries()){
 const input=`${dir}/originals/${item.id}.png`,m=await sharp(input).metadata()
 const variants=[]
 for(const width of [...new Set([640,960,1280,m.width])].sort((a,b)=>a-b)){
  const name=`${item.id}-${width}.webp`
  await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:87,effort:6}).toFile(`${dir}/${name}`)
  variants.push({width,src:`/assets/tejes/cinematic/photoreal/${name}`,bytes:(await fs.stat(`${dir}/${name}`)).size})
 }
 const portrait=[]
 for(const width of [480,640]){
  const height=Math.round(width*1.40625),cropWidth=Math.round(m.height/1.40625)
  const left=Math.min(m.width-cropWidth,Math.max(0,Math.round(m.width*positions[index]-cropWidth/2)))
  const name=`${item.id}-portrait-${width}.webp`
  await sharp(input).extract({left,top:0,width:cropWidth,height:m.height}).resize(width,height,{withoutEnlargement:true}).webp({quality:88,effort:6}).toFile(`${dir}/${name}`)
  portrait.push({width,src:`/assets/tejes/cinematic/photoreal/${name}`,bytes:(await fs.stat(`${dir}/${name}`)).size})
 }
 manifest.push({id:item.id,chapter:index+1,width:m.width,height:m.height,variants,portrait,position:`${Math.round(positions[index]*100)}% 50%`,alt:['Sunlit contemporary living room with linen seating, walnut joinery and sculptural stone','Designer studio with sketches, physical samples and a walnut worktable','Architectural plans, tracing paper and a physical apartment model','Marble, oak, walnut, linen and plum wool material collection','Walnut modular kitchen with a marble island and plum upholstered stools','Master bedroom with textured ivory bedding, walnut cabinetry and a plum throw','Luxury living area with a curved plum sofa and an ivory architectural arch','Boutique workspace with oak desks, plum chairs and glazed meeting rooms','Layered warm architectural lighting against walnut and charcoal stone at dusk','Photorealistic design concept with a courtyard, oak stair and glass balustrade','Walnut joinery, aligned grain, brushed brass and honed stone craftsmanship','Completed luxury interior concept with marble, linen seating and a garden view'][index]})
 tiles.push({input:await sharp(input).resize(418,256,{fit:'cover'}).jpeg().toBuffer(),left:index%4*418,top:Math.floor(index/4)*256})
 item.sourceFile=`originals/${item.id}.png`;delete item.sourcePath
 console.log(item.id,m.width,m.height,variants.at(-1).bytes)
}
await fs.writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2))
await fs.writeFile(`${dir}/generation-prompts.json`,JSON.stringify(provenance,null,2))
await sharp({create:{width:1672,height:768,channels:3,background:'#eee8df'}}).composite(tiles).jpeg({quality:91}).toFile('docs/tejes-cinematic-qa/photoreal/originals-contact-sheet.jpg')
