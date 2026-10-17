from pathlib import Path
from io import BytesIO
import numpy as np
from PIL import Image
import pypdfium2 as pdfium
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, TextStringObject
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

root = Path(__file__).resolve().parents[2]
source = Path(r'C:\Users\HP\OneDrive\Desktop\Spoorthi_Infra_Offer_Letter_Elasarapu_Shanmukha_Sai_Professional.pdf')
output = root / 'output/pdf/Spoorthi_Infra_Offer_Letter_Signed.pdf'
output.parent.mkdir(parents=True, exist_ok=True)

def signature(image, crop):
    image = image.convert('RGB').crop(crop)
    pixels = np.asarray(image).astype(float)
    darkness = 255 - pixels.min(axis=2)
    mask = darkness > 65
    yy, xx = np.where(mask)
    bounds = (max(0, xx.min()-4), max(0, yy.min()-4), min(image.width, xx.max()+5), min(image.height, yy.max()+5))
    # Preserve the supplied strokes and ink color, with transparent paper.
    alpha = np.clip((darkness - 25) / 180 * 255, 0, 255).astype('uint8')
    rgba = np.dstack((pixels.astype('uint8'), alpha))
    return Image.fromarray(rgba).crop(bounds)

authorized = signature(Image.open(r'C:\Users\HP\OneDrive\Desktop\Authorized sign.jpeg'), (110, 170, 820, 540))
intern_page = pdfium.PdfDocument(r'C:\Users\HP\OneDrive\Desktop\shannu sign.pdf')[0].render(scale=3).to_pil()
intern = signature(intern_page, (140, 1110, 1620, 1400))
reader = PdfReader(source)
page = reader.pages[0]
contents = ContentStream(page.get_contents(), reader)
replacements = {'DATE': 'Start Date', '04 OCTOBER 2026': '01-sep-2026'}
changed = []
for operands, operator in contents.operations:
    if operator == b'Tj' and str(operands[0]) in replacements:
        old = str(operands[0])
        operands[0] = TextStringObject(replacements[old])
        changed.append(old)
assert set(changed) == set(replacements)
page.replace_contents(contents)
buffer = BytesIO()
width, height = float(page.mediabox.width), float(page.mediabox.height)
c = canvas.Canvas(buffer, pagesize=(width, height))
for image, x, center_y, max_width, max_height in [(authorized, 78, 711, 95, 25), (intern, 307, 711, 119, 24)]:
    scale = min(max_width/image.width, max_height/image.height)
    w, h = image.width*scale, image.height*scale
    c.drawImage(ImageReader(image), x, height-center_y-h/2, width=w, height=h, mask='auto')
c.save()
buffer.seek(0)
page.merge_page(PdfReader(buffer).pages[0])
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
with output.open('wb') as stream:
    writer.write(stream)
check = PdfReader(output)
assert 'Start Date' in check.pages[0].extract_text()
assert '01-sep-2026' in check.pages[0].extract_text()
assert '04 OCTOBER 2026' not in check.pages[0].extract_text()
pdfium.PdfDocument(str(output))[0].render(scale=2).to_pil().save(str(root/'tmp/pdfs/final.png'))
print(output)
