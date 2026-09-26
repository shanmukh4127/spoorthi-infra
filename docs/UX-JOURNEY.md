# UX Journey

This document defines the shared user journey for the Spoorthi Infra and Tejes Interiors ecosystem. It is a UX contract for the existing React Router, brand layouts, navigation data, page data, state components, and future section composition. It does not define final visual design or copy.

## 1. Ecosystem Entry

The entry sequence is:

```text
Application loading screen → Gateway → Brand website → Exploration → Contact
```

The application loading screen is an independent entry experience. It must complete before the Gateway becomes available and must not be mixed with page-level content loading states.

At `/`, the user should immediately understand that the ecosystem contains two distinct practices. The Gateway introduces the distinction:

- Spoorthi Infra: construction, infrastructure, and engineering.
- Tejes Interiors: interior design, spatial design, and luxury interiors.

The user should have enough context to choose a practice without reading detailed service content. Selecting a brand navigates directly to `/spoorthi` or `/tejes`.

## Loading → Gateway → Brand Selection Journey

### 1. Loading Screen Entry

When a user first enters `/`, the application loading screen is the immediate entry experience. Its purpose is to establish a calm, intentional start while the application initializes and any entry-critical assets become available.

The loading screen should not attempt to explain the full business, present detailed service content, or ask the user to choose a brand before the Gateway is ready. It intentionally does not show internal navigation, project content, contact forms, or brand-specific page sections.

The Gateway becomes available only after the loading state is complete enough for the selection experience to function reliably. While loading is incomplete, Gateway panels are not interactive. If assets are slow to load, the user remains in an understandable loading state rather than seeing incomplete or misleading Gateway content. The application LoadingScreen remains separate from reusable content-level `LoadingState` components.

When loading completes, the loading screen yields to the neutral Gateway at `/`. The first meaningful user action is then choosing which practice best matches their intent.

### 2. Transition to Gateway

The Gateway becomes available as one complete decision point. The user should not need to wait for or navigate through additional setup screens after loading.

The transition establishes that:

1. The user is entering one shared design and built-environment ecosystem.
2. The ecosystem contains two distinct practices.
3. Each practice has a clear purpose and visual/content direction.
4. The user can choose a brand directly.

The user cannot meaningfully interact with the Gateway before loading completes. Once available, the first expected action is to inspect or focus one of the two brand choices and select it.

### 3. Gateway Information Hierarchy

The Gateway communicates information in this order:

1. This is one ecosystem: the neutral introduction establishes the relationship between Spoorthi Infra and Tejes Interiors.
2. There are two distinct brands: the two primary panels make the choice explicit.
3. What each brand does: each panel provides a name and short practice descriptor.
4. Which brand matches the user’s intent: the user compares construction/infrastructure/engineering with interior/spatial/luxury design.
5. How to enter: each panel provides a direct, understandable entry action.

#### Spoorthi Infra panel

- Brand name: Spoorthi Infra.
- Descriptor: Construction · Infrastructure · Engineering.
- Supporting information: a technical, structural, and built-environment practice.
- CTA/action: Enter Spoorthi Infra.
- Expected understanding: the user is entering the practice for construction, infrastructure, civil, or engineering-related needs.

#### Tejes Interiors panel

- Brand name: Tejes Interiors.
- Descriptor: Interior Design · Spatial Design · Luxury.
- Supporting information: a refined, spatial, and material-focused interiors practice.
- CTA/action: Enter Tejes Interiors.
- Expected understanding: the user is entering the practice for interior, spatial, luxury, or material-led design needs.

### 4. Brand Differentiation

Spoorthi Infra should communicate construction, infrastructure, engineering, and structural/technical confidence. Its panel should feel precise and grounded in the built environment.

Tejes Interiors should communicate interior design, spatial design, luxury, and a refined/material-focused experience. Its panel should feel considered and oriented toward the experience of space.

The Gateway gives both panels equivalent decision weight. Differentiation comes from practice, descriptor, supporting information, and brand treatment—not from making one brand appear secondary or treating one as the default.

### 5. Desktop Interaction

The expected desktop state sequence is:

```text
Idle → Hover or Focus → Selected → Navigation
```

- Idle: both panels are equally available and the ecosystem relationship is clear.
- Hover: the pointed-to panel receives stronger visual emphasis, approximately a 65/35 split; the other panel remains visible and understandable but becomes quieter.
- Focus: keyboard focus produces an equally clear emphasis and does not depend on pointer hover.
- Selected: the chosen panel is confirmed through its action and the user is taken directly to the selected brand.
- Navigation: the URL changes to the brand root and the corresponding brand layout takes over.

Hover emphasis should make the selected panel’s brand name, descriptor, and entry action easier to scan. The other panel should not disappear or become impossible to select.

Keyboard users encounter the panels in a logical Tab order, with Spoorthi Infra followed by Tejes Interiors or the order established by the final visual composition. Each focused panel must have a visible focus state. Enter activates the focused link; Space should provide an equivalent selection behavior where the interaction is implemented as a selectable panel. No panel should rely on pointer-only behavior.

### 6. Mobile Interaction

On mobile, the panels become vertically stacked in the same ecosystem order. Both brands remain visible as distinct, full-width choices within the page scroll.

- Panel order: Spoorthi Infra first, Tejes Interiors second, matching the established Gateway content order.
- Scroll behavior: the Gateway may scroll vertically when the viewport is short; no panel should be clipped or hidden.
- Tap behavior: tapping the panel’s explicit interactive area selects that brand; the whole panel may act as the link if the accessible name and focus behavior remain clear.
- Focus behavior: keyboard and assistive-technology focus moves through the two panels in order with visible focus.
- Selection confirmation: the panel’s label/action and immediate route change make the selection clear.
- Accidental taps: the selectable area should be deliberate and readable, with touch-sized controls and no competing controls layered over it.

The user should not need to open an extra mobile menu or complete an intermediate confirmation step to enter a brand.

### 7. Brand Selection

The exact selection journeys are:

```text
Gateway → User selects Spoorthi Infra → /spoorthi
Gateway → User selects Tejes Interiors → /tejes
```

Immediately after selection, the user should expect the selected brand’s Home page shell: brand identity, brand navigation, brand theme, page content foundation, and footer. The selected brand should not show the other brand’s internal navigation.

### 8. Back / Return Journey

The Gateway remains reachable through the browser history and the brand website’s normal navigation context. No additional Gateway route is invented.

- Browser Back from `/spoorthi` or `/tejes` returns to the Gateway when the user arrived there through selection.
- Direct visits to `/spoorthi` or `/tejes` open the relevant brand directly and do not force the user through the Gateway.
- Inner brand pages preserve the brand logo link to the brand Home route.
- Returning to the Gateway is primarily a browser-history action from a selected-brand visit; future navigation can add a neutral ecosystem switch only if a later UX decision requires it.
- Repeated Gateway selections replace the current decision with the newly selected brand and navigate directly to its root route.

### 9. Accessibility

The Gateway uses semantic interactive links for brand selection rather than clickable non-interactive containers. Users must be able to Tab between the two choices, identify the focused choice, and activate it with the keyboard.

Each panel’s accessible name communicates the brand and entry action. The visible brand name and descriptor provide screen-reader context without requiring hover. Focus styles remain visible and do not rely only on color. Reduced-motion users receive the same information and direct navigation without requiring emphasis transitions.

The loading screen communicates that the application is loading without pretending that the Gateway is available. Once the Gateway is available, it exposes the two choices through normal semantic navigation. The Gateway remains separate from the internal brand header/footer architecture.

### 10. Edge Cases

- Slow initial load: retain an understandable loading state; do not expose incomplete Gateway controls.
- Asset loading delay: keep the Gateway decision available only when its essential content and controls are ready; non-essential visual assets must not obscure the choice.
- User refresh: refresh `/` into the loading-to-Gateway entry sequence; refresh `/spoorthi` or `/tejes` directly into that brand route.
- Direct `/spoorthi` access: skip the Gateway and show Spoorthi’s brand shell and Home route.
- Direct `/tejes` access: skip the Gateway and show Tejes’ brand shell and Home route.
- Browser Back from a brand page: return to the prior route, normally the Gateway if selection began there.
- Repeated Gateway selection: allow a new selection and navigate to the newly chosen brand without a duplicate confirmation layer.
- Mobile orientation change: preserve both choices, allow normal vertical scrolling, and avoid clipped or unreachable panel actions.
- Reduced-motion preference: communicate hover/focus/selection through stable visual and semantic states without requiring motion.

### 11. UX Success Criteria

The Loading → Gateway → Brand Selection journey succeeds when:

- users understand that the page represents one ecosystem;
- users can identify two distinct brands;
- users can explain the basic purpose of each brand from the Gateway alone;
- either brand can be selected without confusion or unnecessary steps;
- keyboard users can complete selection without a pointer;
- mobile users can reach and select either panel easily;
- direct brand URLs remain usable;
- slow loading does not expose broken or misleading controls; and
- the selected brand opens directly at its own root route with the correct shell.

### 12. Do Not Overdesign

The Gateway is a decision point, not a content-heavy page. It should avoid excessive copy, unnecessary controls, extra confirmation steps, and unrelated service detail. The user should understand the distinction quickly and move directly from Gateway to the selected brand.

## 2. Gateway Journey

The Gateway is separate from both internal brand layouts. It has no internal brand header or footer.

1. The user arrives at `/`.
2. The Gateway presents two selectable brand panels.
3. Each panel communicates the brand name, practice category, and entry action.
4. Panels are reachable by keyboard and activate with normal link behavior.
5. Hover and focus may clarify the selected panel, but selection must not depend on hover.
6. The selected brand opens its root route with the appropriate brand layout, navigation, theme, and footer.

The Gateway owns only local interaction state such as hovered or focused panel. The URL becomes the source of truth after selection.

## 3. Spoorthi Infra Journey

The Spoorthi journey should establish technical confidence and explain the relationship between construction, infrastructure, engineering, and visual design.

Primary entry: `/spoorthi`

Primary exploration paths:

- `/spoorthi/civil-construction` for construction and engineering services.
- `/spoorthi/projects` for evidence of completed or selected work.
- `/spoorthi/design-3d` for the design-to-output workflow.
- `/spoorthi/vr` for immersive project understanding.
- `/spoorthi/contact` for project inquiries.

The primary CTA should lead to Contact and remain configurable through Spoorthi brand configuration. The Home page should answer what Spoorthi does, how it works, what outputs a client receives, and how to begin a conversation.

## 4. Tejes Interiors Journey

The Tejes journey should establish an elegant, spatial, and material-focused design practice.

Primary entry: `/tejes`

Primary exploration paths:

- `/tejes/interior-design` for interior design services.
- `/tejes/projects` for selected spaces and project exploration.
- `/tejes/design-3d` for spatial visualization and design development.
- `/tejes/vr` for immersive experience.
- `/tejes/contact` for consultations and project inquiries.

The primary CTA should lead to Contact and remain configurable through Tejes brand configuration. The Home page should answer what kind of spaces Tejes creates, how the design develops, and how a user can start a discussion.

## Home Page Journey

### 1. Home Page Primary Objective

Each Home page should let a first-time visitor understand, in one coherent scroll:

- who the brand is;
- what the brand does;
- what makes its experience distinctive;
- which services are available;
- how the work progresses;
- what kinds of projects the practice handles; and
- how to take the next step.

Both brands use the same structural sequence and separate content data. The Home pages are not collections of unrelated promotional blocks; each section answers the next natural user question.

```text
Hero → About → Services → 2D Design → 3D Design → Final Output
→ VR Experience → Projects → Process → Why Choose Us → CTA → Footer
```

### 2. Spoorthi Infra Home Journey

Spoorthi’s Home should feel professional, precise, structured, and technically credible. Its content should communicate construction, infrastructure, engineering, architecture, technical precision, and structural confidence without inventing claims.

| Section | User question | Information received | Confidence gained | Next action / continuation |
| --- | --- | --- | --- | --- |
| Hero | What does Spoorthi do? | Construction, infrastructure, engineering, and primary positioning | Immediate technical context | Explore Services or continue down the Home page |
| About | Who is the practice and how does it think? | `[REAL COMPANY DESCRIPTION REQUIRED]` and architectural/technical approach | Context without a long company history | Continue to Services |
| Services | What can Spoorthi do for me? | Configured service categories, led by Civil Construction | Clear understanding of available help | Open Civil Construction or continue to the design journey |
| 2D Design | How does technical planning begin? | `[REAL SERVICE DETAILS REQUIRED]` about 2D design | Understands the first design/output stage | Continue to 3D Design |
| 3D Design | How can I understand the proposed work? | `[REAL SERVICE DETAILS REQUIRED]` about 3D design | Sees how technical intent becomes visual/spatial understanding | Continue to Final Output or Design / 3D |
| Final Output | What does the work become? | `[REAL SERVICE DETAILS REQUIRED]` about final deliverables/execution | Understands the connection between design and result | Continue to VR or Projects |
| VR Experience | How can I experience the proposal? | VR purpose and future experience context | Understands VR as an extension of the design workflow | Open VR Experience or return to Projects |
| Projects | What evidence of work is available? | `[REAL PROJECT CONTENT REQUIRED]` | Builds confidence through relevant work | Explore Projects, related service, or Contact |
| Process | How does Spoorthi work? | Discovery → Design → Execution → Final result, using confirmed client content later | Understands the engagement progression | Continue to Why Choose Us |
| Why Choose Us | Why consider Spoorthi? | `[REAL DIFFERENTIATORS REQUIRED]` grounded in confirmed evidence | Reinforces technical confidence without generic claims | Continue to CTA |
| CTA | What should I do next? | Clear project inquiry invitation | Converts interest into a next step | Open `/spoorthi/contact` |
| Footer | Where can I go now? | Brand navigation, contact access, social/legal placeholders | Retains orientation | Navigate, return Home, or use Contact |

