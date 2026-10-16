from pathlib import Path
from io import BytesIO
import numpy as np
from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, TextStringObject
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[2]
output = root/'output/pdf/Spoorthi_Infra_Offer_Letter_Kommu_Yogeshwar.pdf'
writer = PdfWriter(clone_from=str(root/'output/pdf/Spoorthi_Infra_Offer_Letter_Signed_Final.pdf'))
page = writer.pages[0]
contents = ContentStream(page.get_contents(), writer)
image_names = [str(o[0]) for o, op in contents.operations if op == b'Do']
assert len(image_names) == 3
name = 'KOMMU YOGESHWAR'
count = 0
ops = []
for operands, operator in contents.operations:
    if operator == b'Tj' and 'ELASARAPU SHANMUKHA SAI' in str(operands[0]):
        operands[0] = TextStringObject(str(operands[0]).replace('ELASARAPU SHANMUKHA SAI', name))
        count += 1
    if operator == b'Do' and str(operands[0]) == image_names[-1]:
        continue
    ops.append((operands, operator))
assert count == 3
contents.operations = ops
page.replace_contents(contents)
photo = Image.open(r'C:\Users\HP\OneDrive\Desktop\IMG_9676.jpg').convert('RGB')
photo = photo.crop((int(photo.width*.12),int(photo.height*.23),int(photo.width*.81),int(photo.height*.77)))
pixels = np.asarray(photo).astype(float)
blue = pixels[:,:,2] - pixels[:,:,0]
alpha = np.clip((blue-8)*12,0,255).astype('uint8')
yy,xx = np.where(alpha > 70)
rgba = np.zeros((photo.height,photo.width,4),dtype='uint8')
rgba[:,:,:3] = (43,30,100)
rgba[:,:,3] = alpha
sig = Image.fromarray(rgba).crop((max(0,xx.min()-5),max(0,yy.min()-5),min(photo.width,xx.max()+6),min(photo.height,yy.max()+6)))
buffer = BytesIO()
height = float(page.mediabox.height)
c = canvas.Canvas(buffer,pagesize=(float(page.mediabox.width),height))
scale = min(119/sig.width,26/sig.height)
w,h = sig.width*scale,sig.height*scale
c.drawImage(ImageReader(sig),303.63782+(124.544-w)/2,height-711-h/2,width=w,height=h,mask='auto')
c.save()
buffer.seek(0)
page.merge_page(PdfReader(buffer).pages[0])
with output.open('wb') as stream:
    writer.write(stream)
text = PdfReader(output).pages[0].extract_text()
assert text.count(name) == 3 and 'ELASARAPU' not in text
assert all(t in text for t in ['01-sep-2026','01-oct-2026'])
pdfium.PdfDocument(str(output))[0].render(scale=2).to_pil().save(str(root/'tmp/pdfs/yogeshwar_final.png'))
print(output)
