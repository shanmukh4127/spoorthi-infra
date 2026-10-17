from pathlib import Path
from io import BytesIO
import numpy as np
from PIL import Image, ImageFilter
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, TextStringObject
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[2]
source = root / 'output/pdf/Spoorthi_Infra_Offer_Letter_Signed_Final.pdf'
output = root / 'output/pdf/Spoorthi_Infra_Offer_Letter_Mohammed_Khaja_Taqi.pdf'
writer = PdfWriter(clone_from=str(source))
page = writer.pages[0]
contents = ContentStream(page.get_contents(), writer)
old_name = 'ELASARAPU SHANMUKHA SAI'
new_name = 'MOHAMMED KHAJA TAQI'
count = 0
images = [str(operands[0]) for operands, operator in contents.operations if operator == b'Do']
assert len(images) == 3
operations = []
for operands, operator in contents.operations:
    if operator == b'Tj' and old_name in str(operands[0]):
        operands[0] = TextStringObject(str(operands[0]).replace(old_name, new_name))
        count += 1
    if operator == b'Do' and str(operands[0]) == images[-1]:
        continue
    operations.append((operands, operator))
assert count == 3
contents.operations = operations
page.replace_contents(contents)

photo = Image.open(r'C:\Users\HP\AppData\Local\Temp\codex-clipboard-649ed217-10b2-4d68-959f-9f72910cc045.jpg').convert('RGB').crop((195, 595, 800, 880))
gray = photo.convert('L')
background = gray.filter(ImageFilter.GaussianBlur(14))
contrast = np.asarray(background).astype(float) - np.asarray(gray).astype(float)
alpha = np.clip((contrast - 13) * 255 / 65, 0, 255).astype('uint8')
yy, xx = np.where(alpha > 80)
rgba = np.zeros((photo.height, photo.width, 4), dtype='uint8')
rgba[:, :, :3] = (26, 29, 49)
rgba[:, :, 3] = alpha
signature = Image.fromarray(rgba).crop((max(0,xx.min()-4),max(0,yy.min()-4),min(photo.width,xx.max()+5),min(photo.height,yy.max()+5)))
signature.save(root / 'tmp/pdfs/taqi_signature.png')
buffer = BytesIO()
height = float(page.mediabox.height)
c = canvas.Canvas(buffer, pagesize=(float(page.mediabox.width), height))
scale = min(115 / signature.width, 26 / signature.height)
w, h = signature.width * scale, signature.height * scale
c.drawImage(ImageReader(signature), 303.63782 + (124.544-w)/2, height-711-h/2, width=w, height=h, mask='auto')
c.save()
buffer.seek(0)
page.merge_page(PdfReader(buffer).pages[0])
with output.open('wb') as stream:
    writer.write(stream)
text = PdfReader(output).pages[0].extract_text()
assert old_name not in text and text.count(new_name) == 3
assert all(value in text for value in ['01-sep-2026','01-oct-2026','SI/INT/WDEV/2026-10'])
pdfium.PdfDocument(str(output))[0].render(scale=2).to_pil().save(str(root / 'tmp/pdfs/taqi_final.png'))
print(output)