### 3. Tejes Interiors Home Journey

Tejes’ Home should feel elegant, spacious, refined, and spatial. Its content should communicate interior design, spatial design, luxury, craftsmanship, material understanding, and a considered design experience without inventing achievements or project facts.

| Section | User question | Information received | Confidence gained | Next action / continuation |
| --- | --- | --- | --- | --- |
| Hero | What kind of spaces does Tejes create? | Interior design, spatial design, luxury positioning | Immediate refined/spatial context | Explore Services or continue down the Home page |
| About | What is Tejes’ design point of view? | `[REAL COMPANY DESCRIPTION REQUIRED]` and spatial/material approach | Understands the practice beyond a visual impression | Continue to Services |
| Services | What can Tejes help design? | Configured interior, spatial, visualization, material, and execution categories | Identifies the relevant design path | Open Interior Design or continue to the design journey |
| 2D Design | How does a space begin to take shape? | `[REAL SERVICE DETAILS REQUIRED]` about planning and 2D design | Understands the foundation of the spatial proposal | Continue to 3D Design |
| 3D Design | How can I see the space before completion? | `[REAL SERVICE DETAILS REQUIRED]` about 3D visualization | Gains confidence in the spatial/material direction | Continue to Final Output or Design / 3D |
| Final Output | How does the design become a finished space? | `[REAL SERVICE DETAILS REQUIRED]` about final execution/output | Understands the bridge from concept to result | Continue to VR or Projects |
| VR Experience | How can I inhabit or preview the proposal? | VR purpose and future experience context | Sees VR as a refined layer of spatial understanding | Open VR Experience or return to Projects |
| Projects | What spaces and design outcomes can I explore? | `[REAL PROJECT CONTENT REQUIRED]` | Builds confidence through relevant work and craft | Explore Projects, related service, or Contact |
| Process | How does Tejes develop a space? | Discovery → Design → Execution → Final result, with confirmed content added later | Understands the path from brief to finished experience | Continue to Why Choose Us |
| Why Choose Us | Why consider Tejes? | `[REAL DIFFERENTIATORS REQUIRED]` grounded in craft/material/spatial evidence | Reinforces refinement without generic luxury claims | Continue to CTA |
| CTA | What should I do next? | Consultation or space-discussion invitation | Converts interest into a comfortable next step | Open `/tejes/contact` |
| Footer | Where can I go now? | Brand navigation, contact access, social/legal placeholders | Retains orientation | Navigate, return Home, or use Contact |

### 4. Hero Journey

The first 5–10 seconds should establish context quickly:

- Primary message: the brand’s practice and distinctive point of view.
- Supporting message: a concise explanation of the work, using `[REAL HERO COPY REQUIRED]` until approved content exists.
- Primary understanding: “I know whether this is the construction/infrastructure practice or the interior/spatial practice.”
- Primary CTA: continue to Services or begin the configured Contact journey.
- Secondary exploration: Projects or Design / 3D when appropriate.

The Hero should not communicate the entire service list, detailed company history, unsupported claims, or every possible CTA. It creates orientation; later sections provide depth.

### 5. About Journey

About follows Hero because the user first needs to know what the practice is before evaluating its context. It removes uncertainty around the brand’s role, approach, and point of view, then hands the user naturally to Services.

About should remain concise and use `[REAL COMPANY DESCRIPTION REQUIRED]` rather than a long history, invented credentials, or unsupported claims. Its job is to provide enough trust/context for the user to ask, “What can this brand actually do for me?”

### 6. Services Journey

```text
About → Services → service selection → service detail → related design/process/contact
```

Services answers “What can this brand actually do for me?” Service cards or summaries should allow the user to identify a relevant category, then open the existing inner route where one exists.

- Spoorthi should make the Civil Construction path especially clear and connect it to infrastructure, engineering, design, and execution data when confirmed.
- Tejes should make the Interior Design path especially clear and connect it to spatial design, visualization, material/finish selection, and execution data when confirmed.

The service sequence should connect to Design / 3D, Projects, Process, and Contact rather than ending at a list.

### 7. Design Journey

The core value chain is one continuous story:

```text
2D Design → 3D Design → Final Output → VR Experience
```

- 2D appears first because it establishes the plan, drawing, or design foundation.
- 3D follows because it helps users understand the proposal spatially or technically.
- Final Output matters because it explains what the design becomes as a deliverable or execution reference.
- VR is the next experience layer because it lets the user understand the proposal more immersively after the underlying context is clear.

Each step should link or point to the next step and to the existing Design / 3D or VR routes. The four steps should not behave as isolated feature promotions.

### 8. Projects Journey

```text
Design / experience understanding → Projects → related service/design → Contact
```

Projects appear after the design/experience story so users can evaluate evidence with enough context to understand what they are seeing. Projects build confidence through relevant work, not through invented statistics or claims.

Project cards and future detail views consume the shared project data shape. A project journey should offer related service/design context and a clear route to the brand Contact page.

### 9. Process Journey

```text
Projects → Process → Discovery → Design → Execution → Final result
```

Process answers “How does this brand actually work?” It translates project evidence into a usable engagement model. The sequence must remain limited to confirmed client information; `[REAL PROCESS DETAILS REQUIRED]` is preferable to invented operational steps.

For both brands, Process should connect back to the 2D → 3D → Final → VR story where appropriate and lead naturally to Why Choose Us and Contact.

### 10. Why Choose Us Journey

Why Choose Us follows Process because users can evaluate differentiators more meaningfully after understanding the work and working sequence.

This section may contain confirmed qualities, evidence, approach, craftsmanship, technical rigor, or service characteristics. It must use `[REAL DIFFERENTIATORS REQUIRED]` until client evidence is available. It must not invent awards, certifications, statistics, clients, years of experience, or achievements.

Its purpose is to reinforce confidence and lead to the final CTA without generic claims or pressure.

### 11. CTA Journey

```text
Understanding → Trust → Interest → Contact
```

The final CTA should feel like a natural next step after the user has received enough context. The primary action is:

- Spoorthi: project inquiry via `/spoorthi/contact`.
- Tejes: consultation or space discussion via `/tejes/contact`.

A secondary option may return the user to Projects or Services when appropriate. The CTA should not replace the Contact page; it should provide a clear doorway into it.

### 12. Footer Journey

The Footer provides useful shortcuts without becoming a second full Home page. It should include:

- brand identity;
- configured navigation shortcuts;
- Contact access;
- social links as placeholders until supplied; and
- legal links/copyright placeholders where needed.

The Footer reinforces the current brand. Gateway/brand switching remains an intentional ecosystem-level action and is not silently mixed into every footer link.

### 13. Section-to-Section Continuity

The shared continuity is:

```text
Hero
→ “What do they do?”
→ About
→ “What can they offer?”
→ Services
→ “How do they visualize and complete the work?”
→ 2D → 3D → Final → VR
→ “What have they done?”
→ Projects
→ “How do they work?”
→ Process
→ “Why consider them?”
→ Why Choose Us
→ “What should I do next?”
→ CTA → Contact
```

Spoorthi expresses this continuity through technical precision, structural confidence, construction, infrastructure, and engineering context. Tejes expresses the same continuity through spatial thinking, craftsmanship, materials, luxury, and refined experience. The structure stays shared; the meaning and content remain brand-specific.

### 14. User Intents

| User intent | Most relevant section/page |
| --- | --- |
| “I want construction services.” | Spoorthi Services → `/spoorthi/civil-construction` |
| “I want interior design.” | Tejes Services → `/tejes/interior-design` |
| “I want to see previous work.” | Projects section → `/spoorthi/projects` or `/tejes/projects` |
| “I want to understand the design process.” | 2D → 3D → Final → VR, then Process |
| “I want to see 3D visualization.” | Design / 3D section/page |
| “I want to experience VR.” | VR Experience section/page |
| “I want to contact the company.” | Final CTA or brand Contact page |

No new routes are required for these intents.

### 15. Home Page Exit Points

Legitimate Home exits are:

- Service page: deeper understanding of a specific offering.
- Projects: evidence and project exploration.
- Design / 3D: more detail on the design workflow.
- VR: immersive experience context.
- Contact: conversion or inquiry.
- Other brand navigation: only through an intentional ecosystem-level brand switch if introduced later.

Each exit exists because it answers a distinct next question; none should be added merely to increase interaction.

### 16. Mobile Home Journey

Mobile preserves the same section order and meaning. Content priority should be:

1. clear brand context and Hero;
2. concise About and Services understanding;
3. the connected 2D → 3D → Final → VR progression;
4. Projects and Process for confidence;
5. Why Choose Us and a clearly reachable CTA.

The page should avoid long repeated explanations, excessive section intros, and project overload. The Header menu remains available, contextual CTAs remain touch-friendly, and the final CTA should appear without requiring users to return to the top. The mobile journey must allow users to reach Projects, VR, and Contact without unnecessary repetition.

### 17. Accessibility + UX

- Use one page-level H1, followed by section H2 headings and card/subsection H3 headings where needed.
- Preserve logical keyboard order through each section and CTA.
- Use meaningful link labels such as “Explore projects” or “Contact Spoorthi Infra,” not ambiguous “Click here.”
- Ensure CTA actions are discoverable without hover.
- Provide useful alt text for meaningful project/media images and empty alt text for decorative media.
- Keep the 2D → 3D → Final → VR journey understandable without animation.
- Preserve reduced-motion behavior and do not make hover the only way to discover content.

### 18. UX Success Criteria

The Home journey succeeds when:

- the user understands the brand quickly;
- the main services are identifiable;
- the 2D → 3D → Final → VR relationship is clear;
- projects are discoverable after the design/experience context;
- the Process section explains the engagement at a useful level;
- Contact is reachable without confusion or pressure;
- Spoorthi and Tejes feel structurally consistent but meaningfully distinct; and
- the full page reads as one coherent story.

### 19. Content Placeholders

Until client content is supplied, use explicit placeholders:

- `[REAL PROJECT CONTENT REQUIRED]`
- `[REAL COMPANY DESCRIPTION REQUIRED]`
- `[REAL SERVICE DETAILS REQUIRED]`
- `[REAL CONTACT INFORMATION REQUIRED]`
- `[REAL HERO COPY REQUIRED]`
- `[REAL PROCESS DETAILS REQUIRED]`
- `[REAL DIFFERENTIATORS REQUIRED]`

No placeholder should be replaced with invented business facts, project names, statistics, awards, certifications, testimonials, or contact details.

## 6. Exploration Journey

From either Home page, the header and section CTAs support:

- Home → Services: understand capabilities and open the relevant service page.
- Home → Projects: review selected work and continue to project exploration.
- Home → Design / 3D: understand the visual development workflow.
- Home → VR: understand immersive review after the design/output context is clear.
- Home → Contact: begin an inquiry after enough context has been provided.

Every inner page keeps the brand logo linked to its brand Home route. Header navigation, footer navigation, browser back, and direct URLs all remain valid ways to return or move between related pages.

## 7. Conversion Journey

The intended conversion sequence is:

```text
Discovery → Understanding → Trust → Exploration → Interest → Contact
```

- Discovery: Gateway, Hero, and brand positioning.
- Understanding: About, Services, and design workflow.
- Trust: Projects, Process, and clear outputs.
- Exploration: Service, Projects, Design / 3D, and VR pages.
- Interest: Why Choose Us and contextual CTAs.
- Contact: Contact page and inquiry flow.

Conversion opportunities should be visible at natural decision points, especially after Services, Projects, Process, and the final Home CTA. Navigation should never trap users in a forced funnel.

## 8. Project Discovery Journey

The project journey is data-driven:

```text
Home → Projects → Project exploration/details → Related service/design → Contact
```

Project data uses the shared shape established in `src/data/shared/contentShapes.js`, supporting title, category, location, year, description, cover image, gallery, featured status, and slug. Real project content and detail routes are added only when client data is available.

Project exploration should always provide a route back to the brand’s Projects index, related service/design context, and a suitable Contact path.

## 9. Design → 3D → Final → VR Journey

The four capabilities are one connected progression:

```text
2D Design → 3D Design → Final Output → VR Experience
```

- 2D Design establishes planning, drawings, and the initial design language.
- 3D Design translates the plan into spatial or technical visualization.
- Final Output explains how approved design becomes a usable deliverable or execution reference.
- VR Experience lets the user understand the proposal through immersion after the preceding context is clear.

The Home page and relevant inner pages should cross-link this progression so the user understands a process rather than four unrelated features. The shared process data already supports these four steps for both brands.

## 10. VR Journey

Users discover VR from the Home page, Design / 3D page, Projects, or the primary navigation. Before entering an eventual VR viewer, the page should explain:

- what the experience represents;
- which project or design it relates to;
- what the user should expect from the interaction; and
- how to return to project, design, process, or Contact context.

The VR page is an experience boundary, not a dead end. It should offer paths back to the related project/design and a contextual CTA. Actual VR functionality is intentionally outside this phase.

## 11. Contact Journey

Contact is reachable from:

- the primary brand CTA in the header;
- the Home CTA;
- Services, Projects, Process, Design / 3D, and VR contextual CTAs;
- the footer;
- direct navigation to the brand Contact route.

Before Contact, users should be able to understand the practice, services, workflow, and examples of work. Contact should then provide the final inquiry or consultation action without requiring users to restart the journey.

At the UX level, the future flow supports:

```text
Contact form → submitting/loading → success or recoverable error
```

