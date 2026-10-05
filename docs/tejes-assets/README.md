# Tejes Interiors homepage visual assets

This asset system is scoped to `/tejes`. Spoorthi Infra and other pages retain their existing images.

## Review and provenance

Open [asset-review.html](asset-review.html) for the section-by-section visual selection, or [asset-review.jpg](asset-review.jpg) for the contact sheet. [asset-manifest.json](asset-manifest.json) records native dimensions, responsive exports, source pages, credits, file sizes and replacement status.

All licensed interior images are illustrative interior imagery. They are not evidence of Tejes projects, clients, awards or professional experience. Sources are from [Pexels](https://www.pexels.com/license/), whose license permits website use. Image credits: Max Vakhtbovych and S3T Koncepts. Credit and source details are retained for each image.

Eight material samples were generated using the built-in image-generation tool. Exact prompts are in [generation-prompts.json](generation-prompts.json). Their native size is 1672 × 941; they are used for small material cards, never as large backgrounds. The generated living-room concept is reserved for the visualization card and was rejected for the hero because it did not meet the large-image resolution requirement.

## Placement decisions

| Section | Asset | Purpose |
|---|---|---|
| Hero | hero-living | Strongest neutral sculptural living-room composition; native 2560 × 1707, exported 2560 × 1440 |
| About | about-interior | Real architectural volume, glazing, stone and natural light |
| Founder | founder-reference.svg | Explicit portrait placeholder; replace with an approved founder photograph |
| Achievements | achievement-still-life | Vase, botanical arrangement and lighting detail; no invented statistics |
| Philosophy | philosophy-light | Spatial divisions, glass and restrained architectural geometry |
| Categories | category-* | Ten distinct room photographs; every subject corresponds to its category |
| Services | No photograph | Text and service icons carry this band |
| Process | process-interior | A complete daylight residential space supporting the progression of work |
| Quality | quality-interior | Chair, joinery and styling detail |
| Featured design study | featured-residence | Garden-facing architectural residence with stone, timber and glazing |
| Design journey | development-* | Editable vector plan, wireframe and VR placeholders; generated visualization concept |
| Materials | material-* | Eight dedicated finish studies, each depicting its named material |
| Reviews | No photograph | Unverified review placeholders have no random supporting image |
| Final invitation | final-living | Intimate seating composition with greenery |
| Contact | contact-detail | Refined furniture and architectural lighting |

## Resolution and delivery

- Original licensed interior images are 2560–7360 pixels wide. Large exported masters are 2560 or 3200 pixels wide and exceed 1920 × 1080.
- Room card masters are 3200 × 2133. Material masters retain their native 1672 × 941 ratio.
- Responsive WebP variants use widths 320, 480, 800, 1280, 1600, 1920, 2560 and 3200 where supported by the original. No source is enlarged.
- Hero uses a 16:9 crop; editorial and room assets use 3:2. CSS `object-fit: cover` crops displayed frames without distorting objects.
- Below-the-fold photography loads lazily. Only the primary hero is eager and high priority.
- Vector placeholders remain sharp at any display size. They are clearly documented as replacement slots, not camera photographs or actual client deliverables.
- Reference screenshot crops are not approved production photography. The wordmark is recreated as a sharp, replaceable SVG.

To replace an image, export the same responsive filenames at the documented dimensions, update its native dimensions, credit, source and status in the manifest, and verify desktop/mobile crops. A real founder portrait and real project documents should replace the reserved placeholders when available.
