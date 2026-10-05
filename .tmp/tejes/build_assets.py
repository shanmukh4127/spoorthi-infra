from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json, math

root=Path.cwd(); out=root/'public/assets/tejes/photography'; out.mkdir(parents=True,exist_ok=True)
docs=root/'docs/tejes-assets'; docs.mkdir(parents=True,exist_ok=True)
generated=Path('C:/Users/Pardhu/.codex/generated_images/01a101ee-ec0c-74b2-9ecf-eb77862292e8')
# role, original photo ID, source page slug, aspect, focal point
photos=[
 ('hero-living',28853352,'modern-luxury-living-room-with-elegant-decor',16/9,(.52,.52)),
 ('about-interior',8146212,'modern-kitchen-interior-design-with-tiles',3/2,(.55,.45)),
 ('achievement-still-life',6492393,'glass-vase-with-green-plants',3/2,(.5,.38)),
 ('philosophy-light',6436775,'bedroom-and-living-room-interiors-at-home',3/2,(.5,.5)),
 ('process-interior',7214171,'comfortable-sofa-placed-in-stylish-living-room',3/2,(.5,.5)),
 ('quality-interior',6758397,'black-leather-chair-near-decorative-shelving',3/2,(.5,.48)),
 ('featured-residence',7587858,'a-marble-top-with-chairs-near-the-living-room',3/2,(.52,.5)),
 ('final-living',5997979,'comfy-armchair-in-modern-living-room',3/2,(.5,.45)),
 ('contact-detail',7533758,'dining-table-in-contemporary-apartment',3/2,(.5,.45)),
 ('category-living',6207822,'luxury-living-room-with-modern-light-furniture',3/2,(.5,.5)),
 ('category-bedroom',7546724,'a-modern-design-bedroom-with-window-light-shining-inside',3/2,(.5,.5)),
 ('category-kitchen',6032398,'spacious-light-kitchen-in-modern-house',3/2,(.5,.55)),
 ('category-dining',7061670,'dining-zone-and-kitchen-in-mansion-with-panoramic-windows',3/2,(.5,.5)),
 ('category-bathroom',7045908,'contemporary-bathroom-with-minimalistic-interior',3/2,(.5,.5)),
 ('category-office',8082224,'modern-home-office-design',3/2,(.5,.5)),
 ('category-entertainment',7005270,'cozy-sofas-and-modern-tv-set-in-spacious-living-room',3/2,(.5,.5)),
 ('category-luxury',7546321,'luxury-living-room-interior-design',3/2,(.5,.5)),
 ('category-contemporary',6908555,'luxury-brown-sofa-near-wooden-furniture-of-modern-apartment',3/2,(.5,.5)),
 ('category-custom',6198662,'modern-dressing-room-with-vanity-table',3/2,(.5,.5)),
]
material_ids=dict(zip(['wood','marble','fabric','stone','glass','metal','lighting','surface'],['8792464e-ef72-4e1e-a6ec-b718181bfba2','7b0b15a7-3c04-4e04-9e76-6f289004f69c','38a4a5be-e6ad-4868-88c6-a3b0ab14f69c','58c66971-c1af-4a6e-aa1e-8150ebdeeb4f','488c77e9-cce6-409e-8a0d-82d21071717b','1b0a0f53-0229-4fea-b961-f4c6ad7f37aa','c4da1b39-1e4b-4b1f-b6d7-d30aa93fcd88','80533b3a-714d-4a05-8d8e-18aee3f30fbc']))
manifest={}; review=[]
def export(name,path,aspect,focal,kind,source,credit,maximum):
 im=ImageOps.exif_transpose(Image.open(path)).convert('RGB'); native=im.size
 # Crop at native scale; never enlarge. Preserve the full source for material masters.
 if aspect:
  cw=min(im.width,int(im.height*aspect)); ch=min(im.height,int(im.width/aspect))
  left=round((im.width-cw)*focal[0]); top=round((im.height-ch)*focal[1]); im=im.crop((left,top,left+cw,top+ch))
 cap=min(maximum,im.width); widths=sorted(set([w for w in [320,480,800,1280,1600,1920,2560,3200] if w<=cap]+[cap]))
 variants=[]
 for w in widths:
  size=(w,round(im.height*w/im.width)); dest=out/f'{name}-{w}.webp'
  scaled=im.resize(size,Image.Resampling.LANCZOS) if size!=im.size else im
  scaled.save(dest,'WEBP',quality=90,method=6)
  variants.append({'width':w,'height':size[1],'src':f'/assets/tejes/photography/{dest.name}','bytes':dest.stat().st_size})
 largest=variants[-1]
 assert largest['width']>=1600,(name,native)
 if kind=='licensed camera photograph': assert largest['width']>=1920 and largest['height']>=1080,(name,largest)
 manifest[name]={'src':largest['src'],'srcSet':', '.join(f"{v['src']} {v['width']}w" for v in variants),'width':largest['width'],'height':largest['height'],'native':list(native),'kind':kind,'source':source,'credit':credit,'focalPoint':'50% 50%','variants':variants,'status':'illustrative — not Tejes client work'}
 review.append((name,im,native,kind))
