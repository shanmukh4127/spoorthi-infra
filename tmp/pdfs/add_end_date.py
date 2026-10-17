from pathlib import Path
from io import BytesIO
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[2]
source = root / 'output/pdf/Spoorthi_Infra_Offer_Letter_Signed.pdf'
output = root / 'output/pdf/Spoorthi_Infra_Offer_Letter_Signed_With_End_Date.pdf'
reader = PdfReader(source)
page = reader.pages[0]
height = float(page.mediabox.height)
buffer = BytesIO()
c = canvas.Canvas(buffer, pagesize=(float(page.mediabox.width), height))
c.setFillColorRGB(0.333333, 0.333333, 0.333333)
c.setFont('Helvetica-Bold', 8)
c.drawString(181, height - 208.5512, 'End Date')
c.setFont('Helvetica', 8)
c.drawString(181, height - 218.5512, '01-oct-2026')
c.save()
buffer.seek(0)
page.merge_page(PdfReader(buffer).pages[0])
writer = PdfWriter()
for page in reader.pages:
    writer.add_page(page)
with output.open('wb') as stream:
    writer.write(stream)
text = PdfReader(output).pages[0].extract_text()
assert all(value in text for value in ['Start Date', '01-sep-2026', 'End Date', '01-oct-2026'])
pdfium.PdfDocument(str(output))[0].render(scale=2).to_pil().save(str(root / 'tmp/pdfs/final_end_date.png'))
print(output)