The existing LoadingState, ErrorState, and EmptyState primitives provide the future UI states. No backend, validation rules, or submission behavior is defined here.

## 12. Navigation Journey

- The header contains brand identity, primary navigation, configurable CTA, and mobile navigation.
- The brand logo/name always returns to `/spoorthi` or `/tejes`.
- React Router determines active navigation state.
- Mobile navigation owns its open/closed state locally, closes after navigation, and closes on Escape.
- Footer navigation mirrors the brand’s configured routes.
- Gateway selection is the only route into a brand from the ecosystem root, but direct brand URLs remain supported.
- Browser back navigation must return users to the previous route without requiring Gateway re-entry.

## 13. Mobile Journey

On mobile, the journey remains the same but becomes a deliberate vertical progression:

- Gateway panels stack and remain individually keyboard/touch accessible.
- The compact header exposes the mobile menu with accessible expanded/collapsed state.
- Menu links close the menu before or during route transition.
- Home sections proceed in the same storytelling order with comfortable gutters.
- CTAs remain full-context actions rather than decorative elements.
- Projects should prioritize clear project entry and return paths.
- VR should explain the experience before any future viewer interaction.
- Contact remains reachable from the menu, footer, and contextual CTAs.

The layout system, container tokens, touch-sized controls, and reduced-motion rules remain the implementation constraints.

## 14. Edge Cases

- Direct URL access: render the correct brand layout and page without requiring Gateway first.
- Unknown route: render the shared 404 state; do not silently render Home.
- Refreshing an inner page: preserve the route and brand shell through the React Router entry point.
- Opening an inner page directly: provide the correct title, navigation, footer, and Home link.
- Returning from Contact: use browser back, brand logo, header navigation, or footer navigation.
- Returning from VR: provide links to the related design/project/process context and preserve browser back behavior.
- Mobile menu open during navigation: close the local menu when a navigation link is selected.
- Reduced-motion users: retain understandable state changes without relying on animation.
- Empty projects/gallery/content: use `EmptyState` rather than fabricated content.
- Data failure: use `ErrorState` with a retry action where a future data source supports retry.
- Content loading: use `LoadingState`, separate from the application LoadingScreen.

## 15. UX Principles

1. Make the two-practice ecosystem clear before asking users to choose.
2. Let the URL and brand layout establish context consistently.
3. Tell one connected story from design intent to final output and VR.
4. Keep navigation and conversion paths visible without forcing a funnel.
5. Use Spoorthi content to communicate technical, architectural, and engineering confidence.
6. Use Tejes content to communicate spatial, material, and elegant design thinking.
7. Let evidence, process, and clear outputs build trust before Contact.
8. Preserve a calm, accessible, low-friction experience across desktop and mobile.

## Brand Navigation Journey

### 1. Navigation Purpose

Brand navigation is an orientation and exploration tool. It should help the user:

- understand which brand and page they are currently viewing;
- move between the major pages without retracing the Gateway journey;
- explore services, projects, design, and VR in a simple order;
- reach Contact when interest has developed; and
- retain a clear Spoorthi or Tejes identity throughout the visit.

Navigation should remain concise and predictable. It is not a content-heavy element and should not compete with the Home page story or replace contextual section CTAs.

### 2. Spoorthi Infra Navigation

Spoorthi’s primary navigation is:

```text
Home · Civil Construction · Projects · Design / 3D · VR Experience · Contact
```

| Destination | Why it exists | User intent | Expected result |
| --- | --- | --- | --- |
| Home | Re-establishes the Spoorthi overview | Understand the practice and start exploration | `/spoorthi` opens the Spoorthi Home shell |
| Civil Construction | Represents the core construction/engineering service path | Learn whether Spoorthi supports a construction need | `/spoorthi/civil-construction` opens the service page |
| Projects | Provides evidence and examples of work | Review relevant work and build trust | `/spoorthi/projects` opens project exploration |
| Design / 3D | Explains the technical visualization workflow | Understand how a proposal develops | `/spoorthi/design-3d` opens the design page |
| VR Experience | Extends the design/output journey into immersion | Understand or enter a future VR experience | `/spoorthi/vr` opens the VR page |
| Contact | Provides the direct conversion path | Start a project or inquiry | `/spoorthi/contact` opens the Contact page |

### 3. Tejes Interiors Navigation

Tejes’ primary navigation is:

```text
Home · Interior Design · Projects · Design / 3D · VR Experience · Contact
```

| Destination | Why it exists | User intent | Expected result |
| --- | --- | --- | --- |
| Home | Re-establishes the Tejes overview | Understand the practice and start exploration | `/tejes` opens the Tejes Home shell |
| Interior Design | Represents the main interior design service path | Learn whether Tejes fits an interior need | `/tejes/interior-design` opens the service page |
| Projects | Provides evidence of spaces and work | Review projects and build confidence | `/tejes/projects` opens project exploration |
| Design / 3D | Explains the spatial visualization workflow | Understand how a space is developed | `/tejes/design-3d` opens the design page |
| VR Experience | Extends spatial design into immersion | Understand or enter a future VR experience | `/tejes/vr` opens the VR page |
| Contact | Provides the direct conversion path | Discuss a space or consultation | `/tejes/contact` opens the Contact page |

### 4. Logo Behavior

The brand identity is the primary brand-Home shortcut:

```text
Spoorthi Infra logo → /spoorthi
Tejes Interiors logo → /tejes
```

Clicking the logo from any inner page returns to that brand’s Home. It does not unexpectedly return to the Gateway or switch brands. The identity remains visible in the Header so the current brand is always recognizable.

### 5. Active Route Behavior

The active navigation item identifies the user’s current location through React Router’s route state and an accessible current-page state.

Examples:

```text
/spoorthi              → Home active
/spoorthi/projects     → Projects active
/spoorthi/design-3d    → Design / 3D active
/tejes/vr              → VR Experience active
```

The active state should be visually clear, remain visible to keyboard users, and not rely only on color. The Home item uses exact matching so it does not remain active on inner pages. Related or parent navigation should remain understandable without falsely marking unrelated pages active.

### 6. Desktop Navigation Journey

The desktop journey is:

```text
Header → Primary navigation → Current-page recognition → Destination selection
```

The expected order is the configured brand order: Home, primary service, Projects, Design / 3D, VR Experience, then Contact. Contact is treated as the configurable primary action at the end of the navigation rather than as a separate secondary navigation system.

On wide screens the navigation should remain legible and spaced by the existing responsive layout system. It should not introduce unnecessary secondary navigation, duplicate the footer, or expose every possible section as a top-level item.

### 7. Mobile Navigation Journey

The mobile journey is:

```text
Mobile Header → Menu Trigger → Mobile Menu → Navigation Item → Destination → Menu closes
```

- The menu is closed by default.
- The trigger has an accessible name, `aria-expanded`, and `aria-controls`.
- Opening the menu moves focus to the first navigation link so the menu is immediately usable by keyboard users.
- The menu contains the current brand’s configured links and CTA only.
- Selecting a navigation item closes the menu and navigates to the destination.
- Escape closes the menu and restores focus to the trigger.
- The open menu should prevent confusing background interaction according to the final overlay treatment; no background control should appear to compete with the intentionally open navigation.
- Browser Back follows normal history behavior and does not create a separate menu state in global application state.

### 8. Brand Context

The user should always know which practice they are exploring.

- The Header shows the current brand name/logo.
- Navigation labels are brand-specific where the service naming differs.
- The brand theme and visual identity remain applied by the brand layout.
- Spoorthi navigation is only shown inside Spoorthi routes.
- Tejes navigation is only shown inside Tejes routes.

A user inside Spoorthi should not encounter Tejes navigation or copy unless they intentionally choose a brand-switching path.

### 9. Brand Switching

Brand switching is an intentional ecosystem-level action, not an accidental result of ordinary navigation.

The future journey is:

```text
Spoorthi → intentional brand switch → Gateway or equivalent brand-selection experience → Tejes
Tejes → intentional brand switch → Gateway or equivalent brand-selection experience → Spoorthi
```

The existing architecture keeps the Gateway separate and does not invent an additional switching route. If a `BrandSwitcher` is introduced later, it should preserve the understanding that both practices belong to one ecosystem and should require a deliberate user action.

### 10. Page Transition Expectations

After selecting a navigation item:

1. The URL changes to the configured destination.
2. The destination page renders with the same brand layout.
3. Header and footer context remain consistent.
4. The selected destination becomes active.
5. The new page begins at a predictable scroll position, normally the top unless a later product decision defines anchor restoration.
6. Route-change focus moves to the new main content foundation without losing the user’s brand context.

No animation is required for this journey. The transition should feel direct and should not unexpectedly remove navigation or content context.

### 11. Back / Forward Behavior

Normal browser history is part of the journey:

```text
Home → Projects → Design / 3D → Back → Projects
```

- Browser Back returns to the immediately previous route.
- Browser Forward returns to the route that was left through Back.
- Direct URL access opens the requested brand page without requiring Gateway first.
- Refreshing an inner page preserves the same route, brand shell, metadata, navigation, and footer.
- The logo remains the predictable way to return to brand Home.

### 12. Navigation + CTA Relationship

Navigation supports exploration and orientation. A CTA supports conversion or a specific next action.

Navigation should answer “Where can I go?” with the stable primary destinations. CTAs should answer “What can I do next?” at contextual points such as Services, Projects, Process, VR, and the Home conclusion.

The Header may expose one configurable primary CTA, but navigation should not become overloaded with consultation, inquiry, project, service, and exploration actions simultaneously.

### 13. Accessibility

- The Header uses a semantic `nav` with a meaningful brand-specific label.
- Keyboard Tab order follows identity, primary navigation, CTA, and mobile controls as exposed by the responsive layout.
- Visible focus states identify links, buttons, Gateway panels, and form controls.
- Navigation uses links; menu opening/closing uses a button.
- The mobile trigger exposes `aria-expanded` and `aria-controls`.
- Escape closes the mobile menu where appropriate.
- Screen-reader labels identify the brand Home link, primary navigation, and mobile navigation.
- No keyboard trap is introduced by the menu or route transitions.
- Reduced-motion users receive the same active/focus/navigation information without depending on transitions.

### 14. Edge Cases

- Direct inner-page URL: show the correct brand layout and mark the matching destination active.
- Refresh: retain the current inner route and brand context.
- Unknown route: show the shared 404 state rather than a misleading Home page.
- Mobile menu plus browser Back: follow browser history and keep menu state local; do not create a global menu state.
- Clicking the current page: keep the user on the current route without changing brand context or creating unnecessary duplicate content.
- Rapid navigation: React Router should resolve the latest selected destination; no custom transition queue is required.
- Slow page or asset load: retain the shell and use reusable LoadingState/ErrorState/EmptyState primitives where content later becomes asynchronous.
- Reduced motion: do not require animation to understand active, focus, open, or navigation states.
- Switching brands: require an intentional ecosystem-level action and then load the selected brand’s root route.

### 15. UX Success Criteria

Brand navigation succeeds when:

- users always know which brand they are in;
- users can identify which page is active;
- all major agreed pages are reachable quickly;
- the mobile menu is easy to open, navigate, and close;
- browser Back and Forward behave naturally;
- navigation remains secondary to primary page content;
- brand switching is intentional rather than accidental; and
- keyboard users can complete the same navigation journeys as pointer users.

## Page-to-Page Exploration Journey

### 1. Exploration Model

The website supports exploration without forcing every user through the same sequence. Two complementary models are valid within the current routes:

```text
Linear:       Home → Service → Design / Experience → Projects → Contact
Intent-driven: Home → Projects
               Home → VR
               Home → Contact
               Home → Design / 3D
```

Users can enter any major page directly through the configured Header navigation, a contextual CTA, the Footer, browser history, or a direct URL. The current brand remains the default exploration boundary unless the user intentionally switches brands.

### 2. Spoorthi Page Journeys

#### Home → Civil Construction

```text
/spoorthi → /spoorthi/civil-construction
```

This path supports users who want construction, infrastructure, or engineering services. Civil Construction should explain the relevant service scope using confirmed content, then offer continuation to related Projects and Contact. Projects provides evidence; Contact becomes the inquiry step after the user has enough context.

#### Home → Projects

```text
/spoorthi → /spoorthi/projects
```

This path supports browsing users and users evaluating whether Spoorthi can handle a technically oriented project. Projects should lead to related service/design context and `/spoorthi/contact` without requiring the user to visit Civil Construction first.

#### Home → Design / 3D

```text
/spoorthi → /spoorthi/design-3d
```

This path supports users interested in planning, visualization, and the 2D → 3D → Final Output → VR progression. Useful continuations are Projects, VR, and Contact.

#### Home → VR

```text
/spoorthi → /spoorthi/vr
```

The page should provide enough design/project context before any future immersive interaction. It should return users to Projects or move them to Contact rather than becoming a dead end.

#### Home → Contact

```text
/spoorthi → /spoorthi/contact
```

This is the direct conversion path for users who already understand their intent. It should remain available without forcing prior exploration.

#### Related Spoorthi inner-page transitions

```text
Civil Construction → Projects → Contact
Design / 3D → Projects → VR → Contact
VR → Projects → Contact
Projects → Civil Construction or Design / 3D → Contact
```

These are contextual options, not a mandatory sequence. A construction-focused visitor should retain construction context when moving to Projects; a design-focused visitor should understand that VR is part of the same design journey.

### 3. Tejes Page Journeys

#### Home → Interior Design

```text
/tejes → /tejes/interior-design
```

This path supports users looking for interior or spatial design. Interior Design should clarify the relevant design scope and offer continuation to related Projects and `/tejes/contact`.

