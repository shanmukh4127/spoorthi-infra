from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
root=Path('docs/tejes-cinematic-qa/house')
for width in (1440,1024,390,375):
 w,h=(360,250) if width>600 else (195,422)
 sheet=Image.new('RGB',(w*4,(h+24)*3),'#e8e0d6');draw=ImageDraw.Draw(sheet)
 for index in range(12):
  image=Image.open(root/f'{width}-chapter-{index+1:02}.png').convert('RGB').resize((w,h))
  x=index%4*w;y=index//4*(h+24);sheet.paste(image,(x,y));draw.text((x+10,y+h+5),f'{index+1:02}  /  12',fill='#4d314b')
 sheet.save(root/f'{width}-all-chapters.jpg',quality=90)
