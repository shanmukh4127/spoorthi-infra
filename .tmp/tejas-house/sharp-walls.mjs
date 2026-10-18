import {createRequire} from 'node:module'
const sharp=createRequire('C:/Users/Pardhu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json')('sharp')
for(const id of ['kitchen-wall','bedroom-wall','bathroom-wall']){
 const source=`public/assets/tejes/cinematic/house/originals/${id}.png`
 const meta=await sharp(source).metadata()
 for(const [suffix,width] of [['native',meta.width],['mobile',1536]])await sharp(source).resize({width,withoutEnlargement:true}).webp({quality:94,effort:6}).toFile(`public/assets/tejes/cinematic/house/${id}-${suffix}.webp`)
 console.log(id,meta.width,meta.height)
}