#### Home → Projects

```text
/tejes → /tejes/projects
```

This path supports users browsing spaces or evaluating Tejes for a design brief. Projects should connect to Interior Design, Design / 3D, and Contact without requiring a fixed order.

#### Home → Design / 3D

```text
/tejes → /tejes/design-3d
```

This path supports users interested in spatial visualization, materials, and the progression from design intent to an understood space. Useful continuations are Projects, VR, and Contact.

#### Home → VR

```text
/tejes → /tejes/vr
```

The page should explain the spatial purpose of a future VR experience and connect back to Projects or forward to Contact.

#### Home → Contact

```text
/tejes → /tejes/contact
```

This is the direct consultation or space-discussion path for users who are ready to speak with Tejes.

#### Related Tejes inner-page transitions

```text
Interior Design → Projects → Contact
Design / 3D → Projects → VR → Contact
VR → Projects → Contact
Projects → Interior Design or Design / 3D → Contact
```

The transitions preserve Tejes’ interior, spatial, luxury, craftsmanship, and material context.

### 4. Service Page Journey

For Spoorthi:

```text
Home → Civil Construction → Relevant Projects → Contact
```

The user expects Civil Construction to clarify whether the practice can support a construction or engineering need, what kind of service context is relevant, and what the next decision should be. Relevant project evidence then builds confidence, with Contact as the natural inquiry step.

For Tejes:

```text
Home → Interior Design → Relevant Projects → Contact
```

The user expects Interior Design to clarify whether Tejes can support an interior or spatial brief. Relevant projects demonstrate the type of space and design thinking; Contact follows as a consultation or project discussion.

Neither service journey requires a new service-detail route. Existing service routes, Projects, Design / 3D, and Contact provide the intended path.

### 5. Projects Page Journey

Projects supports two visitor types:

- Browsing user: wants to explore completed or selected work.
- Intent-driven user: wants evidence that the brand can handle a related project.

The journey is:

```text
Home → Projects → project exploration → related service/design → Contact
```

Project discovery uses the existing data-driven project shape. Selecting or expanding a project should help the user understand its category, design/output relationship, and relevance without inventing project details. Related service links support the intent-driven user; Design / 3D or VR links support users who want to understand the experience layer; Contact provides the next action.

No project-detail route is introduced in this phase. Future project detail behavior must remain compatible with the existing route architecture unless a later phase explicitly adds a route.

### 6. Design / 3D Page Journey

The Design / 3D journey is:

```text
Home → Design / 3D → 2D Design → 3D Design → Final Output → VR
```

2D establishes the foundation, 3D makes the proposal understandable, Final Output connects design to a usable result, and VR provides the next experience layer. The page should make these stages feel connected rather than unrelated features.

Valid next destinations are:

- Projects, to see work where the process has been applied;
- VR, to continue the experience progression; and
- Contact, for a design or project discussion.

No additional design-stage routes are created.

### 7. VR Page Journey

Valid VR entries are:

```text
Home → VR
Design / 3D → VR
Projects → VR
```

Users enter VR to understand a proposal more immersively, not merely because it is a separate feature. Before any future viewer interaction, the page should explain what the experience represents, which project/design context it belongs to, and what the user can expect.

The return journey is:

```text
VR → Projects / Contact
```

Projects provides evidence and context; Contact provides the conversion path. Browser Back should also return to the page that led into VR. No VR technology or viewer behavior is implemented here.

### 8. Contact Page Entry Points

| Entry point | Likely user intent |
| --- | --- |
| Header CTA | Ready to inquire, consult, or discuss a project |
| Home CTA | Has completed the primary story and wants a next step |
| Service page | Wants to discuss the relevant service |
| Projects | Has reviewed work and wants to ask about a similar need |
| Design / 3D | Wants to discuss a design or visualization requirement |
| VR | Wants to discuss the project/experience just explored |
| Footer | Needs a persistent direct route to Contact |

Contact should retain the context of the page that led there through clear page language and return/navigation paths. No backend behavior is defined here.

### 9. Context Preservation

Context is preserved primarily through the brand layout, current route, page title/heading, related links, and consistent navigation—not through complex global state.

- Civil Construction → Projects: Projects should make construction-related categories or context understandable.
- Design / 3D → VR: VR should clearly remain part of the same design/output journey.
- Projects → Contact: Contact should feel like the next step after reviewing work, not an unrelated form.
- Any Spoorthi inner page: the Spoorthi identity and navigation remain visible.
- Any Tejes inner page: the Tejes identity and navigation remain visible.

### 10. Breadcrumbs / Wayfinding

Breadcrumbs are not required on the Gateway or Home pages. They may become useful on:

- Service pages, to clarify Home → service context;
- Projects, if project exploration becomes deeper than the current index page;
- Design / 3D and VR, to clarify their place in the design progression; and
- Contact, when it is entered from a specific service/project context.

The current Header logo, active route state, clear page heading, and browser history provide sufficient baseline wayfinding. Breadcrumbs should be introduced only where page depth or future project detail makes them materially useful.

### 11. Back Navigation

Expected browser behavior is natural history behavior:

```text
Home → Projects → Back → Home
Home → Design / 3D → VR → Back → Design / 3D
Service → Projects → Back → Service
```

The application should not override browser Back or create a custom back stack. Logo links, Header navigation, and contextual links provide additional explicit paths when users do not want to use browser history.

### 12. Direct URL Journey

Direct URLs must make sense without a prior Home visit.

- `/spoorthi/projects`: shows Spoorthi identity, active Projects navigation, page heading/purpose, and next paths to service/design/Contact.
- `/spoorthi/vr`: shows Spoorthi identity, VR context, and paths to Projects/Contact.
- `/tejes/projects`: shows Tejes identity, active Projects navigation, page purpose, and next paths to Interior Design/Design / 3D/Contact.
- `/tejes/contact`: shows Tejes identity, Contact purpose, brand navigation, and return-to-Home/related navigation.

Refreshing an inner page preserves the same route, brand shell, navigation, metadata, and page purpose.

### 13. Cross-Brand Boundary

Ordinary navigation remains within the current brand. Spoorthi routes use Spoorthi configuration, navigation, and theme; Tejes routes use Tejes configuration, navigation, and theme.

Users should not accidentally jump between brands through shared-looking page links. Cross-brand movement requires an intentional ecosystem-level switch, such as a future BrandSwitcher that leads to the Gateway or equivalent selection experience. No extra switching route is invented here.

### 14. Exit / Continue Options

Each major inner page should expose only the most relevant continuations:

```text
Service page → Projects / Contact
Projects     → Service / Design / Contact
Design / 3D  → Projects / VR / Contact
VR           → Projects / Contact
Contact      → Home / relevant return path
```

These options prevent dead ends without overloading pages with every possible action.

### 15. Mobile Page-to-Page Journey

On mobile, the Header menu provides access to every agreed destination and closes after a navigation item is selected. Contextual CTAs remain near the content decision they support, while the final CTA and Footer keep Contact reachable at the end of a long page.

- Back behavior follows the browser and does not require reopening Gateway.
- Service pages prioritize a clear service explanation, relevant project continuation, and Contact.
- Projects prioritize understandable project entry, selection, related service/design paths, and Contact.
- Design / 3D exposes the connected 2D → 3D → Final → VR progression without repeated copy.
- VR explains its context before the future experience and provides Projects/Contact exits.
- Long-page transitions should avoid unnecessary repetition and preserve a clear next action.

### 16. Accessibility

- Related page links should use meaningful labels that explain the destination or action.
- Keyboard users should reach the same page-to-page paths as pointer users.
- Route changes should move focus to the new main content foundation where appropriate.
- No page transition may depend only on hover.
- Screen readers should encounter a clear brand identity, page heading, navigation label, and link purpose.
- Links remain links for navigation; buttons remain reserved for actions such as opening mobile navigation.
- Reduced-motion users retain the same navigation and context without requiring transitions.

### 17. UX Success Criteria

The exploration journey succeeds when:

- users move naturally between related pages;
- every inner page has a clear purpose;
- users can always identify the current brand;
- users can return to Home easily;
- Browser Back and Forward behave naturally;
- direct URLs remain understandable;
- pages do not create unnecessary dead ends;
- Contact is reachable without forcing a fixed path; and
- Spoorthi and Tejes remain distinct throughout exploration.

### 18. Existing Route Boundary

This journey uses only the existing route architecture:

```text
/ 
/spoorthi
/spoorthi/civil-construction
/spoorthi/projects
/spoorthi/design-3d
/spoorthi/vr
/spoorthi/contact
/tejes
/tejes/interior-design
/tejes/projects
/tejes/design-3d
/tejes/vr
/tejes/contact
```

No project-detail route, service-detail route, case-study route, booking route, or extra landing page is created by this UX definition.

## CTA & Conversion Journey

### 1. Conversion Objective

The primary conversion goal is:

```text
Interested user → Contact
```

Contact is the main conversion destination because it gives a user who has developed interest a clear, brand-specific way to begin a conversation. It does not imply a booking, payment, quotation, login, or e-commerce flow. Actual contact details and form behavior remain client/content requirements.

The overall journey is:

```text
Discovery → Understanding → Trust → Interest → Action
```

### 2. CTA Hierarchy

#### Primary CTA

The high-intent conversion action. It leads to the current brand’s Contact route:

- Spoorthi: `/spoorthi/contact`
- Tejes: `/tejes/contact`

Use it when the user has enough context to reasonably begin an inquiry.

#### Secondary CTA

An exploration or information action, such as Explore Projects, Explore Services, or Explore Design / 3D. It helps users who are interested but not ready to contact.

#### Tertiary CTA

A contextual navigation action, such as continuing from 2D Design to 3D Design, returning to Projects, or moving from VR to related work. It should support flow without competing with the primary conversion.

Not every button is a conversion CTA. CTA level and wording should reflect the user’s current intent.

### 3. Spoorthi Infra CTA Journey

Spoorthi CTAs should feel technically confident and align with construction, infrastructure, engineering, architecture, and structural precision. Final labels remain configurable through `[REAL CTA COPY REQUIRED]`.

| Location | User intent | CTA purpose | Destination | Why it appears |
| --- | --- | --- | --- | --- |
| Hero | Identify whether Spoorthi fits the need | Start exploration | Services or `/spoorthi/civil-construction` | The user is still discovering; exploration should usually lead |
| About | Understand the practice | Continue to capabilities | Services | The user needs service context before Contact |
| Services | Identify a relevant capability | Explore Civil Construction or related work | `/spoorthi/civil-construction` or Projects | Connects service interest to evidence |
| Civil Construction | Evaluate construction/engineering fit | See relevant work or inquire | Projects or `/spoorthi/contact` | Contact follows understanding, not before it |
| 2D / 3D | Understand the technical design workflow | Continue the design/output story | `/spoorthi/design-3d`, Projects, or VR | Keeps the core experience progression connected |
| Projects | Review evidence | Explore related service or discuss a project | Civil Construction, Design / 3D, or `/spoorthi/contact` | Confidence has been earned through work |
| VR | Understand the immersive layer | Explore related work or inquire | Projects or `/spoorthi/contact` | VR is an experience layer, not the only conversion endpoint |
| Process | Understand how engagement progresses | Continue to differentiators or Contact | Why Choose Us content or `/spoorthi/contact` | Provides confidence before action |
| Why Choose Us | Evaluate fit | Begin a technical/project conversation | `/spoorthi/contact` | Natural action after evidence and process |
| Footer | Find a persistent next step | Contact or explore another page | `/spoorthi/contact` or configured navigation | Supports users who reach the end without overload |

### 4. Tejes Interiors CTA Journey

Tejes CTAs should feel refined, spatial, and considered, aligning with interior design, spatial design, luxury, craftsmanship, and material understanding. Final labels remain configurable through `[REAL CTA COPY REQUIRED]`.

| Location | User intent | CTA purpose | Destination | Why it appears |
| --- | --- | --- | --- | --- |
| Hero | Identify whether Tejes fits the space/design need | Start exploration | Services or `/tejes/interior-design` | The user is discovering and may not be ready to contact |
| About | Understand the design point of view | Continue to capabilities | Services | Establishes context before conversion |
| Services | Identify an interior/spatial capability | Explore Interior Design or related work | `/tejes/interior-design` or Projects | Connects service interest to evidence |
| Interior Design | Evaluate design fit | See relevant spaces or discuss a brief | Projects or `/tejes/contact` | Contact follows understanding |
| 2D / 3D | Understand how the space develops | Continue the visualization story | `/tejes/design-3d`, Projects, or VR | Keeps spatial stages connected |
| Projects | Review spaces and outcomes | Explore related service or discuss a space | Interior Design, Design / 3D, or `/tejes/contact` | Confidence follows relevant work |
| VR | Understand the immersive spatial layer | Explore related work or inquire | Projects or `/tejes/contact` | VR supports the design story rather than replacing it |
| Process | Understand the design journey | Continue to differentiators or Contact | Why Choose Us content or `/tejes/contact` | Gives the user confidence to proceed |
| Why Choose Us | Evaluate fit and refinement | Begin a space/design discussion | `/tejes/contact` | Natural action after trust is established |
| Footer | Find a persistent next step | Contact or explore another page | `/tejes/contact` or configured navigation | Keeps conversion accessible without pressure |

### 5. Hero CTA

The Hero should provide one clear next step and, where useful, one secondary exploration option:

```text
Hero → primary exploration action → Services or relevant service page
Hero → secondary action → Projects or Design / 3D
```

Contact may be the primary Hero action when the brand copy indicates high-intent inquiry, but it should not be the only path. A user who is still discovering should be able to explore Services or Projects first. The Hero should not force Contact, list every service, or use unsupported urgency.

