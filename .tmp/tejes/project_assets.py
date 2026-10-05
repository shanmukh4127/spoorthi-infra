from pathlib import Path
from PIL import Image, ImageDraw
import json
source=Path('.tmp/tejes/candidates/pexels-7587858.jpg')
out=Path('public/assets/tejes/projects');out.mkdir(parents=True,exist_ok=True)
original=Image.open(source).convert('RGB')
crops={
 'architecture-light':(2100,0,6200,2300),
 'living-detail':(0,1800,3350,4800),
 'spatial-detail':(0,800,4200,4900),
 'stone-detail':(1900,2500,6600,4600),
 'window-detail':(4200,1000,7360,3600),
 'timber-detail':(0,2850,3200,4900),
 'milestone-view':(700,1000,7360,4912),
}
manifest={}
for name,box in crops.items():
 im=original.crop(box);cap=min(2560,im.width);variants=[]
 for width in sorted(set([w for w in [480,800,1280,1600,1920,2560] if w<=cap]+[cap])):
  height=round(im.height*width/im.width);target=out/f'{name}-{width}.webp'
  im.resize((width,height),Image.Resampling.LANCZOS).save(target,'WEBP',quality=90,method=5)
  variants.append({'src':f'/assets/tejes/projects/{target.name}','width':width,'height':height,'bytes':target.stat().st_size})
 largest=variants[-1]
 manifest[name]={**largest,'srcSet':', '.join(f"{v['src']} {v['width']}w" for v in variants),'focalPoint':'50% 50%','native':[im.width,im.height],'originalNative':list(original.size),'crop':list(box),'source':'https://www.pexels.com/photo/a-marble-top-with-chairs-near-the-living-room-7587858/','credit':'Max Vakhtbovych','license':'https://www.pexels.com/license/','status':'Illustrative licensed photograph, not a Tejes client project','variants':variants}
 assert im.width>=1600 and largest['width']>=1600
Path('src/data/tejes/projectAssets.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
sheet=Image.new('RGB',(1400,1000),'#f2ece4');d=ImageDraw.Draw(sheet)
for n,(name,box) in enumerate(crops.items()):
 im=original.crop(box);im.thumbnail((450,270));x=(n%3)*466;y=(n//3)*330;sheet.paste(im,(x,y));d.text((x+5,y+280),name,fill='#493846')
sheet.save('.tmp/tejes/project-assets-review.jpg',quality=95)
print('Exported',len(manifest),'purposeful native-resolution project details.')
