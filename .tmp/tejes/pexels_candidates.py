from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request
from PIL import Image, ImageDraw, ImageOps
ids=[28853352,6207822,7005270,8141971,6908555,11701110,8146212,7045908]
out=Path('.tmp/tejes/candidates')
out.mkdir(parents=True,exist_ok=True)
def get(i):
 p=out/f'pexels-{i}.jpg'
 if not p.exists():
  u=f'https://images.pexels.com/photos/{i}/pexels-photo-{i}.jpeg?cs=srgb&dl=pexels-artbovich-{i}.jpg&fm=jpg'
  req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0','Referer':'https://www.pexels.com/'})
  p.write_bytes(urllib.request.urlopen(req,timeout=45).read())
 print(i,Image.open(p).size)
def safe_get(i):
 try: get(i)
 except Exception as e: print('FAILED',i,str(e))
with ThreadPoolExecutor(max_workers=3) as pool: list(pool.map(safe_get,ids))
files=[(i,out/f'pexels-{i}.jpg') for i in ids if (out/f'pexels-{i}.jpg').exists()]
sheet=Image.new('RGB',(1400,((len(files)+2)//3)*340),'#eee9e3')
d=ImageDraw.Draw(sheet)
for n,(i,p) in enumerate(files):
 im=ImageOps.exif_transpose(Image.open(p)).convert('RGB')
 im.thumbnail((453,302))
 sheet.paste(im,((n%3)*466,(n//3)*340))
 d.text(((n%3)*466+5,(n//3)*340+308),str(i),fill='black')
sheet.save('.tmp/tejes/pexels-candidates-2.jpg',quality=95)