### 6. Service CTA

The service journey is:

```text
Service understanding → Related Projects → Contact
```

Users should first learn what the service involves, then see relevant work, then contact when ready. The service page should not immediately force Contact before the user can understand whether the service fits.

### 7. Project CTA

The project journey is:

```text
Project discovery → More exploration → Related service/design → Contact
```

Project CTAs should support both browsing and intent-driven users. They may lead to the relevant service, Design / 3D, VR, or Contact. No project-detail route is invented; existing Projects and related routes remain the destination boundary.

### 8. Design / 3D CTA

Design / 3D supports three distinct next actions:

- Projects: see where the design process leads in actual work.
- VR: continue to the next visualization/experience layer.
- Contact: discuss a design, visualization, or project requirement.

The user should understand that these actions extend one connected design journey rather than competing product features.

### 9. VR CTA

VR is primarily an experience and understanding endpoint, not automatically a conversion endpoint.

```text
VR → Explore Projects
VR → Contact
```

Explore Projects returns the user to evidence and broader context. Contact supports a user who has gained interest from the experience. The page should explain what the future experience represents before asking the user to take another action.

### 10. Final CTA Section

The final Home CTA appears after:

```text
Brand understanding → service understanding → experience/work → confidence → final CTA → Contact
```

It belongs near the end because the user has then received the context needed to make an informed inquiry. The primary action is the current brand Contact route; an optional secondary action may return to Projects or Services. The language should feel like an invitation to continue a conversation, not pressure, urgency, or a guarantee.

### 11. Contact Entry Points

| Entry point | Likely user intent |
| --- | --- |
| Header | High-intent user wants a direct inquiry path |
| Hero | User is ready early or wants an immediate next step |
| Services | User wants to discuss a specific capability |
| Projects | User has reviewed work and wants to discuss a similar need |
| Design / 3D | User wants to discuss visualization or design development |
| VR | User wants to discuss the experience/project context |
| Final CTA | User has completed the primary trust-building story |
| Footer | User needs persistent Contact access after reaching the page end |

### 12. CTA Context

CTA labels and destinations should reflect the page that produced the interest:

- After Services: service-related exploration or service inquiry.
- After Projects: project-related discussion.
- After Design / 3D: design/visualization exploration or inquiry.
- After VR: related project, experience, or Contact action.
- After Process: begin a conversation with an understanding of how the work progresses.

Avoid repeating the same generic CTA after every section. Navigation handles stable exploration; contextual CTA copy handles the user’s current question.

### 13. Conversion Without Pressure

The conversion experience should:

- use a small number of meaningful CTAs;
- avoid fake urgency or misleading claims;
- avoid aggressive popups and interruptions;
- allow users to view information before contacting;
- avoid requiring forms before interest is established; and
- preserve a calm, premium, confident tone.

### 14. Contact Journey

```text
CTA → Contact page → user understands why they are contacting
→ contact interaction → success or recoverable error → continue browsing or return Home
```

The Contact page should identify the current brand, explain the reason for the conversation, provide `[REAL CONTACT INFORMATION REQUIRED]`, and make the next interaction understandable.

At UX level:

- Before submission: the user knows what the Contact action is for.
- During submission: a LoadingState communicates progress and prevents uncertainty.
- On success: an Error/Success state confirms the next step without inventing response times or guarantees.
- On error: ErrorState explains that the attempt was not completed and offers a retry or alternative contact path when real information exists.
- After either outcome: the user can return Home or continue exploring through the brand navigation.

No backend behavior, validation rules, pricing, booking, or guarantees are defined here.

### 15. Conversion Paths

Valid Spoorthi paths include:

```text
PATH A: Home → Services → Projects → Contact
PATH B: Home → Design / 3D → VR → Contact
PATH C: Home → Projects → Contact
PATH D: Direct page → Contact
```

Valid Tejes paths use the same structure with Interior Design as the primary service path:

```text
PATH A: Home → Interior Design → Projects → Contact
PATH B: Home → Design / 3D → VR → Contact
PATH C: Home → Projects → Contact
PATH D: Direct page → Contact
```

These are valid options, not a mandatory funnel.

### 16. CTA + Navigation Relationship

```text
Navigation → exploration and orientation
CTA → meaningful contextual action
Contact → primary conversion destination
```

The CTA system should not duplicate the complete navigation or expose every route at every section. Navigation remains stable; CTA emphasis changes according to the user’s current context.

### 17. Mobile CTA Journey

On mobile, CTAs remain visible at the decision points where they are relevant and use touch-friendly targets. The page should avoid stacking multiple competing buttons in every section.

- The Header menu keeps Contact accessible.
- Contextual CTAs stay near the service, project, design, or VR information they relate to.
- The final Home CTA remains reachable after the long-page story.
- A sticky CTA is not required at this stage; it would add persistent pressure before evidence exists.
- Contact remains available through the mobile menu, contextual actions, final CTA, and Footer.

### 18. Accessibility

- Use meaningful labels such as “Explore projects” or “Discuss your project,” subject to final approved copy.
- Keep all CTAs keyboard accessible with visible focus states.
- Ensure screen readers can distinguish navigation links from conversion actions.
- Do not communicate CTA priority through color alone.
- Do not make CTAs discoverable only through hover.
- Preserve reduced-motion compatibility and make the action understandable without animation.

### 19. Success Criteria

The CTA and conversion journey succeeds when:

- the user understands the next action at each major decision point;
- Contact is reachable from every major intent;
- primary, secondary, and tertiary CTA levels remain clear;
- CTAs stay contextual instead of repetitive;
- users can explore without being forced to convert;
- Spoorthi and Tejes maintain distinct CTA language and experience;
- no major page ends in a dead end; and
- mobile users can reach Contact easily.

### 20. Content Placeholders

Use explicit placeholders until approved business information is supplied:

- `[REAL CTA COPY REQUIRED]`
- `[REAL CONTACT INFORMATION REQUIRED]`
- `[REAL SERVICE INFORMATION REQUIRED]`

Do not invent phone numbers, emails, addresses, guarantees, pricing, project statistics, awards, certifications, or testimonials.

## Projects Discovery Journey

### 1. Purpose of Projects

Projects is a major trust and discovery point. It helps users understand:

- the type of work the brand handles;
- the relationship between services and completed or selected work;
- the visual and technical/spatial character of the practice;
- whether the brand appears relevant to their own need; and
- whether they are ready to continue toward Contact.

Projects should communicate only what real project data supports. It must not make unsupported claims about project quality, scale, clients, awards, results, budgets, or outcomes.

### 2. Project Discovery Entry Points

Users can reach Projects through the existing architecture:

| Entry point | Likely intent |
| --- | --- |
| Home | Wants to see previous or selected work after understanding the brand |
| Header navigation | Intentionally wants the Projects index |
| Services | Wants examples related to a service area |
| Design / 3D | Wants to see how design contributes to real output |
| VR | Wants to connect an immersive experience with actual work |
| Footer or contextual CTA | Wants a persistent or page-specific path to project discovery |

The Projects page should preserve the current brand context and provide a clear next step to related Service, Design / 3D, VR where genuinely available, or Contact.

### 3. Spoorthi Infra Project Journey

```text
/spoorthi → /spoorthi/projects
```

The Spoorthi Projects experience should help users understand construction, infrastructure, engineering, architecture, structural work, and the relationship between design and execution when supported by actual data.

Useful project information may include the project identity, category, visual representation, and confirmed location/year/description. Project categories should relate to Civil Construction or another confirmed Spoorthi service without inventing relationships.

Projects can connect to `/spoorthi/civil-construction` when a real project is service-relevant, and to `/spoorthi/design-3d` when the data supports a design/visualization relationship. A relevant project review can then lead naturally to `/spoorthi/contact`.

### 4. Tejes Interiors Project Journey

```text
/tejes → /tejes/projects
```

The Tejes Projects experience should help users understand interior design, spatial design, luxury, craftsmanship, materials, lighting, and finished spaces when supported by actual data.

Useful project information may include the project identity, category, visual representation, and confirmed location/year/description. Project relationships should connect to Interior Design or Design / 3D only when the real content supports them.

Relevant project exploration can lead to `/tejes/interior-design`, `/tejes/design-3d`, and finally `/tejes/contact` without forcing that order.

### 5. Project Information Hierarchy

The existing Phase 2 project shape supports:

```text
id · title · category · location · year · description
coverImage · gallery · featured · slug
```

Information priority is:

- Primary: project identity, visual representation, category/type.
- Secondary: confirmed location, year, short description.
- Optional: additional metadata that actually exists in the data.

No project is required to contain every field. Missing fields should be omitted or represented through an appropriate empty state, not replaced with fabricated values.

### 6. Project Exploration Model

Because there is no dedicated project-detail route, the current UX model is:

```text
Projects page → project preview or project section
→ expanded information only if supported by existing composition
→ related navigation → Contact
```

Project exploration may use the existing Projects page composition and future data-driven card/preview behavior. It must not introduce `/projects/:slug`, case-study routes, or another detail route in this phase.

### 7. Project Filtering / Categories

Filtering remains optional. It should be introduced only when real project volume and confirmed categories make it useful for discovery.

Meaningful categories may eventually come from the project data itself, such as a confirmed service or project type. The UX should not invent category names merely to populate a filter. If there are few projects or categories are not yet reliable, a simple unfiltered Projects page is clearer.

If filtering is later justified, it should remain understandable on mobile, provide a clear all-projects state, and offer an EmptyState when a valid category has no results.

### 8. Featured Projects

Featured projects on Home provide a small invitation into the broader Projects experience:

```text
Home → Featured Projects → Projects page
```

Featured content should be limited to a concise representative selection rather than duplicating the full Projects page. The exact count is a content/design decision; conceptually, it should be enough to show range without creating a second project index. A clear continuation leads to `/spoorthi/projects` or `/tejes/projects`.

Only projects marked `featured` in real project data may be presented as featured. No project should be promoted without confirmed content.

### 9. Project → Service Relationship

Where real data supports it:

```text
Spoorthi project → Civil Construction
Tejes project → Interior Design
```

The relationship helps a user understand which service area the work represents. It should be expressed through contextual navigation or metadata, not through an invented claim that every project belongs to the primary service.

### 10. Project → Design Relationship

```text
Project → Design / 3D
```

When supported by project content, the user should understand how 2D or 3D visualization contributed to the project and how design relates to the final work. The journey must not claim that every project includes every design stage unless the real data confirms it.

### 11. Project → VR Relationship

```text
Project → VR
```

VR is an optional deeper experience only when an actual related VR experience exists. Users should be told what they are entering and which project/context it represents. No project should display fake VR availability or unsupported immersive claims.

### 12. Project → Contact Journey

```text
Project exploration → Interest → Contact
```

After reviewing a project, the user may want to:

- discuss something similar;
- discuss their own project; or
- ask for more information.

The contextual Contact action should lead to the current brand Contact route and feel like a continuation of the project review, using `[REAL PROJECT CTA COPY REQUIRED]` until final copy exists.

### 13. Project Discovery User Types

#### Browsing visitor

Wants inspiration or examples. Useful actions are scanning project previews, opening related categories, continuing to Design / 3D, or returning to Home.

#### Evaluating visitor

Wants to determine whether the company handles a suitable project type. Useful actions are checking category/service context, reviewing the project description, exploring related service/design, and opening Contact.

#### High-intent visitor

Already understands the service and wants to start a conversation. The most direct action is Contact, without requiring additional project browsing.

#### Returning visitor

Already knows the brand and wants to revisit work. The Projects route, stable navigation, direct URL, browser history, and clear project identity should let them return without repeating the Home journey.

### 14. Projects → Back / Continue

Browser history should remain natural:

```text
Home → Projects → Back → Home
Projects → Contact → Back → Projects
Projects → Design / 3D → Back → Projects
Projects → VR → Back → Projects
```

The application should not override browser Back. Explicit logo, Header, Footer, and contextual links provide additional continuation paths without replacing history behavior.

### 15. Projects + Direct URL

Direct access to `/spoorthi/projects` or `/tejes/projects` must make sense without a Home visit. The user should immediately have:

- visible brand identity and brand navigation;
- a clear Projects page heading and purpose;
- access to Services, Design / 3D, VR where relevant, and Contact;
- active Projects navigation state; and
- a clear route back to brand Home.

### 16. Projects + Empty State

The existing `EmptyState` architecture should handle:

- no projects currently available;
- projects still being added;
- a valid category with no projects; and
- a gallery or project subset with no results.

The state should explain that content is not currently available and provide a useful return or Contact action where appropriate. It must not insert replacement projects or placeholder claims.

### 17. Projects + Loading State

Future dynamic project content can follow:

```text
Project request → LoadingState → project content
                         ↘ ErrorState with retry
```

Image loading remains a media-level state. Slow assets should reserve their intended space and communicate loading without blocking the entire page unnecessarily. A failed image should use the existing Media/ErrorState behavior and must not expose a broken or misleading project representation.

No API or loading implementation is introduced by this journey definition.

### 18. Mobile Project Journey

The mobile journey remains:

```text
Home → Projects → project discovery → project exploration
→ related service/design → Contact
```

Mobile project discovery should prioritize easy scanning, clear project identity, useful category context, touch-friendly interactions, and no horizontal overflow. Metadata should remain concise; optional location/year/description information should not overwhelm the project identity.

Users should be able to open a related service or Design / 3D path, reach Contact, return to Projects, and use browser Back without reopening the Gateway.

### 19. Accessibility

