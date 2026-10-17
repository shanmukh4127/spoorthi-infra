// Download four CC0 PBR surfaces from Poly Haven's public asset API, then
// prepare small local WebP maps. No runtime third-party requests are added.
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const destination = 'public/assets/spoorthi/cinematic'
const source = '.tmp/spoorthi-material-realism/source'
const surfaces = { plaster: 'beige_wall_001', stone: 'marble_01', asphalt: 'asphalt_02', floor: 'concrete_floor_worn_001' }
const catalog = JSON.parse(await fs.readFile('.tmp/civil-assets/polyhaven-textures.json', 'utf8'))
const manifestPath = path.join(destination, 'asset-manifest.json')
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))
await fs.mkdir(source, { recursive: true })
const download = async url => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Asset request failed: ${response.status} ${url}`)
  return Buffer.from(await response.arrayBuffer())
}
const records = await Promise.all(Object.entries(surfaces).map(async ([name, id]) => {
  const metadataPath = path.join(source, `${id}.json`)
  let metadata
  try { metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8')) }
  catch { const bytes = await download(`https://api.polyhaven.com/files/${id}`); await fs.writeFile(metadataPath, bytes); metadata = JSON.parse(bytes) }
  const records = await Promise.all(Object.entries({ color: 'Diffuse', normal: 'nor_gl', arm: 'arm' }).map(async ([kind, map]) => {
    const entry = metadata[map]['1k'].jpg
    const input = path.join(source, `${name}-${kind}.jpg`)
    try { await fs.access(input) } catch { await fs.writeFile(input, await download(entry.url)) }
    const variants = []
    for (const size of [1024, 512]) {
      const file = `textures/${name}-${kind}${size === 512 ? '-512' : ''}.webp`
      execFileSync(process.env.SPOORTHI_PYTHON || 'python', ['-c',
        'from PIL import Image; import sys; im=Image.open(sys.argv[1]).convert("RGB"); size=int(sys.argv[4]); im.thumbnail((size,size),Image.Resampling.LANCZOS); im.save(sys.argv[2],quality=94 if sys.argv[3]=="normal" else 90,method=6)', input, path.join(destination, file), kind, String(size)])
      const bytes = await fs.readFile(path.join(destination, file))
      variants.push({ file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), dimensions: [size, size], source: entry.url })
    }
    return variants
  }))
  const asset = { id, type: 'texture', source: `https://polyhaven.com/a/${id}`, license: 'CC0-1.0', licenseUrl: 'https://polyhaven.com/license', authors: catalog[id].authors }
  return { asset, records: records.flat() }
}))
for (const { asset, records: files } of records) {
  manifest.assetSources = manifest.assetSources.filter(item => item.id !== asset.id)
  manifest.assetSources.push(asset)
  for (const item of files) {
    manifest.files = manifest.files.filter(file => file.file !== item.file)
    manifest.files.push(item)
  }
}
manifest.totalBytes = manifest.files.reduce((total, item) => total + item.bytes, 0)
manifest.cameraPathSha256 = createHash('sha256').update(await fs.readFile('src/components/spoorthi/journey/cameraPath.js')).digest('hex').toUpperCase()
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Prepared ${records.length} CC0 surfaces; ${records.flatMap(item => item.records).reduce((total, item) => total + item.bytes, 0)} local texture bytes`)
