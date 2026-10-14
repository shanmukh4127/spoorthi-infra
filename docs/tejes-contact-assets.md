# Tejes Contact imagery

Generated with the built-in imagegen tool. These are architectural visual studies, not photographs of a verified Tejes client project or studio. The studio image is explicitly captioned as a replaceable concept on the page.

Final responsive files: `public/assets/tejes/contact/hero-*.webp`, `detail-*.webp`, and `studio-*.webp`. Native hero: 1672 × 941; native detail and studio: 1024 × 1536. Smaller variants are downscaled only; no output is enlarged. The requested larger dimensions were not returned by the generator. Approved higher-resolution photography can replace these files through `src/data/tejes/contactAssets.json`.

Original generated PNGs remain in the Codex generated-images directory. WebP versions use quality 89 with responsive source sets. The hero loads eagerly; supporting images load lazily. The closing section reuses the existing licensed `contact-detail` photograph and its responsive sources.

## Final prompt set

### Hero

Use case: photorealistic-natural. Asset type: premium interior studio website contact hero photograph, wide 2560x1440 composition. A sophisticated modern residential living room at late afternoon: ivory linen sofa, low round dark stone coffee table with a ceramic vase and restrained botanical branches, walnut wall panels, fine bronze lighting, floor-to-ceiling glass toward a distant green landscape. Camera at eye level, 28mm architectural lens, room occupies right two-thirds with visible furniture and window, quiet stone wall to left. Realistic natural golden light, sharp joinery, straight architectural verticals, believable proportions and materials, commercial architectural photography quality. No people, no text, no logos, no watermark, no UI. Avoid impossible architecture, distorted furniture, plastic textures, excessive blur or stylization.

### Editorial detail

Use case: photorealistic-natural. Asset type: vertical editorial detail photograph for premium interior design contact page, 1600px or greater width. A quiet sophisticated interior corner: richly grained walnut vertical wall panels, warm dark stone side table, elegant small linen-shade table lamp, a matte ceramic vase with delicate olive branches. Generous dark wall area in upper left for a short text overlay. Floor and shadow visible at bottom, realistic late afternoon light from side, restrained luxury styling, tactile stone and timber, sharp detail, straight perspective. Professional commercial architectural photography, portrait 2:3 composition. No people, no writing, no logo, no watermark, no UI. Avoid blurry details or malformed objects.

### Studio placeholder

Use case: photorealistic-natural. Asset type: architectural mood image used as clearly identified replaceable studio-photo placeholder, portrait composition at least 1600px wide. A refined unbranded boutique interior-design studio entrance with pale travertine walls, dark bronze-framed glass door, warm light from inside, a narrow timber screen and two lush planted pots. Inviting courtyard at golden hour, polished yet authentic architectural photography with realistic stone joints, clean straight architecture, crisp foliage and natural shadow. No signs, no names, no logos, no address, no people, no cars, no watermark, no UI. Must feel like a plausible architectural concept, not a real identified business.

## Client information pending

Confirmed Tejes phone, email, address, hours, social profiles, map link and actual studio photography are still required. Editable fields are in `src/data/tejes/contactPage.js`. The existing generic/shared email was not treated as a verified Tejes business address. No map or directions link is shown until a confirmed address and map URL are supplied.

The enquiry form currently creates a draft in component memory. It neither sends nor saves an enquiry to a backend. `createContactEnquiryPayload` provides the future delivery-adapter boundary.