- Meaningful project images use useful alt text; decorative imagery uses empty alt text or the equivalent implementation.
- Project items use semantic links/buttons according to whether they navigate or perform an action.
- Project information and actions must not be available only on hover.
- Keyboard focus remains visible through project discovery and related navigation.
- Screen readers should understand project names, categories, and action labels.
- Loading, EmptyState, and ErrorState messages remain understandable without color or animation.
- Reduced-motion users receive the same project information and navigation paths without required transitions.

### 20. Project Content Rules

Never invent:

- client names;
- project locations or dates;
- budgets, sizes, or completion statistics;
- awards or certifications;
- testimonials; or
- project outcomes.

Use `[REAL PROJECT DATA REQUIRED]` whenever a project field is not available. The shared project data architecture should remain flexible rather than forcing missing fields into fabricated content.

### 21. Projects Success Criteria

The Projects journey succeeds when:

- users understand what work the brand handles;
- projects are easy to discover from Home and navigation;
- available project information is understandable and proportionate;
- Projects reinforces service understanding;
- Projects connects naturally to Design / 3D;
- VR is shown only when genuinely available;
- Contact is reachable without pressure;
- direct Projects URLs work independently;
- EmptyState, LoadingState, and ErrorState behavior is understandable; and
- Spoorthi and Tejes retain distinct project contexts.

### 22. Route Validation

The project journey uses only the existing project routes:

```text
Spoorthi: /spoorthi/projects
Tejes:    /tejes/projects
```

No project-detail route, `/projects/:slug` route, case-study route, or other project route is created.

## Design → 3D → Final Output → VR Journey

### 1. Purpose of the Experience

The Design → 3D → Final Output → VR sequence explains a user's movement from an initial idea to a planned design, from a planned design to a visualized design, from visualization to a final real-world result, and finally to an optional deeper or immersive understanding of that work.

This journey differentiates the website by explaining how each brand thinks, develops, and presents work. It must communicate a credible process without promising capabilities, technologies, outcomes, or project stages that the real business information does not support.

### 2. Overall Canonical Journey

The canonical storytelling sequence is:

```text
2D Design → 3D Design → Final Output → VR Experience
```

This is a conceptual storytelling framework. It is not a statement that every real-world project has every stage, that every stage is available for every project, or that users must visit every stage in order.

The sequence gives users a simple mental model:

- 2D Design establishes the plan, concept, layout, or technical intent.
- 3D Design develops that intent into a visual understanding.
- Final Output connects visualization to the completed or delivered result when real evidence exists.
- VR Experience offers a deeper or immersive layer when a real experience is available.

### 3. 2D Design Journey

2D Design is the first explanatory stage because it gives the user the planning foundation for everything that follows. A user should be able to discover the stage, understand the concept or plan, see how it relates to 3D, and choose to continue forward or explore another path.

The stage should answer:

- What question does the 2D work answer?
- What information belongs in the planning or concept layer?
- Why does this layer come first in the story?
- What should the user expect from the following 3D stage?
- What is the next useful action: continue to 3D, explore Projects, open VR when available, or Contact?

For Spoorthi, the 2D stage represents technical planning, architectural or engineering representation, and structural clarity. For Tejes, it represents spatial planning, layout, interior concept, and material or spatial intent.

This documentation does not name specific software, tools, or production workflows. Those details may be added only when confirmed by real business information.

### 4. 3D Design Journey

3D Design follows 2D Design as the visualization and development layer. It helps the user understand how a plan or concept becomes a more legible visual representation.

The stage should answer:

- What does the user learn from the 3D representation?
- How does it relate back to the 2D plan or concept?
- How does it prepare the user to understand Final Output?
- Should the user continue to Projects, explore VR, return to 2D context, or Contact?

The experience must not claim a particular rendering engine, AI system, software package, hardware capability, or production method unless that information is real and approved. 3D is a content and understanding layer, not an unsupported technology claim.

### 5. Final Output Journey

Final Output follows 3D Design and explains the relationship between visualization and the real-world result. It represents the completed, delivered, built, installed, or otherwise documented result only when the available project data supports that description.

The stage should answer:

- What does the final output represent?
- Why is it presented after 3D visualization?
- How does it increase user confidence or understanding?
- How do Projects demonstrate the relationship between design intent and result?
- Which details are available from real project data?

The experience must not claim that a visualization exactly matches a final result unless that relationship is supported by real evidence. The language should distinguish clearly between concept, visualization, proposal, progress, and completed work.

### 6. VR Experience Journey

VR follows Final Output as a deeper or immersive layer. It is an optional invitation to understand a design or result differently, not a required destination for every visitor.

Before entering, the user should understand:

- why this experience is offered;
- what context the experience relates to;
- what level of immersion or interaction can honestly be expected;
- how the experience relates to the design process; and
- how to return to Projects, Home, or Contact.

The site must not invent or imply a headset requirement, device support, 360-degree media, WebXR, an interactive walkthrough, or any other VR capability unless real information confirms it. Where no real VR experience exists, the page should communicate its availability status honestly and provide a useful alternative path.

### 7. Home Page Journey

Home introduces the sequence as a concise story:

```text
2D Design → 3D Design → Final Output → VR
```

The Home page should establish continuity between the stages without making the page heavy. Each stage needs enough context for recognition, a clear transition logic, and an appropriate exploration opportunity. Projects should reinforce the story by showing where real work supports one or more stages.

This is a journey model, not a final visual implementation specification. The final Home composition may use cards, sections, links, or another appropriate pattern while preserving the same understanding and relationship.

### 8. Design / 3D Page Journey

The Design / 3D journey is represented by the existing brand routes:

```text
Spoorthi: /spoorthi/design-3d
Tejes:    /tejes/design-3d
```

Users may enter from Home, Header navigation, a CTA, Projects, or a direct URL. The page should explain the relationship between 2D planning and 3D visualization, provide a clear bridge toward Final Output, identify VR as an optional next layer when available, and maintain useful paths to Projects, Contact, Home, and the brand's other pages.

The page should support both a user who wants a quick process explanation and a user who wants a deeper understanding of how a brand develops its work.

### 9. Cross-Page Journey Paths

The existing routes support these useful paths:

```text
Home → Design / 3D → VR
Home → Design / 3D → Projects
Projects → Design / 3D → VR
Projects → VR
VR → Projects → Contact
```

These paths describe supported relationships, not new routes and not a mandatory sequence. No additional route is introduced by this journey.

### 10. Spoorthi Narrative

Spoorthi's narrative is:

```text
Technical Planning → 3D Visualization → Construction / Final Result → Immersive Understanding
```

The journey should reinforce:

- Construction;
- Infrastructure;
- Engineering;
- Architecture;
- technical precision; and
- structural confidence.

The language should help users understand how technical clarity supports confidence in a built or infrastructure-focused result. It must remain grounded in real services and real project evidence.

### 11. Tejes Narrative

Tejes's narrative is:

```text
Spatial Planning → 3D Visualization → Finished Interior → Immersive Spatial Understanding
```

The journey should reinforce:

- Interior Design;
- Spatial Design;
- Materials;
- Lighting;
- Craftsmanship; and
- Luxury.

The language should help users understand how spatial intent, material choices, lighting, and craft contribute to a finished interior without turning aesthetic positioning into an unsupported guarantee.

### 12. Project Relationship

When real project data supports the complete relationship, the project story may be presented as:

```text
Project → Design → 3D → Final Output → VR
```

Not every project has every stage. A project may show only the stages for which authentic content, imagery, or documentation exists. Missing stages must be omitted or described as unavailable rather than filled with invented content.

### 13. User Intent Mapping

| User intent | Helpful stage or page |
|---|---|
| Understand the design process | Home and Design / 3D |
| See how an idea becomes visual | 2D Design → 3D Design |
| Understand the final result | Final Output and Projects |
| Experience the work differently | VR when genuinely available |
| See previous work | Projects |
| Contact the company | Contact from any relevant stage |

Every stage should answer the user's immediate question before offering the next exploration choice.

### 14. Experience Depth

The experience has three levels of depth:

1. **Level 1 — Quick Understanding:** Home introduces the four-stage relationship in a concise way.
2. **Level 2 — Deep Exploration:** Design / 3D explains the planning and visualization relationship in more detail.
3. **Level 3 — Immersive Exploration:** VR provides a deeper experience when the real content and capability exist.

This hierarchy prevents Home from becoming overloaded while still allowing interested users to explore the process in depth.

### 15. Navigation and Experience Choice

Header links and CTAs should support the story without forcing every user through every stage. Users may:

- enter Design / 3D directly;
- enter VR directly when the destination is real and understandable;
- return to Projects;
- open Contact;
- return to Home; or
- move between related stages using contextual links.

The site must not force `2D → 3D → Final Output → VR` as a mandatory navigation path. It is a storytelling framework that gives context to optional exploration.

### 16. Mobile Journey

On mobile, the sequence should preserve sequential understanding with clear transitions and a visible content priority. The implementation should avoid excessive explanatory text, keep next actions easy to find, make VR discoverable without making it dominant, and set honest expectations for media and immersive-content performance.

Each stage should remain understandable when stacked vertically, with sufficient spacing and a clear way to move to Projects, Contact, or the next relevant stage.

### 17. Accessibility Journey

Each stage must be understandable without animation. The journey must provide:

- no information that is available only on hover;
- meaningful alternative text for informative images;
- accessible alternatives for video or immersive content;
- keyboard-accessible navigation and controls;
- visible, logical focus states;
- meaningful link names that communicate destination or action; and
- reduced-motion behavior that preserves the same content and path.

The 2D, 3D, Final Output, and VR relationships must be communicated through headings, text, labels, and links rather than visual effects alone.

### 18. Loading, Error, and Empty States

The journey must account for slow or failed loading of:

- 3D imagery;
- project imagery;
- VR assets; and
- other media associated with the four stages.

Existing `LoadingState`, `ErrorState`, and `EmptyState` architecture should communicate these conditions with useful recovery or alternative paths. This section defines the journey behavior only; it does not implement or replace those state components.

### 19. Authenticity and Content Guardrails

Do not fabricate:

- software names or design tools;
- rendering technologies or AI systems;
- VR hardware or device support;
- project counts;
- accuracy percentages or realism guarantees;
- promised outcomes; or
- certifications.

Use these placeholders whenever the required real content is not available:

```text
[REAL DESIGN PROCESS CONTENT REQUIRED]
[REAL 3D CONTENT REQUIRED]
[REAL FINAL OUTPUT CONTENT REQUIRED]
[REAL VR EXPERIENCE CONTENT REQUIRED]
```

### 20. Success Criteria

The journey succeeds when:

- the relationship between all four stages is understandable;
- 2D Design is a credible starting point;
- 3D Design feels like a natural development of the plan;
- Final Output connects visualization to reality without overclaiming;
- VR is an optional deeper layer rather than a forced step;
- users can enter and exit any available stage clearly;
- Projects reinforce the relationship with authentic evidence;
- Contact remains accessible from relevant points;
- Spoorthi and Tejes have distinct narratives;
- Home offers quick understanding while deeper pages provide depth; and
- no unsupported capabilities, technologies, results, or project claims are introduced.

### 21. Final UX Principle

“2D → 3D → Final Output → VR is a storytelling framework, not a forced navigation path.”

## Contact Journey

### 1. Purpose of the Contact Page

The Contact page is the primary conversion destination. It should feel like a natural continuation of the user's journey from discovery, through understanding and trust, to interest and a contact action.

The page should help an interested user:

- understand why they are contacting the brand;
- know what information may be useful to provide;
- understand what happens after submitting or choosing a contact method;
- complete the action comfortably; and
- continue browsing after success, failure, or an intentional exit.

The Contact page must reduce uncertainty without making unsupported promises about availability, response time, process, or outcomes.

### 2. Contact Entry Points

Contact is reachable from all existing high-intent contexts. Each entry point should preserve the user's reason for continuing without requiring a complex technical state system.

| Entry point | Likely user intent |
|---|---|
| Header | “I already know I want to contact this brand.” |
| Hero CTA | “I want to discuss the service introduced here.” |
| Services | “I want to ask about this type of service.” |
| Civil Construction / Interior Design | “I am interested in this specific service area.” |
| Projects | “I am interested after seeing the work.” |
| Design / 3D | “I want to discuss a design or visualization project.” |
| VR | “I want to discuss this type of experience or project.” |
| Final CTA | “I am ready to take the next step.” |
| Footer | “I need a dependable contact path from anywhere on the site.” |
| Direct URL | “I arrived specifically to contact this brand.” |

These are UX entry-point definitions, not final marketing copy. The existing Contact routes remain the destination for these actions.

### 3. Context Preservation

Contact should preserve the user's mental context even when no explicit context value is passed between pages.

```text
Projects → Contact
```

The user should feel they are contacting the brand about the project or service they just explored.

```text
Design / 3D → Contact
```

The user should understand that the action relates to design, planning, or visualization.

```text
Service page → Contact
```

The user should understand that the action relates to that service area.

If contextual data is unavailable, the Contact page must still identify the brand, explain the broad purpose of contact, and offer a clear action. Contextual continuity is a content and navigation responsibility, not a requirement for complex state management.

### 4. Spoorthi Infra Contact Journey

Route: `/spoorthi/contact`

The Spoorthi Contact experience should align with Construction, Infrastructure, Engineering, Architecture, and technical confidence.

#### User expectation

The user expects a professional, project-oriented conversation about construction, infrastructure, engineering, architecture, or a related service. The page should make the next action feel clear and credible.

#### Information hierarchy

1. Spoorthi brand identity.
2. The purpose of contacting Spoorthi.
3. The primary contact action.
4. The small set of project details useful for an initial conversation.
5. What happens after the action, only where supported.
6. A route back to Home, Projects, Services, or the relevant brand page.

