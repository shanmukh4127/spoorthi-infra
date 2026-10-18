import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { applyInteriorCamera } from './cameraPath.js'

const asset = '/assets/tejes/cinematic/'
export async function createInteriorScene(host, onProgress, signal) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#eee6da')
  scene.fog = new THREE.Fog('#eee6da', 30, 65)
  const camera = new THREE.PerspectiveCamera(57, 1, .035, 85)
  const renderer = new THREE.WebGLRenderer({ antialias: innerWidth > 600, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 600 ? 1.25 : 1.6))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .95
  scene.environmentIntensity = .72
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  host.appendChild(renderer.domElement)
  const roots = [scene]
  const extraTextures = []
  const retainedMaterials = new Set()
  const targets = []
  let composer
  let disposed = false
  function dispose() {
    if (disposed) return
    disposed = true
    const geometries = new Set(), materials = new Set(retainedMaterials), textures = new Set(extraTextures)
    roots.forEach(root => root.traverse(object => {
      if (object.geometry) geometries.add(object.geometry)
      const mats = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : []
      mats.forEach(m => { materials.add(m); Object.values(m).forEach(v => { if (v?.isTexture) textures.add(v) }) })
      object.shadow?.map?.dispose()
    }))
    materials.forEach(m => Object.values(m).forEach(v => { if (v?.isTexture) textures.add(v) }))
    geometries.forEach(g => g.dispose())
    materials.forEach(m => m.dispose())
    textures.forEach(t => { t.source?.data?.close?.(); t.dispose() })
    targets.forEach(t => t.dispose())
    composer?.passes.forEach(pass=>pass.dispose())
    composer?.dispose()
    renderer.renderLists.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
  // Abort during fetch or asynchronous image decoding must also release the context.
  const abort = () => dispose()
  signal.addEventListener('abort', abort, { once: true })
  const originalDispose = dispose
  const teardown = () => { signal.removeEventListener('abort', abort); originalDispose() }
  try {
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, .03)
    targets.push(environment)
    scene.environment = environment.texture
    extraTextures.push(environment.texture)
    room.dispose()
    pmrem.dispose()
    const hemi = new THREE.HemisphereLight('#fff7e9', '#8f8171', .65)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#fff0d3', 2)
    sun.position.set(3, 10, 6)
    sun.target.position.set(8, 0, 1)
    sun.castShadow = true
    sun.shadow.mapSize.set(innerWidth < 600 ? 1024 : 2048, innerWidth < 600 ? 1024 : 2048)
    Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 12, bottom: -12, near: .5, far: 45 })
    sun.shadow.bias = -.0004
    sun.shadow.normalBias = .025
    scene.add(sun, sun.target)
    RectAreaLightUniformsLib.init()
    const ambientPanels = []
    for (const x of [0, 8, 16, 24]) {
      const light = new THREE.RectAreaLight('#ffddb0', 1.8, 4, 2)
      light.position.set(x, 3.1, 2.7)
      light.rotation.x = -Math.PI / 2
      scene.add(light)
      ambientPanels.push(light)
    }
    const loader = new GLTFLoader()
    let finished = 0
    const lengths = { 'living-room.glb': 7082280, 'kitchen.glb': 15529364, 'sleigh-bed.glb': 3459192 }
    const received = new Map()
    const total = Object.values(lengths).reduce((a,b) => a+b,0)
    async function load(name) {
      const response = await fetch(asset + name, { signal })
      if (!response.ok) throw new Error(`Unable to load ${name}`)
      const reader = response.body.getReader(), chunks = []
      let count = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value); count += value.byteLength; received.set(name, count)
        onProgress(Math.min(92, Math.round([...received.values()].reduce((a,b)=>a+b,0) / total * 92)))
      }
      const buffer = new Uint8Array(count)
      let offset = 0
      chunks.forEach(chunk => { buffer.set(chunk, offset); offset += chunk.byteLength })
      const gltf = await loader.parseAsync(buffer.buffer, asset)
      roots.push(gltf.scene)
      gltf.scene.traverse(o => { if(o.material) for(const m of Array.isArray(o.material)?o.material:[o.material]) retainedMaterials.add(m) })
      if (disposed || signal.aborted) {
        // Decoding can finish after an abort; dispose that late result immediately.
        gltf.scene.traverse(o => { o.geometry?.dispose(); if(o.material) for(const m of Array.isArray(o.material)?o.material:[o.material]) { Object.values(m).forEach(v=>{if(v?.isTexture){v.source?.data?.close?.();v.dispose()}});m.dispose() } })
        throw new DOMException('Aborted', 'AbortError')
      }
      finished++
      onProgress(92 + finished * 2)
      return gltf.scene
    }
    const [living, kitchen, bed] = await Promise.all([load('living-room.glb'), load('kitchen.glb'), load('sleigh-bed.glb')])
    const plaster = new THREE.MeshStandardMaterial({ color: '#e9dfd0', roughness: .92 })
    const walnut = new THREE.MeshStandardMaterial({ color: '#63442f', roughness: .6 })
    const cream = new THREE.MeshStandardMaterial({ color: '#d4c3ac', roughness: .85 })
    const plum = new THREE.MeshStandardMaterial({ color: '#704c68', roughness: .87 })
    const brass = new THREE.MeshStandardMaterial({ color: '#b7a079', metalness: .75, roughness: .32 })
    const marble = new THREE.MeshStandardMaterial({ color: '#e5e1d7', roughness: .33 })
    const glow = new THREE.MeshStandardMaterial({ color: '#fff4d8', emissive: '#ffdfaa', emissiveIntensity: 2 })
    const textureLoader = new THREE.TextureLoader()
    const textured = await Promise.all(['marble'].map(async name => {
      const texture = await textureLoader.loadAsync(`/assets/tejes/reference/material-${name}.webp`)
      if(disposed || signal.aborted) { texture.dispose(); throw new DOMException('Aborted','AbortError') }
      texture.colorSpace = THREE.SRGBColorSpace
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
      extraTextures.push(texture)
      return texture
    }))
    const floorMaps = await Promise.all(['color','normal','roughness'].map(async kind => {
      const texture = await textureLoader.loadAsync(`${asset}oak-${kind}.jpg`)
      if(disposed || signal.aborted) { texture.dispose(); throw new DOMException('Aborted','AbortError') }
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(12, 4)
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
      if(kind === 'color') texture.colorSpace = THREE.SRGBColorSpace
      extraTextures.push(texture)
      return texture
    }))
    if (disposed || signal.aborted) { textured.forEach(t=>t.dispose()); throw new DOMException('Aborted','AbortError') }
    const oak = new THREE.MeshStandardMaterial({ color: '#b7a080', map: floorMaps[0], normalMap: floorMaps[1], normalScale: new THREE.Vector2(.45,.45), roughnessMap: floorMaps[2], roughness: .78 })
    marble.map = textured[0]
    // Fine woven normal detail; a room photograph must never become upholstery.
    const weave=document.createElement('canvas');weave.width=128;weave.height=128
    const weaveContext=weave.getContext('2d'), pixels=weaveContext.createImageData(128,128)
    for(let y=0;y<128;y++)for(let x=0;x<128;x++){
      const at=(y*128+x)*4
      pixels.data[at]=128+Math.round(Math.sin(x*Math.PI/2)*17)
      pixels.data[at+1]=128+Math.round(Math.sin(y*Math.PI/2)*17)
      pixels.data[at+2]=250;pixels.data[at+3]=255
    }
    weaveContext.putImageData(pixels,0,0)
    const woven=new THREE.CanvasTexture(weave);woven.wrapS=woven.wrapT=THREE.RepeatWrapping;woven.repeat.set(18,18)
    extraTextures.push(woven);cream.normalMap=woven;cream.normalScale=new THREE.Vector2(.23,.23)
    function box(w,h,d,x,y,z,material,radius=0) {
      const mesh = new THREE.Mesh(radius ? new RoundedBoxGeometry(w,h,d,3,radius) : new THREE.BoxGeometry(w,h,d), material)
      mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true
      scene.add(mesh)
      return mesh
    }
    function cylinder(rt,rb,h,x,y,z,material) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,40),material)
      mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow=true;scene.add(mesh);return mesh
    }
    // Subtle local occlusion anchors furniture on constrained mobile renderers.
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128
    const shadowContext=shadowCanvas.getContext('2d'), gradient=shadowContext.createRadialGradient(64,64,10,64,64,64)
    gradient.addColorStop(0,'rgba(46,31,22,.34)');gradient.addColorStop(.5,'rgba(46,31,22,.17)');gradient.addColorStop(1,'rgba(46,31,22,0)')
    shadowContext.fillStyle=gradient;shadowContext.fillRect(0,0,128,128)
    const shadowTexture=new THREE.CanvasTexture(shadowCanvas);extraTextures.push(shadowTexture)
    for(const [x,z,w,d] of [[.4,4.5,2.6,1.5],[2.2,2.8,1.6,1.7],[.4,1.7,1.6,1.7],[19.9,4.5,2.6,1.5],[21.7,2.8,1.6,1.7],[19.9,1.7,1.6,1.7],[15.6,2.5,2.6,3.1],[25,3.9,1.7,1.7],[4,5.1,2.2,1.4]]){
      const contact=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false}))
      contact.rotation.x=-Math.PI/2;contact.position.set(x,.035,z);scene.add(contact)
    }
    // Architectural shell: a single open gallery, with a clear circulation band at z=6–8m.
    box(34,.12,12,12,-.07,2,oak)
    box(34,3.5,.15,12,1.7,-3.8,plaster)
    box(.15,3.5,12,-4.9,1.7,2,plaster)
    box(.15,3.5,12,28.9,1.7,2,plaster)
    box(34,.1,12,12,3.45,2,plaster).castShadow=false
    box(34,.07,.06,12,.04,-3.68,walnut)
    // Rebuilt walls support the source artwork and joinery while preserving the
    // uninterrupted gallery corridor behind the room entrances.
    for(const offset of [0,19.5]) {
      box(5.65,3.4,.12,.3+offset,1.68,.42,plaster)
      box(.12,3.4,4.9,-2.54+offset,1.68,2.86,plaster)
      box(.12,3.4,4.9,3.12+offset,1.68,2.86,plaster)
    }
    box(.1,3.35,5.4,7.25,1.65,.25,plaster)
    for (const x of [-3,4,12,20,28]) {
      box(.075,3.4,.09,x,1.7,-3.64,brass)
      box(.075,3.4,.09,x,1.7,7.9,walnut)
    }
    // Remove the source shell; detailed imported furniture stays in real-world scale.
    const stripped = /(?:^|_)(Walls|Floor|Ceiling|Window|WindowFrame|WindowLock|Blinds|Blind.*|Radiator.*|Skirting|WallSocket|Socket|diffuse.*)$/i
    function prepare(root, kitchenMode=false) {
      root.traverse(o => {
        if (!o.isMesh) return
        if (stripped.test(o.name) || /area_light|_diffuse_/.test(o.name)) o.visible=false
        o.castShadow=true; o.receiveShadow=true
        const mats=Array.isArray(o.material)?o.material:[o.material]
        mats.forEach(m=>{
          if (/Walls|WhitePaint|CupboardUnits/.test(m.name)) m.color.set(kitchenMode?'#b7aa93':'#e5d8c6')
          if (/SofaLeather/.test(m.name)) { m.color.set('#b9a68c');m.roughness=.87;m.clearcoat=0 }
          if (/Cushion/.test(m.name)) { m.color.set('#92758a');m.roughness=.95 }
          if (/Floor/.test(m.name)) m.roughness=.8
          if (m.isMeshPhysicalMaterial && m.transmission>.4) { m.transmission=.15;m.opacity=.35;m.transparent=true }
          m.envMapIntensity=.6
        })
      })
    }
    prepare(living)
    scene.add(living)
    prepare(kitchen,true)
    kitchen.position.set(9.8,0,0)
    scene.add(kitchen)
    // A second seating composition reuses detailed source meshes, not box furniture.
    const lounge=living.clone(true)
    lounge.position.x=19.5
    scene.add(lounge)
    // The imported upholstered bed retains its proportions and detailed bedding.
    const bounds=new THREE.Box3().setFromObject(bed), size=bounds.getSize(new THREE.Vector3())
    bed.scale.setScalar(2.5 / Math.max(size.x,size.z))
    const fit=new THREE.Box3().setFromObject(bed), center=fit.getCenter(new THREE.Vector3())
    bed.position.set(15.6-center.x,-fit.min.y+.025,2.5-center.z)
    bed.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}})
    scene.add(bed)
    box(3.2,2.6,.13,15.6,1.32,.7,cream,.05)
    box(3.7,.025,3.8,15.6,.018,2.6,cream,.012)
    // Joinery, fluted walnut screens, a material library and architectural lighting.
    for(const x of [13.7,17.5]) {
      box(.55,.42,.5,x,.22,1.35,walnut,.025)
      cylinder(.12,.14,.22,x,.56,1.35,marble)
      cylinder(.19,.11,.2,x,.77,1.35,cream)
    }
    for(const base of [5.4,13,23]) for(let i=0;i<16;i++) box(.035,2.9,.055,base+i*.065,1.48,-3.65,walnut)
    // Rounded work surfaces and solid brass supports.
    for(const [x,z,w] of [[4,5.1,1.7],[25,2.7,2.4]]) {
      box(w,.065,.9,x,.86,z,walnut,.035)
      for(const dx of [-w*.35,w*.35]) cylinder(.035,.035,.82,x+dx,.42,z,brass)
    }
    // Planning drawing: a purpose-made editable floor plan rendered as a texture.
    const drawing=document.createElement('canvas');drawing.width=1024;drawing.height=640
    const ctx=drawing.getContext('2d');ctx.fillStyle='#f0e9dd';ctx.fillRect(0,0,1024,640)
    ctx.strokeStyle='#675261';ctx.lineWidth=5;ctx.strokeRect(100,95,820,440)
    ctx.beginPath();ctx.moveTo(490,95);ctx.lineTo(490,535);ctx.moveTo(490,310);ctx.lineTo(920,310);ctx.stroke()
    ctx.lineWidth=2;for(const [x,y,w,h] of [[150,150,230,110],[160,360,210,100],[540,150,250,90],[570,360,200,110]])ctx.strokeRect(x,y,w,h)
    ctx.fillStyle='#675261';ctx.font='20px sans-serif';ctx.fillText('SPATIAL STUDY / 01',100,590)
    const plan=new THREE.CanvasTexture(drawing);plan.colorSpace=THREE.SRGBColorSpace;extraTextures.push(plan)
    const planMesh=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.8),new THREE.MeshStandardMaterial({map:plan,roughness:1}))
    planMesh.rotation.x=-Math.PI/2;planMesh.position.set(4,.898,5.1);scene.add(planMesh)
    box(1.7,.06,.8,5.65,1.02,4.3,plaster,.02)
    for(const x of [5.05,6.25])cylinder(.027,.027,1,x,.5,4.3,brass)
    for(let i=0;i<5;i++) box(.25,.025,.49,5.06+i*.3,1.065,4.3,[walnut,marble,cream,plum,brass][i],.01)
    // Office lounge chair from the detailed model, with a slim workstation behind.
    living.updateMatrixWorld(true)
    const cloneInWorld = object => {
      const clone=object.clone()
      object.matrixWorld.decompose(clone.position,clone.quaternion,clone.scale)
      return clone
    }
    const officeChair=new THREE.Group()
    living.traverse(o=>{if(o.isMesh&&/^(63|64|65)_/.test(o.name))officeChair.add(cloneInWorld(o))})
    officeChair.position.set(24.4,0,2.2);scene.add(officeChair)
    box(2.2,.04,.55,25,1.35,-3.55,walnut)
    for(const x of [24.4,25,25.6])box(.32,.45,.3,x,.25,-3.4,plum,.02)
    // Recompose the imported monitor and books at workstation scale.
    function prop(pattern,width,x,y,z,rotation=0){
      const group=new THREE.Group()
      living.traverse(o=>{if(o.isMesh&&pattern.test(o.name))group.add(cloneInWorld(o))})
      group.rotation.y=rotation
      const bounds=new THREE.Box3().setFromObject(group), size=bounds.getSize(new THREE.Vector3())
      if(!Number.isFinite(size.x)||!size.x)return
      group.scale.setScalar(width/Math.max(size.x,size.y,size.z))
      const fit=new THREE.Box3().setFromObject(group),center=fit.getCenter(new THREE.Vector3())
      group.position.set(x-center.x,y-fit.min.y,z-center.z);scene.add(group)
    }
    prop(/^(60|61)_/,.65,25,1.1,2.45,-Math.PI/2)
    cylinder(.075,.09,.2,25,.99,2.45,brass)
    box(.4,.02,.2,25,.9,2.45,walnut,.01)
    prop(/^(36|37|38|39)_/,.35,24.2,.9,2.6)
    for(const x of [5.5,15.6,25]) {
      cylinder(.012,.012,1,x,2.8,2.2,brass)
      cylinder(.4,.12,.22,x,2.2,2.2,cream)
      cylinder(.32,.32,.015,x,2.08,2.2,glow)
    }
    // Continuous concealed uplight emphasises the length of the gallery.
    box(33,.025,.045,12,3.28,-3.62,glow).castShadow=false
    const wireMaterial = new THREE.MeshBasicMaterial({color:'#8c6b87',wireframe:true,transparent:true,opacity:.32})
    retainedMaterials.add(wireMaterial)
    const wireBed=bed.clone(true)
    wireBed.traverse(o=>{if(o.isMesh){o.material=wireMaterial;o.castShadow=false}})
    wireBed.visible=false
    scene.add(wireBed)
    const bedMaterials=new Set()
    bed.traverse(o=>{if(o.isMesh) for(const m of Array.isArray(o.material)?o.material:[o.material])bedMaterials.add(m)})
    // Desktop ambient occlusion adds depth at joints and contact points. Mobile
    // retains the cheaper direct renderer and the same camera choreography.
    if(innerWidth>=900){
      composer=new EffectComposer(renderer)
      composer.setPixelRatio(1)
      composer.addPass(new RenderPass(scene,camera))
      const ao=new SSAOPass(scene,camera,host.clientWidth,host.clientHeight,16)
      ao.kernelRadius=.3;ao.minDistance=.001;ao.maxDistance=.18
      composer.addPass(ao);composer.addPass(new OutputPass())
    }
    const runtime = {
      resize() {
        if(disposed)return
        const width=host.clientWidth, height=host.clientHeight
        renderer.setSize(width,height,false);camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix()
        composer?.setSize(width,height)
      },
      update(progress, { render = true } = {}) {
        if(disposed)return
        applyInteriorCamera(camera,progress)
        // The return pass reveals a wireframe study that resolves into the same furnished space.
        const distance=Math.abs(progress-9/11)/.055
        const wire=distance<1?Math.pow(1-distance*distance,2):0
        wireBed.visible=wire>.001
        wireMaterial.opacity=wire*.65
        bedMaterials.forEach(m=>{
          const transparent=wire>.001
          if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true}
          m.opacity=1-wire*.86
        })
        const lighting=1+Math.exp(-Math.pow((progress-8/11)*22,2))*.6
        ambientPanels.forEach(l=>{l.intensity=1.8*lighting})
        if(render){if(composer&&camera.aspect>=1){composer.render()}else renderer.render(scene,camera)}
      },
      dispose:teardown,
    }
    runtime.resize();runtime.update(0);onProgress(100)
    return runtime
  } catch(error) { teardown(); throw error }
}


