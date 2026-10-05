from PIL import Image, ImageDraw
from pathlib import Path
import json
p=Path('docs/tejes-assets/qa');data=json.loads((p/'section-checks.json').read_text())
sheet=Image.new('RGB',(1680,1150),'#eee9e3');draw=ImageDraw.Draw(sheet)
for i,r in enumerate(data):
 im=Image.open(p/f'home-{r["width"]}.png');top=round(r['categories']['top']);h=round(r['categories']['height']);im=im.crop((0,top,im.width,top+h));im.thumbnail((275,1060));x=i*280;sheet.paste(im,(x,35));draw.text((x+8,8),str(r['width'])+'px room cards',fill='black')
sheet.save(p/'category-review.jpg',quality=95)
for f in p.glob('home-*.png'):
 Image.open(f).save(f.with_suffix('.webp'),'WEBP',quality=92,method=4)