#### Contact intent

The user may be asking about a construction or infrastructure requirement, an engineering or architecture service, a project discussion, or a related capability. The experience should allow the user to describe intent without forcing a premature technical classification.

#### Relevant information to request

At UX level, useful fields may include name, email, phone when genuinely needed, project or service type, and a concise message. The final field set remains subject to real business requirements:

`[REAL CONTACT FORM FIELDS REQUIRED]`

#### Next-step expectation

The page should explain the immediate result of submitting or choosing a confirmed contact method. It must not invent contact details, response times, site-visit promises, quotations, or project outcomes.

### 5. Tejes Interiors Contact Journey

Route: `/tejes/contact`

The Tejes Contact experience should align with Interior Design, Spatial Design, Luxury, Craftsmanship, and a refined experience.

#### User expectation

The user expects a considered conversation about an interior, spatial, material, lighting, or design requirement. The page should feel calm and purposeful while keeping the action easy to complete.

#### Information hierarchy

1. Tejes brand identity.
2. The purpose of contacting Tejes.
3. The primary contact action.
4. The small set of project or spatial details useful for an initial conversation.
5. What happens after the action, only where supported.
6. A route back to Home, Projects, Design / 3D, or the relevant brand page.

#### Contact intent

The user may want to discuss an interior project, spatial planning, materials, lighting, craftsmanship, or a design direction. The form should invite useful context without demanding an unnecessarily detailed brief at the first step.

#### Relevant information to request

Useful fields may include name, email, phone when genuinely needed, project type, and a concise message. No luxury positioning should be used to justify collecting excessive personal information:

`[REAL CONTACT FORM FIELDS REQUIRED]`

#### Next-step expectation

The page should communicate only the confirmed next step after contact. It must not invent consultation terms, availability, response-time guarantees, fees, contact details, or design outcomes.

### 6. Contact Information Hierarchy

The conceptual information order is:

```text
Brand identity → Contact purpose → Contact methods → Form/action → Expectations → Supporting information
```

Essential information:

- which brand the user is contacting;
- why the user may contact that brand;
- the primary action;
- labels and instructions for any required fields;
- the current action state; and
- a clear success, error, or unavailable state.

Optional information, only when real and useful:

- confirmed secondary contact methods;
- a concise explanation of the types of enquiries welcomed;
- relevant service or project context; and
- confirmed privacy information.

Do not invent phone numbers, email addresses, physical addresses, office hours, social links, or response-time guarantees. Use:

`[REAL CONTACT INFORMATION REQUIRED]`

where confirmed information is not available.

### 7. Form Journey

The conceptual form journey is:

```text
Form → User enters information → Validation → Submission → Success OR Error
```

Potentially useful fields are:

- Name;
- Email;
- Phone, only when genuinely useful and justified;
- Project type or service area; and
- Message.

The form should remain short enough to complete comfortably. It should ask only for information needed to begin a useful conversation and should not be implemented or connected to a submission service as part of this documentation step.

### 8. Form Intent

The form should answer: “What do we need to know to start a useful conversation?”

At UX level:

- required fields are limited to information essential for the intended action;
- optional fields are clearly marked and genuinely optional;
- each field has a clear label and a useful expectation or example where appropriate;
- project type helps route or understand the enquiry only if the business needs it;
- the message gives the user a place to describe intent in their own words; and
- unnecessary personal or sensitive information is not requested.

The final required and optional field definitions remain:

`[REAL CONTACT FORM FIELDS REQUIRED]`

### 9. Validation Journey

Each field should have an understandable state progression:

```text
Default → Focus → Filled → Invalid OR Valid → Submitting → Success OR Error
```

Validation should use inline, clear messages associated with the relevant field. Errors should explain what needs correction in user-friendly language, not expose implementation details. The page should preserve entered data when possible and must not fail silently.

Validation must account for:

- empty required fields;
- invalid or incomplete formats where a format is required;
- unexpected submission failures; and
- fields that become unavailable or cannot be processed.

The form must not clear valid user-entered information merely because one field is invalid or a network request fails.

### 10. Submission Journey

The submission sequence is:

```text
User completes form → Submit → Submission state → Result
```

During submission:

- the user understands that the action is processing;
- duplicate submission is discouraged or prevented;
- the submit control exposes its current state; and
- entered data is not cleared prematurely.

On success:

- the result is clearly communicated;
- the next expected step is explained only if supported by real information;
- the user can continue to Home, Projects, the relevant brand page, or another existing route; and
- the page does not imply an unsupported response-time guarantee.

On error:

- failure is clearly communicated;
- entered information is preserved where possible;
- retry is available; and
- the message does not blame the user.

### 11. Contact Methods

If multiple confirmed methods are later available, their roles should be clear:

```text
Primary:   Contact form
Secondary: Email, phone, or another confirmed method
```

This does not authorize inventing or adding methods. The site should not create unnecessary communication channels. Any secondary method must use real, approved information:

`[REAL CONTACT INFORMATION REQUIRED]`

### 12. CTA → Contact Journey

Every contact-oriented CTA should lead to a page where the user understands context before taking action:

```text
CTA → Contact page → Context understood → Contact action → Success/Error → Continue
```

Contact must not feel like a dead-end page. Existing continuation paths may include:

```text
Success → Home
Success → Projects
Success → Relevant brand page
```

The chosen continuation should match the user's context and use existing routes only.

### 13. Direct Contact URL

Direct visits to `/spoorthi/contact` and `/tejes/contact` must work independently of previous navigation. The page must make clear:

- which brand the user is contacting;
- what that brand does;
- why someone might contact it; and
- how to proceed.

Direct entry must not depend on hidden navigation state, a previous CTA, or a previous project page.

### 14. Contact → Back Journey

Browser Back behavior must remain natural and must not be overridden:

```text
Projects → Contact → Back → Projects
Design / 3D → Contact → Back → Design / 3D
Home → Contact → Back → Home
```

The Contact page may offer explicit links as well, but those links do not replace the browser's expected history behavior.

### 15. Contact Success State

A successful contact action should:

- confirm that the action completed;
- avoid ambiguous wording;
- avoid unsupported promises;
- preserve brand identity and context; and
- offer a clear continuation path.

If final wording is not available, use:

`[REAL SUCCESS MESSAGE REQUIRED]`

The success state should not imply a response deadline, guaranteed consultation, quotation, or project acceptance without real support.

### 16. Contact Error State

The UX must account for:

- submission failure;
- network failure;
- server failure; and
- validation failure.

Existing `ErrorState` architecture should provide a user-friendly explanation, preserve data where possible, offer retry, and provide an alternative contact method only when that method is real and confirmed. Use:

`[REAL ERROR MESSAGE REQUIRED]`

Do not invent fallback contact details or conceal the reason an action could not complete.

### 17. Empty and Unavailable States

If contact information is not configured, the form is temporarily unavailable, or no contact method is available, the page should explain the condition honestly and provide a useful existing navigation path where possible.

Use:

`[REAL CONTACT INFORMATION REQUIRED]`

or the appropriate existing `EmptyState` or `ErrorState` behavior. Never fabricate a phone number, email address, office location, form endpoint, or alternative channel to make the page appear complete.

### 18. Mobile Contact Journey

The mobile journey remains:

```text
CTA → Contact → Form → Validation → Submit → Success/Error
```

The experience should support easy completion with touch-friendly controls, appropriate input types, clear field labels, a visible primary CTA, and errors that remain visible near the relevant fields. It should avoid unnecessary scrolling while preserving enough context for the user to understand the action.

Entered data should remain available after validation or submission failure. This section defines behavior and priorities; it does not redesign the mobile UI.

### 19. Accessibility

The Contact journey must provide:

- a visible label for every field;
- clear communication of required fields;
- field-associated error messages;
- appropriate focus behavior after validation and submission;
- complete keyboard navigation;
- a keyboard-accessible submit button;
- status messages announced appropriately to assistive technology;
- validation that is not communicated by color alone;
- sufficient focus visibility; and
- a meaningful heading hierarchy and screen-reader-friendly form structure.

The same Contact task must be possible for keyboard, screen-reader, reduced-motion, and other accessibility users without requiring visual context from a preceding page.

### 20. Privacy and Data Minimization

The Contact experience should collect only information necessary for an initial conversation. It must not ask for unnecessary sensitive data, expose submitted information in the interface, or imply data practices that have not been confirmed.

Privacy information should be shown only when real policy or approved content exists. Otherwise use:

`[REAL PRIVACY INFORMATION REQUIRED]`

Do not invent a privacy policy, retention period, consent language, security claim, or regulatory statement.

### 21. Spoorthi vs Tejes Differentiation

The two Contact experiences share the same fundamental architecture while preserving distinct contexts.

| Shared foundation | Spoorthi Infra | Tejes Interiors |
|---|---|---|
| Clear brand identity | Professional and technical | Refined and spatial |
| Short, purposeful form | Project and construction-oriented | Interior and design-oriented |
| Consistent validation | Construction, infrastructure, engineering, architecture | Interior design, spatial design, materials, lighting, craftsmanship |
| Recoverable success/error states | Technical confidence | Considered, refined experience |
| Accessible continuation | Relevant Projects or brand page | Relevant Projects, Design / 3D, or brand page |

The brands should not receive unnecessarily duplicated architecture. They should share form behavior, accessibility expectations, validation, error, and success principles while using different content context and tone.

### 22. Contact UX Success Criteria

The Contact journey succeeds when:

- the user understands why they are contacting;
- brand identity is obvious;
- the form is short enough to complete comfortably;
- required information is clear;
- validation is understandable;
- submission state is clear;
- success is unambiguous;
- errors are recoverable;
- user data is preserved when possible;
- Contact is reachable from every major intent;
- direct Contact URLs work;
- mobile users can complete the journey; and
- accessibility users can complete the same journey.

Contact remains the primary conversion destination while continuing to support exploration after the action.

### 23. Contact Content Placeholders

Use placeholders instead of fabricated business information:

```text
[REAL CONTACT INFORMATION REQUIRED]
[REAL CONTACT FORM FIELDS REQUIRED]
[REAL SUCCESS MESSAGE REQUIRED]
[REAL ERROR MESSAGE REQUIRED]
[REAL PRIVACY INFORMATION REQUIRED]
[REAL CONTACT CTA COPY REQUIRED]
```

### 24. Contact Route Validation

The Contact journey uses only the existing routes:

```text
Spoorthi: /spoorthi/contact
Tejes:    /tejes/contact
```

No new Contact-related route is created.

### 25. Contact Journey Validation Summary

This Contact journey is consistent with the existing design-system principles by preserving clear hierarchy, purposeful CTAs, readable states, and brand distinction. It is consistent with the Phase 2 architecture by using the existing brand routes, shared state architecture, `LoadingState`, `ErrorState`, and `EmptyState` patterns, and by avoiding new route or integration requirements.

The primary conversion path is:

```text
Discovery → Understanding → Trust → Interest → Contact → Submission / Contact Action → Success or Error → Continue browsing
```

No fabricated business information, contact details, fallback channels, response-time guarantees, or implementation behavior is introduced.

## Mobile & Edge-Case Journey

### 1. Mobile Ecosystem Journey

The mobile ecosystem follows the same product hierarchy as the wider experience:

```text
Loading Screen → Gateway → Brand Selection → Brand Website
```

Mobile is a first-class experience, not a desktop layout reduced in size. The hierarchy, brand distinction, page meaning, and primary actions remain intact while content is reorganized for a narrow viewport, touch interaction, variable browser chrome, and sequential reading.

Spoorthi Infra and Tejes Interiors must remain clearly distinguishable at every mobile stage. The mobile journey should preserve a deliberate transition from the shared Gateway into the selected brand rather than making the two brands feel like interchangeable screens.

### 2. Mobile Gateway

The Gateway should present the two brand choices vertically or in another clearly stacked mobile arrangement. Each choice must have:

- a clear brand identity;
- a concise explanation of the brand context;
- a sufficiently large tap target;
- visible selection or tap feedback; and
- a predictable transition after selection.

The interaction must not depend on hover. Selection feedback should confirm the user's action without causing an accidental immediate choice from a nearby tap or scroll gesture. A deliberate tap on the brand action should be the trigger for navigation.

The selected brand opens its existing website route. Browser Back should return to the Gateway or the prior browser history entry naturally; it must not be overridden to create an unexpected loop. The Gateway should not obscure the distinction between Spoorthi Infra and Tejes Interiors on small screens.

### 3. Mobile Header and Navigation

The mobile header should expose a clear menu trigger when the full navigation cannot fit comfortably. The menu must have an understandable open and closed state, an accessible name, and a logical focus order.

Expected behavior includes:

- opening and closing from an obvious control;
- closing after an intentional navigation where appropriate;
- Escape closing the menu when applicable;
- browser or platform Back behaving naturally where applicable;
- active route indication;
- visible brand identity while navigating;
- no unnecessary obstruction of the main content;
- sticky or fixed positioning only when it materially helps navigation; and
- safe-area consideration for devices with display cutouts or inset controls.

The menu must not trap users in a hidden state or leave an inaccessible overlay after navigation. The implementation should avoid making the header permanently consume excessive vertical space on long pages.

### 4. Mobile Home Page

The mobile Home page should use a clear vertical content order:

```text
Hero
→ About
→ Services
→ 2D Design
→ 3D Design
→ Final Output
→ VR Experience
→ Projects
→ Process
→ Why Spoorthi / Why Tejes
→ Final CTA
→ Footer
```

The exact composition may vary by brand, but the hierarchy must remain understandable. On mobile:

