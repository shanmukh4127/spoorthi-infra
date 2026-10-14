# Tejes Contact implementation

Route: `/tejes/contact`.

The page follows the supplied cream/plum reference with a curved hero, handwritten-style enquiry anchor, a form/contact/editorial composition, studio imagery with a location placeholder, a photographic closing statement, and the existing Tejes footer.

## Files changed for this request

- `src/pages/tejes/ContactPage.jsx`
- `src/components/tejes/TejesContactEnquiryForm.jsx`
- `src/styles/tejes-contact.css`
- `src/data/tejes/contactPage.js`
- `src/data/tejes/contactAssets.json`
- `src/pages/tejes/ProjectsPage.jsx` — shared footer accepts an active-page prop; its Projects default and listing layout are unchanged.
- `docs/tejes-contact-assets.md` — saved asset paths, native dimensions, built-in imagegen provenance and full prompt set.
- `docs/tejes-contact-implementation.md`
- `public/assets/tejes/contact/hero-480.webp`
- `public/assets/tejes/contact/hero-768.webp`
- `public/assets/tejes/contact/hero-1024.webp`
- `public/assets/tejes/contact/hero-1280.webp`
- `public/assets/tejes/contact/hero-1600.webp`
- `public/assets/tejes/contact/hero-1672.webp`
- `public/assets/tejes/contact/detail-480.webp`
- `public/assets/tejes/contact/detail-768.webp`
- `public/assets/tejes/contact/detail-1024.webp`
- `public/assets/tejes/contact/studio-480.webp`
- `public/assets/tejes/contact/studio-768.webp`
- `public/assets/tejes/contact/studio-1024.webp`

Existing work from earlier Projects tasks was preserved. No Tejes homepage, Services page or Spoorthi source was edited for this request.

## Verification

- Production build: passes. Vite emits a non-blocking warning for the app's single JavaScript bundle of approximately 511 kB before gzip (143 kB gzip). App-wide route splitting was kept outside the Contact scope.
- Lint: passes without warnings.
- Diff whitespace check: passes.
- Browser inspection at 1440, 1280, 1024, 768, 390 and 375 px: no document horizontal overflow; one Tejes header; intentional image crops.
- Required-field and email validation: checked in the browser; first invalid field receives focus.
- Indian 10-digit and formatted international phone validation: checked; phone is required for Phone call/WhatsApp contact and optional for Email contact.
- Project type, property type, location, service checkboxes, preferred contact method and message: exercised in the browser.
- Valid enquiry: produces an explicit local-draft message, moves focus to feedback and disables repeat preparation. Editing a field enables preparation again.
- Download: verified the generated text contains all selected fields and explicitly says it was not submitted.
- Menu: open and Escape-close checked on mobile.
- Footer: Projects navigation and return to Contact checked; Contact receives the current-page indicator.
- Form data was cleared after verification.

## Pending client information and backend

Confirmed Tejes phone, email, studio address, business hours, social profiles, map link and actual studio photography are still required. All business contact fields are editable in `src/data/tejes/contactPage.js` and currently null. The location panel has no invented address, real map or directions link.

The form currently prepares a draft in page memory and offers a download. It does not deliver or store enquiries. `createContactEnquiryPayload` is the boundary for a future backend adapter. The UI explains this before and after preparation.

The three new visuals are generated architectural studies. Actual native image sizes and replacement instructions are recorded in `docs/tejes-contact-assets.md`; no file is upscaled or described as 4K.
