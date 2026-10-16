from pathlib import Path
from io import BytesIO
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ContentStream, TextStringObject
from reportlab.pdfgen import canvas
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[2]
source = root / 'output/pdf/Spoorthi_Infra_Offer_Letter_Signed_With_End_Date.pdf'
output = root / 'output/pdf/Spoorthi_Infra_Offer_Letter_Signed_Final.pdf'
writer = PdfWriter(clone_from=str(source))
page = writer.pages[0]
contents = ContentStream(page.get_contents(), writer)
targets = {'REFERENCE', 'SI/INT/WDEV/2026-10', 'End Date', '01-oct-2026'}
removed = set()
for operands, operator in contents.operations:
    if operator == b'Tj' and str(operands[0]) in targets:
        removed.add(str(operands[0]))
        operands[0] = TextStringObject('')
assert removed == targets
page.replace_contents(contents)
width, height = float(page.mediabox.width), float(page.mediabox.height)
buffer = BytesIO()
c = canvas.Canvas(buffer, pagesize=(width, height))
c.setFillColorRGB(0.333333, 0.333333, 0.333333)
for heading, value, alignment, x in [
    ('End Date', '01-oct-2026', 'center', width / 2),
    ('REFERENCE', 'SI/INT/WDEV/2026-10', 'right', width - 58.02362),
]:
    draw = c.drawCentredString if alignment == 'center' else c.drawRightString
    c.setFont('Helvetica-Bold', 8)
    draw(x, height - 208.5512, heading)
    c.setFont('Helvetica', 8)
    draw(x, height - 218.5512, value)
c.save()
buffer.seek(0)
page.merge_page(PdfReader(buffer).pages[0])
with output.open('wb') as stream:
    writer.write(stream)
text = PdfReader(output).pages[0].extract_text()
assert all(text.count(value) == 1 for value in targets)
pdfium.PdfDocument(str(output))[0].render(scale=2).to_pil().save(str(root / 'tmp/pdfs/final_aligned.png'))
print(output)