- the Hero communicates identity and primary intent quickly;
- About establishes enough context without delaying the main action;
- Services remain scannable;
- 2D, 3D, Final Output, and VR preserve their storytelling order;
- Projects demonstrate relevant work without overwhelming the page;
- Process and Why sections add confidence without repeating earlier content;
- the Final CTA appears after sufficient understanding; and
- the Footer provides dependable recovery and navigation paths.

Images should remain constrained to the viewport, preserve their intended subject and relationship to nearby text, and avoid causing layout shifts. Text hierarchy should be readable without excessive zoom or tiny type. CTA placement should follow the user's context instead of repeating the same action after every short section.

Long pages should support comfortable scanning, clear section boundaries, and reliable wayfinding. The mobile Home page must preserve the `2D → 3D → Final Output → VR` framework without turning every stage into repetitive copy.

### 5. Mobile Inner Pages

The following existing inner-page journeys must remain usable on narrow screens:

- Civil Construction;
- Interior Design;
- Projects;
- Design / 3D;
- VR Experience; and
- Contact.

Each page should support long content, large images, project grids, technical information, CTA sections, forms, and media-heavy content through vertical flow, readable grouping, and predictable controls.

Technical information should not depend on wide tables or side-by-side layouts that cannot be read on mobile. Large imagery should remain proportionate and navigable. CTA sections should appear at meaningful decision points, not interrupt every content block. Forms should keep labels and errors close to their fields. Media-heavy pages should degrade clearly when assets are slow, unavailable, or unsupported.

### 6. Mobile Projects Journey

The Projects journey should support discovery through a readable vertical or responsive grid of project cards. Each card should make its identity, available metadata, and next action clear without requiring hover.

The mobile Projects experience should account for:

- project discovery through Home, navigation, Services, or direct access;
- touch-friendly project card actions;
- optional filtering only if it is implemented later and remains understandable;
- featured projects without hiding the complete available set;
- concise, authentic project metadata;
- reserved space and graceful behavior while images load;
- an understandable empty project state; and
- a recoverable error state with retry where appropriate.

Projects should connect naturally to Services, Design / 3D, and VR only when real content supports those relationships. No project-detail route, case-study route, or other new project route is invented. The existing project routes remain the source of the Projects journey.

### 7. Mobile Design → 3D → Final Output → VR

The four-stage framework remains a vertical story on small screens:

```text
2D Design
↓
3D Design
↓
Final Output
↓
VR Experience
```

Each stage needs a readable explanation, a clear relationship to the previous stage, and a touch-friendly next action where a next action is available. Images or media should appear close enough to their explanation to preserve meaning, but they must not force the user into a heavy or confusing media sequence.

Progressive disclosure may be used where it improves scanning, provided important meaning is not hidden behind hover, animation, or an inaccessible gesture. The user should be able to understand the entire relationship without interacting with every image or opening every detail.

The sequence remains a storytelling framework rather than a mandatory navigation path. Users may enter Design / 3D, Projects, or VR directly when those existing routes and real content support the entry.

### 8. Mobile VR Experience

VR content should be presented honestly on mobile. The page should explain what is available before asking the user to interact with media and should account for limited screen size, bandwidth, browser support, device capability, and touch input.

When an immersive experience is available, touch interaction must be clear and non-conflicting with page scrolling. When immersive VR is unavailable, unsupported, or not yet populated with real content, the page should provide a clear fallback such as explanatory content, Projects, Design / 3D, Home, or Contact.

The experience must not promise a headset, 360-degree content, WebXR, a walkthrough, device compatibility, or hardware-specific behavior unless that capability is genuinely implemented and supported. A fallback must preserve understanding rather than presenting a broken media control.

### 9. Mobile Contact Journey

The mobile Contact sequence is:

```text
Mobile CTA → Contact → Form → Validation → Submit → Success / Error
```

The form should use a single readable flow with visible labels, appropriate input types, touch-friendly controls, and a clear submit action. The mobile keyboard must not cover the active field, its validation message, or the primary action. Focus should remain logical as fields are completed and as errors are announced.

The page should communicate submission/loading state, prevent accidental duplicate submission, preserve entered data where possible, and make success or error unmistakable. Contact methods appear only when real and available. Data collection remains minimal and should not request unnecessary sensitive information.

### 10. Mobile CTA Behavior

The following CTA contexts should remain visible, understandable, touch-friendly, and context-aware:

- Hero CTA;
- Service CTA;
- Project CTA;
- Design / 3D CTA;
- VR CTA;
- Final CTA; and
- Contact CTA.

CTA labels should communicate the destination or action without relying on hover explanation. They should be large enough to activate comfortably, separated from competing controls, and placed at a point where the user has enough context to act. Repetition should be limited so the page does not feel like a series of identical prompts.

### 11. Responsive Breakpoints and Device Sizes

Responsive behavior should be validated across the existing Phase 1 principles rather than treated as a set of rigid implementation thresholds. Reference sizes include:

| Reference size | UX expectation |
|---|---|
| 1440px | Large desktop composition remains balanced and spacious. |
| 1280px | Desktop hierarchy remains clear without unnecessary compression. |
| 1024px | Tablet or compact desktop transition remains usable. |
| 768px | Small tablet layout supports touch and readable stacking. |
| 390px | Mobile layout preserves hierarchy and primary actions. |
| 375px | Narrow mobile layout avoids overflow and cramped controls. |
| Mobile landscape | Content, navigation, and media remain usable at reduced height. |

The design should adapt for large desktop, desktop, tablet, small tablet, mobile, small mobile, and mobile landscape. These sizes are validation references, not rigid implementation requirements.

### 12. Touch Interaction

Touch interactions should use comfortably sized tap targets with sufficient separation from neighboring actions. Tap feedback should confirm interaction without implying that a tap has completed an irreversible action when it has not.

The experience must not place important information only on hover. Swipe should be used only where it is genuinely useful and discoverable. Interactive media must not conflict with page scrolling, browser gestures, or form interaction. Accidental taps should be reduced through spacing, deliberate actions, and confirmation where an action has meaningful consequences.

### 13. Orientation Changes

When the device changes from portrait to landscape or landscape to portrait:

- layouts must reflow without broken alignment;
- no content should be clipped;
- no unintended horizontal overflow should appear;
- navigation must remain usable;
- forms and focus targets must remain visible; and
- images and media must remain correctly framed.

The page should not assume that landscape always means a desktop-like viewport. Reduced height, browser controls, and safe areas remain relevant.

### 14. Keyboard, Focus, and Input Behavior

Keyboard and focus behavior remains part of the cross-device UX, especially for external keyboards, accessibility users, and Contact forms. The experience should provide:

- complete keyboard navigation;
- visible focus indicators;
- logical focus order;
- focus that remains associated with the active input;
- no field hidden or covered by the virtual keyboard;
- appropriate input types and autofill support where useful; and
- Escape behavior for dismissible menus, dialogs, or overlays where applicable.

Focus must not be moved unexpectedly during ordinary scrolling or media interaction. After validation or submission, focus should move only when doing so helps the user understand and recover from the state.

### 15. Reduced Motion

The experience must respect `prefers-reduced-motion`. Non-essential animation should be reduced or disabled, and no critical information may depend on movement, parallax, hover, or a timed transition.

Loading, Gateway, brand selection, page transitions, and the 2D → 3D → Final Output → VR story must remain understandable without motion. Mobile motion should be restrained because smaller screens, variable performance, and touch interaction make excessive movement especially disruptive.

### 16. Slow Network and Asset Loading

On slow networks, the user should retain a clear understanding of where they are and what can be done next. Delayed images, large media, and delayed page transitions should have appropriate loading treatment, reserved space where possible, and graceful degradation.

Failed image loads must not leave confusing blank controls or broken layout. Media may be replaced with a meaningful alternative or a clear unavailable state. Loading states should distinguish application loading from content or asset loading and should not pretend that unavailable content has loaded.

This section defines UX expectations only; it does not implement loading logic.

### 17. Loading, Error, and Empty States

The following edge cases must have understandable states:

- application loading;
- content loading;
- image loading;
- form submission loading;
- network error;
- content error;
- an empty project list;
- unavailable VR or media; and
- contact submission failure.

The application Loading Screen remains conceptually separate from content loading states. Existing `LoadingState`, `ErrorState`, and `EmptyState` architecture should provide clear messages, preserve useful context, and offer retry or navigation recovery where appropriate.

### 18. Direct URL, Refresh, Back, and Forward

Direct route access, browser refresh, deep links, Back, and Forward should preserve as much brand context as the current route provides. A user entering an inner page directly should understand which brand they are viewing and what the page represents without relying on a previous click.

Expected behavior includes:

- direct access to existing routes works with clear brand identity;
- refresh does not unnecessarily discard the current page context;
- Back returns to the prior browser history entry;
- Forward returns to the next history entry where available;
- deep links do not require a preceding Gateway interaction; and
- returning from an inner page does not create unexpected route loops.

No new deep-link or recovery route is created for this behavior.

### 19. 404 and Unknown Routes

Unknown routes, invalid brand routes, and missing pages should communicate that the requested destination is unavailable and provide a clear recovery path. Recovery may point to an appropriate existing brand Home, the shared Gateway, or another existing route based on the context available.

The recovery should preserve brand boundaries where possible. It must not silently display the wrong brand's page or invent a new route to hide the missing destination.

### 20. Brand Switching Edge Cases

Switching between Spoorthi Infra and Tejes Interiors should be intentional and visibly clear. Mobile brand switching must not be caused by an ambiguous tap area, an accidental swipe, or a confusing shared navigation control.

The experience should preserve:

- clear brand identity after switching;
- a predictable relationship to the Gateway;
- natural Back behavior;
- understandable deep-link behavior; and
- separation between the two brands' page context, content, and Contact destination.

Switching is an available exploration choice, not an automatic redirect or a reason to erase browser history.

### 21. Browser and Device Limitations

The UX should degrade gracefully across older browsers, unsupported media, limited hardware, unavailable VR capability, reduced-motion settings, viewport differences, safe areas, and dynamic mobile browser UI.

Unsupported media should have a meaningful alternative. Limited hardware should not prevent access to essential text, navigation, Projects, or Contact. Dynamic browser bars and safe areas must not obscure fixed or sticky controls. No unsupported device or browser capability is promised.

### 22. Long Content and Scroll UX

Long project descriptions, service descriptions, image sequences, and Contact pages should remain navigable through clear section headings, spacing, and continuity. The experience should avoid excessive scroll friction by reducing redundant text, using meaningful grouping, and keeping key navigation or CTA paths discoverable.

Large image sequences should not create an endless undifferentiated stream. Long forms should preserve labels and error visibility. Users should be able to understand which section they are reading and how to return to Home, Projects, Contact, or the relevant preceding context.

### 23. Accessibility Edge Cases

The mobile and edge-case journey must support screen readers, keyboard users, touch users, reduced-motion users, and low-vision users. It should provide:

- visible focus;
- semantic structure and meaningful headings;
- labels and field-associated errors;
- meaningful image alternatives;
- interaction that does not depend only on color, hover, animation, or gesture; and
- the same essential navigation and recovery choices across input methods.

Loading, error, empty, unavailable, and success messages must be understandable to assistive technology and must not rely solely on visual changes.

### 24. Horizontal Overflow Prevention

No page should unintentionally scroll horizontally. Large media must remain constrained to the available viewport, text must wrap appropriately, and grids must adapt rather than force narrow or clipped columns.

Fixed and sticky elements must not create overflow or cover meaningful content. Tables, technical information, forms, media controls, CTA rows, and navigation must have a usable narrow-screen behavior.

### 25. Offline and Network Loss

When network connectivity is lost during page loading, image loading, Contact submission, or media loading, the user should receive a clear state that distinguishes unavailable network content from invalid input or missing content.

The UX should preserve entered Contact data where possible, allow retry where appropriate, and provide existing navigation recovery. Offline functionality is not introduced by this documentation and must not be implied if it is not already present.

### 26. Performance UX Expectations

The experience should prioritize fast initial rendering and critical content, defer or lazy-load non-critical media where the existing implementation supports it, reserve image space to reduce layout shifts, and avoid unnecessary heavy animation.

Lower-end mobile devices should still receive readable content, usable navigation, Projects access, and Contact access. Performance expectations are user-experience requirements for validation, not an instruction to implement optimization in this step.

### 27. Final Cross-Phase UX Validation

The mobile and edge-case journey remains consistent with:

- Phase 1 Brand & Design Direction;
- Phase 1 Responsive Design Rules;
- Phase 2 Website Architecture;
- Phase 2 Accessibility Architecture;
- Phase 2 State Architecture;
- Phase 2 Loading / Error / Empty-State Architecture; and
- Phase 3 Steps 1–9.

The complete ecosystem journey remains coherent:

```text
Loading → Gateway → Brand Selection → Home → Exploration → Projects → Design / 3D → Final Output → VR → Contact → Conversion / Exit
```

Validation confirms that mobile behavior preserves product hierarchy, brand distinction, existing routes, the four-stage design story, Contact as the primary conversion destination, accessibility expectations, and graceful recovery from edge cases. No new route, unsupported capability, fake business data, or implementation requirement beyond the existing architecture is introduced.

### 28. Mobile and Edge-Case UX Principles

- Mobile is a first-class experience, not a shrunken desktop.
- Touch replaces hover where necessary.
- Content hierarchy remains intact.
- Brand distinction remains clear.
- Accessibility is preserved.
- Motion is progressive and optional.
- Errors degrade gracefully.
- No unsupported functionality is promised.
- Users always have a clear next step or recovery path.