for name,i,slug,aspect,focal in photos:
 source=f'https://www.pexels.com/photo/{slug}-{i}/'
 export(name,root/f'.tmp/tejes/candidates/pexels-{i}.jpg',aspect,focal,'licensed camera photograph',source,'S3T Koncepts' if i==28853352 else 'Max Vakhtbovych',2560 if name=='hero-living' else 3200)
for material,id in material_ids.items():
 export(f'material-{material}',generated/f'exec-{id}.png',None,(.5,.5),'generated material sample','generation-prompts.json','Built-in image generation',1672)

# Honest, editable vector placeholders. No invented founder identity or fake project documents.
placeholder_dir=root/'public/assets/tejes/placeholders'; placeholder_dir.mkdir(parents=True,exist_ok=True)
base=lambda body:f'<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1600" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#e8e0d6"/>{body}</svg>'
line='fill="none" stroke="#987295" stroke-width="5"'
plan=f'<g {line}><path d="M240 150H960V650H240Z M540 150V440H960 M240 440H470 M540 540V650 M780 440V650"/><path d="M540 440A90 90 0 0 1 630 530 M540 440V530 M470 440A90 90 0 0 0 380 530"/><rect x="290" y="205" width="170" height="140"/><rect x="665" y="210" width="220" height="115"/><path d="M660 580H900 M280 575H435 M340 535V615"/></g>'
wire=f'<g {line}><path d="M260 555L600 730L950 530V240L610 65L260 255Z M260 255L600 435L950 240 M600 435V730 M610 65V350 M260 555L610 350L950 530"/><path d="M365 495L610 635L810 520L570 380Z M365 495V445L570 330L810 470V520 M570 330V380 M610 635V580 M365 445L610 580L810 470"/></g>'
vr=f'<g {line}><rect x="275" y="250" width="650" height="310" rx="105"/><path d="M275 365L155 330V475L275 455 M925 365L1045 330V475L925 455 M400 350H540V460H400Z M660 350H800V460H660Z M540 430L600 390L660 430"/><path d="M360 180Q600 95 840 180" stroke-dasharray="15 15"/></g>'
portrait='<rect x="150" y="90" width="900" height="640" fill="#ddd2c8"/><path d="M155 640L1040 170M155 730L1040 260" stroke="#eee6dc" stroke-width="45"/><circle cx="600" cy="265" r="95" fill="#b7a7ad"/><path d="M365 680V535Q370 380 600 380Q830 380 835 535V680Z" fill="#b7a7ad"/>'
for name,body in [('founder-reference',portrait),('development-plan',plan),('development-3d',wire),('development-vr',vr)]:
 dest=placeholder_dir/f'{name}.svg';dest.write_text(base(body),encoding='utf-8')
 manifest[name]={'src':f'/assets/tejes/placeholders/{dest.name}','width':2400,'height':1600,'kind':'editable vector placeholder','status':'replace with approved founder portrait' if name=='founder-reference' else 'replace with actual project document','focalPoint':'50% 50%'}
export('development-visual',generated/'exec-1b0530a4-a153-4be3-a8dd-dac81ff97fa6.png',None,(.5,.5),'generated design visualization','Original generated concept — rejected for hero resolution','Built-in image generation',1672)
(docs/'asset-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
(root/'src/data/tejes/homeAssets.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')

sheet=Image.new('RGB',(1600,math.ceil(len(review)/4)*330),'#f4eee8');d=ImageDraw.Draw(sheet)
for n,(name,im,native,kind) in enumerate(review):
 thumb=ImageOps.fit(im,(390,245),Image.Resampling.LANCZOS);x=(n%4)*400;y=(n//4)*330;sheet.paste(thumb,(x,y));d.text((x+8,y+255),name,fill='#593054');d.text((x+8,y+275),f'Native {native[0]} x {native[1]}',fill='#555');d.text((x+8,y+295),kind,fill='#555')
sheet.save(docs/'asset-review.jpg',quality=96)
html=['<!doctype html><meta charset="utf-8"><title>Tejes visual asset review</title><style>body{background:#f3eee8;color:#493846;font:15px Arial;padding:40px;margin:auto;max-width:1450px}h1{font:36px Georgia}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}article{background:#fcf9f4;padding:12px}img{width:100%;aspect-ratio:3/2;object-fit:cover}small{display:block;margin:8px 0}a{color:#773b78}</style><h1>Tejes Interiors · Visual asset map</h1><p>Licensed interiors are illustrative photography, not completed Tejes projects. Generated finish samples are identified. Portrait and project documents remain explicit, replaceable placeholders.</p><main>']
for name,a in manifest.items():
 html.append(f'<article><img src="../../public{a["src"]}" loading="lazy"><h3>{name}</h3><small>{a["kind"]} · {a["width"]} × {a["height"]}</small><small>{a["status"]}</small>'+ (f'<a href="{a["source"]}">{a.get("credit","Source")}</a>' if a.get('source','').startswith('https') else '')+'</article>')
html.append('</main>');(docs/'asset-review.html').write_text(''.join(html),encoding='utf-8')
print('Approved:',len(manifest),'assets. WebP bytes:',sum(p.stat().st_size for p in out.glob('*.webp')))
