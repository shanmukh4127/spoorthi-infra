from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
p=Path('C:/Users/Pardhu/.codex/generated_images/01a101ee-ec0c-74b2-9ecf-eb77862292e8')
names=['8792464e-ef72-4e1e-a6ec-b718181bfba2','7b0b15a7-3c04-4e04-9e76-6f289004f69c','38a4a5be-e6ad-4868-88c6-a3b0ab14f69c','58c66971-c1af-4a6e-aa1e-8150ebdeeb4f','488c77e9-cce6-409e-8a0d-82d21071717b','1b0a0f53-0229-4fea-b961-f4c6ad7f37aa','c4da1b39-1e4b-4b1f-b6d7-d30aa93fcd88','80533b3a-714d-4a05-8d8e-18aee3f30fbc']
s=Image.new('RGB',(1400,900),'#eee9e3');d=ImageDraw.Draw(s)
for i,(name,label) in enumerate(zip(names,['wood','marble','fabric','stone','glass','metal','lighting','surface'])):
 im=Image.open(p/f'exec-{name}.png');print(label,im.size);im.thumbnail((450,250));s.paste(im,((i%3)*466,(i//3)*300));d.text(((i%3)*466+5,(i//3)*300+260),label,fill='black')
s.save('.tmp/tejes/material-review.jpg',quality=95)
