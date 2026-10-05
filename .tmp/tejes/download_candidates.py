from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request
from PIL import Image, ImageDraw, ImageOps

out=Path('.tmp/tejes/candidates')
out.mkdir(parents=True,exist_ok=True)
candidates={
 'living-goodlife':'https://images.unsplash.com/photo-1771888703723-01d85da1dae1',
 'living-parth':'https://images.unsplash.com/photo-1771577067936-680c2f795e5f',
 'living-abaddy':'https://images.unsplash.com/photo-1767720580810-58be50f89bf8',
 'kitchen-zac':'https://images.unsplash.com/photo-1682888813788-373f947aacb3',
}
def get(item):
 name,url=item
 path=out/f'{name}.jpg'
 if not path.exists(): urllib.request.urlretrieve(url,path)
 im=Image.open(path)
 print(name,im.size,path.stat().st_size)
with ThreadPoolExecutor(max_workers=4) as pool: list(pool.map(get,candidates.items()))
sheet=Image.new('RGB',(1400,940),'#eee9e3')
d=ImageDraw.Draw(sheet)
for i,name in enumerate(candidates):
 im=ImageOps.exif_transpose(Image.open(out/f'{name}.jpg')).convert('RGB')
 im.thumbnail((690,430))
 sheet.paste(im,((i%2)*700,(i//2)*470))
 d.text(((i%2)*700+8,(i//2)*470+442),name,fill='black')
sheet.save('.tmp/tejes/candidates.jpg',quality=95)
