# AUTOMATION NATION — SEED LIBRARY BRIEFS

**Purpose.** 25 flagship websites that seed the Automation Nation snapshot library. Each site is a fully-built, deployed, rebrandable web experience. A prospect lands on any one, sees their industry, and wants it — with their name on it — that afternoon.

**Delivery.** Static output at `sites/<slug>/`. Deployed as an orphan `gh-pages` branch. Each site rebrandable by editing one `brand.json`. Every form is wired to a configurable `FORM_WEBHOOK_URL` so a sold site plugs straight into that client's GoHighLevel sub-account.

**Numbering.** 01–20 are the business niche seeds. 21–25 are the showpieces.

---

## DESIGN CONSTITUTION

Every site obeys the following. No exceptions. Every subagent building a site inherits this.

### 1. Copy
- Real copy only. Never lorem ipsum. Every headline, sub-head, service description, testimonial, and CTA is written specifically for the demo brand in its voice.
- Testimonials are fictional but named, dated, and reference a specific detail of the service.
- Legal / regulated niches (medical, financial, legal) include appropriate disclaimers where realism demands them.

### 2. Typography
- Distinctive display face per site — never default to Inter-for-everything. Variable fonts encouraged.
- A site uses at most 2 typefaces. Weight/width/opsz variance carries the tonal range.
- Line-length target: 45–75 characters for body copy.
- Optical size / letter-spacing adjusts across breakpoints; no one-size-fits-all.

### 3. Palette
- Palette flows through CSS custom properties fed from `brand.json.palette`. No hard-coded hex outside `:root`.
- Contrast: body text ≥ AA (4.5:1), display text ≥ 3:1.
- Every site declares a **signature accent** — one color that does the heavy semantic work (CTA, highlight, hover).

### 4. Motion
- Custom easing only. No `linear`, no `ease`, no `ease-in-out`. All timing uses intentional `cubic-bezier(…)`.
- Signature curves: `cubic-bezier(.2,.9,.2,1)` (soft settle), `cubic-bezier(.7,0,.2,1)` (assertive), `cubic-bezier(.85,0,.15,1)` (theatrical).
- Every animation respects `@media (prefers-reduced-motion: reduce)` — motion collapses to instantaneous state changes.
- Scroll-linked animations use `IntersectionObserver` and never dead-block the main thread. `requestAnimationFrame` for continuous work.

### 5. Layout
- Mobile is not a degraded desktop. Every hero has a mobile-specific composition. Every grid reflows deliberately at 900px and 600px.
- Every long-form section has a rhythm rule — a repeating vertical unit (e.g. 8px baseline) — declared in comments.

### 6. Interaction
- Every interactive element has a distinct hover, focus, and active state.
- Focus outlines are visible and on-brand (not `outline: none`).
- Forms validate inline. Every field has a semantic `<label>`. `autocomplete` attributes set.
- Cursor: default sites use system cursor. Two sites intentionally implement a custom cursor and hide the system one — those two are declared in their briefs.

### 7. Accessibility
- Semantic HTML at the tag level. `main`, `nav`, `header`, `footer`, `article`, `section` used correctly.
- Alt text is descriptive, not decorative. Decorative art marked `aria-hidden="true"`.
- All color also encoded in shape/text — never color alone as meaning.
- Skip-to-content link on every site.

### 8. Performance
- Zero console errors. Verified in the screenshot loop.
- Images ≤ 1920px wide, served as WebP, lazy-loaded (`loading="lazy"`, `decoding="async"`).
- Videos ≤ 600 KB, h264, muted + loop + inline. No autoplay with sound. Ever.
- No blocking third-party scripts. Google Fonts allowed via `<link rel="preconnect">` + `display=swap`.
- Total transferred bytes per site ≤ 1.5 MB (excluding one hero video if present, which is capped at 600 KB).

### 9. Seed Mechanics — rebrandable in ≤ 15 minutes
- Every site has a `brand.json` at its root: brand name, tagline, phone, email, address, `palette` object, `logoPath`, `heroImage`, social links, `FORM_WEBHOOK_URL`.
- All colors bound to `--brand-*` CSS custom properties.
- All brand-owned copy lives in HTML elements with `data-editable="…"` attributes documenting what the text represents (e.g. `data-editable="hero.headline"`).
- Every form: `action` attribute set from `brand.json.FORM_WEBHOOK_URL` at build/serve time; JS fallback POSTs JSON.
- Every site ships a `/guide/index.html` route documenting: concept, techniques, generated assets, files to touch when rebranding.

### 10. The Iteration Law
- **Pass 1 — Build.** Complete site from brief.
- **Pass 2 — Critique.** Screenshot desktop (1440) + mobile (390). Review the pixels. Fix every rhythm/contrast/alignment/hierarchy finding. Console must be error-free.
- **Pass 3 — Elevate.** Add one deliberate complexity upgrade — a texture, a signature interaction, an easter egg, a moment of delight. This pass exists to prevent convergence on bland output.
- A site is not "done" until all three passes are logged in the site's `/guide/`.

### 11. What we never do
- Stock icon fonts (Font Awesome, Material Icons). Draw or SVG.
- Gradient hovers with no easing. If hover animates, easing declared.
- Skeletons that fake data. If content is dynamic, load it before it appears.
- "Get in touch" as a full CTA. CTAs are specific ("Book a consultation", "See the trim").

---

## THE 25 BRIEFS

Each brief is a self-contained specification. A subagent building that site needs only its brief + this constitution.

Notation:
- **Slug** — folder under `sites/`
- **Brand** — fictional demo brand
- **Concept** — the one-sentence design idea
- **Palette** — 4–5 color tokens with hex
- **Type** — display / body pairing
- **Motion** — the motion language in one line
- **Signature moment** — the thing they'll remember
- **Assets** — generated media budget

---

### 01 — Med Spa / Aesthetics

- **Slug**: `01-medspa` → `Lumen Aesthetics`
- **Concept**: An editorial "afternoon light" spa — impossibly clean, low-saturation, one large hero portrait, soft parallax on a warm neutral palette.
- **Palette**: bone `#f5efe6`, ink `#1a1614`, warm accent `#c89a70`, muted rose `#e8c7be`, dim `#8a7f6d`.
- **Type**: Fraunces (display) / Manrope (body). Fraunces `opsz` 20 for hero, 96 for section titles.
- **Motion**: `cubic-bezier(.2,.9,.2,1)` for reveals, generous 900ms durations. Hero portrait pans 4% on scroll (parallax).
- **Signature moment**: A "menu" of treatments where each row expands vertically on hover to reveal duration + price with an ink underline that draws in.
- **Assets**: 1 hero portrait (Soul-cast, warm light, soft focus, neutral background — female subject mid-30s, three-quarter profile). 1 detail texture (linen/paper macro).
- **Sections**: Hero → Philosophy statement (large italic pull) → Treatment menu → Consultation intake form → Journal (3 cards) → Contact.
- **Copy voice**: hushed, first-person plural, clinical without being cold. "We work in afternoon light, on skin that has been listened to."

### 02 — Luxury Real Estate Brokerage

- **Slug**: `02-luxury-real-estate` → `Norderlys Property`
- **Concept**: An estate agent's website that reads like a private catalogue — one property per fold, ambient horizon strip animating slowly at the top, gold-leaf accents.
- **Palette**: obsidian `#0e0f12`, cream `#efe9dd`, brass `#b28a4b`, moss `#3a5348`, mist `#7d8891`.
- **Type**: Recoleta (display) / Söhne (body).
- **Motion**: Slow horizontal slide on the "horizon strip" (10s, ease-in-out-quart). Cards emerge from below with a `cubic-bezier(.7,0,.2,1)` at 1100ms.
- **Signature moment**: Each listing is a full-viewport chapter with property title in a large italic and address in mono; scrolling advances a page counter (03 / 12).
- **Assets**: 3 exterior/interior renders (nano_banana_pro / marketing_studio_image, cinematic, natural light).
- **Sections**: Hero + horizon strip → 3 featured properties (chapter-style) → Team (2 portraits) → Enquiry form.
- **Copy voice**: understated, third-person, factual. Prices in EUR with reference numbers.

### 03 — Law Firm (Litigation)

- **Slug**: `03-law-firm` → `Halvorsen & Kaye`
- **Concept**: Dark, authoritative, editorial. A firm that only takes bet-the-company cases. Large italic serif, black backgrounds, gold-thread accent, senator-portrait style headshots.
- **Palette**: near-black `#0a0a0b`, bone `#eae6dd`, brass `#b58b3f`, ox-blood `#7a1d20`, ash `#5c5c5f`.
- **Type**: Canela (display) / Neue Haas Grotesk (body).
- **Motion**: Text reveals with `clip-path` inset from bottom, `cubic-bezier(.85,0,.15,1)` at 1200ms. Sections separated by a thin gold rule that draws in from the left.
- **Signature moment**: A rotating docket ticker (recent representative matters, redacted where realistic) that scrolls slowly at the base of the hero.
- **Assets**: 2 portraits (Soul, formal, seated, warm rim light).
- **Sections**: Hero → Representative matters (ticker) → Practice areas → Principals (2) → Contact.
- **Copy voice**: sober, senior-partner, no exclamation points. "We do not settle."

### 04 — Roofing / Exterior

- **Slug**: `04-roofing` → `Ironside Roofing Co.`
- **Concept**: A roofer's site that looks like a proud American trade with modern taste — cinematic hero of a crew on a rooftop at golden hour, chunky mono/serif combo, red accent, before/after slider, real-feeling reviews.
- **Palette**: charcoal `#141416`, off-white `#f4f1ec`, safety-red `#c9241f`, steel `#4a5058`, sand `#c9b088`.
- **Type**: Chronicle Display (display) / IBM Plex Sans (body).
- **Motion**: Hero has a slow zoom-out (10s) on the roof photo. Trust-badges scroll marquee-style. Before/after uses a draggable divider with a clip-path.
- **Signature moment**: The before/after slider — thick red drag handle, satisfying weight, `cubic-bezier(.2,.9,.2,1)` on release.
- **Assets**: 1 hero (marketing_studio_image, cinematic roof + crew, sunset backlight). 1 before-after pair (same house, degraded vs new).
- **Sections**: Hero → Trust bar (BBB, GAF Master Elite, 5-star badges) → Services → Before/after slider → Reviews (3, named + local city) → Free-inspection form.
- **Copy voice**: no-nonsense, first-person plural, warranty-forward. "We tear off, install, and clean up. You don't touch a shingle."

### 05 — HVAC

- **Slug**: `05-hvac` → `Northline Climate`
- **Concept**: The HVAC site that finally doesn't look like a 2011 template. Cool-tone editorial with an animated wind-flow SVG hero, an ambient equipment card carousel, live seasonal messaging.
- **Palette**: winter navy `#0f2437`, morning cyan `#5cbde0`, warm brass `#c9955a`, cloud `#f0f4f7`, ash `#8996a1`.
- **Type**: DM Serif Display (display) / Söhne (body).
- **Motion**: A subtle SVG wind-current path animates behind the hero (dashed line following a bezier). Cards for services translate on hover with a light-blue underglow.
- **Signature moment**: A live seasonal banner ("It's 94° in Cleveland today — schedule your AC tune-up before the weekend rush") that reads from the visitor's clock.
- **Assets**: 0 generated images. All hero is illustrated / SVG.
- **Sections**: Hero → Live seasonal bar → Services → Membership plans (3 tiers) → Reviews (3) → Book service form.
- **Copy voice**: neighborly, warranty-forward, "same-day when we can."

### 06 — Dental Studio

- **Slug**: `06-dental` → `Aperture Dental Studio`
- **Concept**: A dentist that reads like an architecture practice — clean gridded layout, pastel-into-white palette, macro tooth-anatomy illustration, calm.
- **Palette**: paper `#f9f8f4`, ink `#161819`, sage `#a3b8a3`, dusty rose `#e3c6c1`, dim `#7e8580`.
- **Type**: Söhne Breit (display) / Söhne (body).
- **Motion**: `cubic-bezier(.2,.9,.2,1)` reveals on scroll. A subtle "smile line" SVG arc animates across the hero as the page loads.
- **Signature moment**: An appointment-booking modal that opens like a chapter card, with a calendar mini-view drawn in SVG (not a library).
- **Assets**: 1 architectural interior render (marketing_studio_image, clinic interior, natural light, terrazzo).
- **Sections**: Hero → Services (grid) → Our approach → Team (3 doctors) → New patient form → Contact.
- **Copy voice**: quietly confident, "we run 15 minutes ahead of schedule, on purpose."

### 07 — Chiropractic / Wellness

- **Slug**: `07-chiropractic` → `Meridian Spinal Care`
- **Concept**: Sports-medicine meets meditation clinic. Warm earth palette, kinetic spine SVG illustration that rotates on scroll, testimonial-forward.
- **Palette**: bone `#f2ebe0`, ink `#1a1614`, terracotta `#c26a4a`, sage `#7a8f6d`, dim `#6a655e`.
- **Type**: Söhne (display) / Söhne (body) — same face, two contrasting weights.
- **Motion**: A tall SVG spine illustration rotates 40° across the vertical scroll of the page.
- **Signature moment**: Scroll-locked spine rotation with vertebra highlighted for each service (Cervical / Thoracic / Lumbar).
- **Assets**: 0. All illustration.
- **Sections**: Hero → Spine illustration section → Services → Meet Dr. → Reviews → Book form.
- **Copy voice**: informed layperson, "your spine is the schedule your day runs on."

### 08 — Boutique Gym

- **Slug**: `08-boutique-gym` → `Foundry Strength`
- **Concept**: A brutalist barbell club — heavy Helvetica, black-on-red, workout schedule as a train timetable, coach portraits.
- **Palette**: black `#000`, off-white `#efece7`, blood-red `#cf1a1a`, concrete `#8a8a8a`, chalk `#f0ede4`.
- **Type**: Neue Haas Grotesk Display (display) / IBM Plex Mono (body).
- **Motion**: Bar-loaded weights animate onto the bar when a class card enters viewport. Ticker-style class times.
- **Signature moment**: A live-updating "next class in" countdown, timetable formatted as a departure board.
- **Assets**: 2 coach portraits (Soul, black background, hard rim light).
- **Sections**: Hero → Schedule board → Coach cards → Programs → Waitlist form.
- **Copy voice**: coach-in-your-ear, imperative, "you'll add weight in six weeks or we refund the block."

### 09 — Fine-Dining Restaurant

- **Slug**: `09-fine-dining` → `Vespertine Room`
- **Concept**: A single-page tasting menu presented like a printed program. Blackberry-into-black palette, italic serif, one large photo per course, quiet cursor-following spotlight.
- **Palette**: aubergine `#1a0f19`, cream `#f0e5d4`, gold `#c8a45c`, blush `#c7899f`, ink `#0a0a0a`.
- **Type**: GT Sectra (display) / GT America Mono (body).
- **Motion**: A soft radial spotlight follows the cursor. Course cards fade in with a `cubic-bezier(.2,.9,.2,1)` 1200ms.
- **Signature moment**: The menu itself — nine courses, each one a chapter card, printed-program layout with course number in the margin.
- **Assets**: 3 plated-course photos (Soul, editorial macro, low light).
- **Sections**: Hero → Menu (9 courses) → Room (2 photos) → Reservation form.
- **Copy voice**: prose-y, third-person, "the room seats twelve."

### 10 — Auto Detailing / Ceramic Coating

- **Slug**: `10-auto-detailing` → `Meridian Detailing`
- **Concept**: A ceramic-coating studio that looks like a Porsche press release. Deep matte-black hero of a coated fender with rain beading; carbon-fibre texture accents.
- **Palette**: carbon `#0a0a0b`, off-white `#e6e6e4`, chrome `#b8b8bc`, hazard `#f0b400`, cobalt `#1a3a75`.
- **Type**: Söhne Breit (display) / Söhne Mono (body).
- **Motion**: A canvas "water beading" effect on the hero — droplets pool and slide when idle. Package cards flip on click.
- **Signature moment**: The beading animation. Rain-drops repel from a coated surface (canvas), roll off with realistic physics.
- **Assets**: 1 hero (marketing_studio_image, macro of a car body panel with rain beads, dark studio light).
- **Sections**: Hero → Packages (3 tiers) → Process (numbered) → Reviews → Book detail.
- **Copy voice**: mechanic-with-taste, "your paint is a substrate. We make it a shell."

### 11 — Landscaping / Outdoor Design-Build

- **Slug**: `11-landscaping` → `Green Hour Landscape`
- **Concept**: An architecture-firm style landscaper — plan-drawing aesthetic, olive-green palette, top-down plan-view illustrations, seasonal photography.
- **Palette**: sage `#8ba382`, moss `#3d4a2f`, sand `#dcd1b8`, ink `#1a1614`, blush `#c48a6c`.
- **Type**: Fraunces (display) / Söhne (body).
- **Motion**: A SVG site-plan draws itself on scroll — dashed lines for future paths, solid for existing.
- **Signature moment**: The self-drawing site-plan hero. Each dashed line completes as it enters viewport.
- **Assets**: 2 completed-project photos (marketing_studio_image, gardens, golden hour).
- **Sections**: Hero (site-plan) → Portfolio (3 projects, before/after) → Process → Design intake form.
- **Copy voice**: designer's mother-tongue, "the garden is the ground floor of the house."

### 12 — Custom Home Builder

- **Slug**: `12-home-builder` → `Longitude Homes`
- **Concept**: Editorial architectural monograph — Wallpaper-magazine-quality photography, oversized serif titles, project index reading like a book.
- **Palette**: paper `#efe9dd`, ink `#0e0f12`, brass `#a8823c`, sky `#c8d5db`, moss `#4a5b48`.
- **Type**: Recoleta (display) / Söhne (body).
- **Motion**: Each project scrolls through as a chapter with a large image, description, and stat block. Chapters number in the margin.
- **Signature moment**: A page counter that fixes to the top-left and increments as chapters enter viewport (03/12).
- **Assets**: 3 architectural renders (marketing_studio_image, contemporary residential, twilight).
- **Sections**: Hero → 3 project chapters → Process → Enquiry.
- **Copy voice**: architect's monograph. "We build to be lived in for a hundred years."

### 13 — Wedding Venue

- **Slug**: `13-wedding-venue` → `Halcyon Estate`
- **Concept**: A country estate. Cinematic hero video (looping), botanical illustration accents, warm ivory palette. Feel: film photography.
- **Palette**: ivory `#f3ecdf`, ink `#1a1614`, sage `#94a889`, dusty rose `#dcb0a9`, gold `#c9a353`.
- **Type**: Cormorant Garamond (display) / Manrope (body).
- **Motion**: Hero video (h264, ≤600 KB) loops with a slow zoom-in on a garden path. Section transitions fade at 1400ms.
- **Signature moment**: A tour-request form that behaves like an RSVP card — perforated edge, cursive placeholder text.
- **Assets**: 1 hero image (Soul, garden with archway, golden hour). 1 short video loop generated from it (Kling, 4s).
- **Sections**: Hero → The estate (3 spaces) → The day (schedule template) → Testimonials (2 couples) → Tour request.
- **Copy voice**: warm, second-person, "you'll be photographed at four when the light hits the west wall."

### 14 — Barbershop / Grooming Lounge

- **Slug**: `14-barbershop` → `Hartwell & Co.`
- **Concept**: Heritage barbershop — cream, walnut, brass, a barber pole SVG that animates as a signature. Editorial-style photography of a shave.
- **Palette**: cream `#f0e6d2`, walnut `#3a2418`, brass `#c9955a`, ink `#0f0d0b`, sage `#7d8a72`.
- **Type**: Playfair Display (display) / IBM Plex Sans (body).
- **Motion**: Barber-pole animation (SVG stripes). Book-a-cut button pulses subtly.
- **Signature moment**: A live "chair open at 3:15" indicator computed from a simple embedded schedule.
- **Assets**: 1 macro (Soul, hands on a razor, warm light).
- **Sections**: Hero → Services (with prices) → Barbers (3) → Book a chair.
- **Copy voice**: dry, English, "we cut hair. On time. In a warm chair."

### 15 — Plastic Surgery

- **Slug**: `15-plastic-surgery` → `Ravel Surgical`
- **Concept**: A luxury medical practice — editorial quality, warm neutrals, deeply premium. Before/after gallery with careful discretion, credentials-forward.
- **Palette**: bone `#f2ebe0`, ink `#141210`, warm gold `#c8a373`, dusty rose `#e2c5c1`, dim `#8a807a`.
- **Type**: GT Sectra Fine (display) / Söhne (body).
- **Motion**: Portrait crossfades slowly (7s) between three angles. Consultation form eases in from below.
- **Signature moment**: A discreet before/after that uses a slow crossfade rather than a slider — respectful, not gimmicky.
- **Assets**: 1 hero portrait (Soul, editorial), 1 clinic detail (marketing_studio_image, marble + brass).
- **Sections**: Hero → Procedures → Dr. Ravel → Before/after gallery → Consultation form.
- **Copy voice**: senior-attending, careful, no "wow" language.

### 16 — Financial Advisory / Wealth Management

- **Slug**: `16-wealth-management` → `Sonderberg Advisors`
- **Concept**: A private wealth practice with a data-visualization sensibility — thin serif, small mono captions, one clean line chart animating in as a hero flourish.
- **Palette**: parchment `#efe9dd`, ink `#0e0f12`, deep blue `#1a3a75`, gold `#b28a4b`, moss `#3a5348`.
- **Type**: Söhne (display) / IBM Plex Mono (captions).
- **Motion**: A signature line chart draws itself (stroke-dasharray) at 1400ms with `cubic-bezier(.85,0,.15,1)`.
- **Signature moment**: The self-drawing chart. Numbers along the y-axis are performance ranges shown as ranges, not promises.
- **Assets**: 0 generated media.
- **Sections**: Hero (chart) → Philosophy → Services → Team (2 principals, no photos, initials only) → Contact.
- **Copy voice**: fiduciary, careful, "we sign a client agreement, not a marketing letter."

### 17 — Private Jet / Yacht Charter

- **Slug**: `17-charter` → `Meridian Charters`
- **Concept**: Global private charter — a world map with pulsing routes, silver-and-navy palette, live position-style ticker.
- **Palette**: navy `#0d1a2c`, off-white `#f0eee8`, silver `#c5cad0`, gold `#b28a4b`, glass `rgba(255,255,255,.06)`.
- **Type**: Recoleta (display) / IBM Plex Sans (body).
- **Motion**: A canvas world map with route arcs animating (dashed stroke traveling along the arc). A "fleet status" ticker.
- **Signature moment**: The route-map hero. Fictional aircraft/yacht positions blink softly at coordinates.
- **Assets**: 0 generated (map is canvas). Optional: 1 aspirational interior (marketing_studio_image, jet cabin).
- **Sections**: Hero (map) → Fleet → Routes → Concierge → Enquiry.
- **Copy voice**: broker's dry, "wheels-up in 4 hours from most cities."

### 18 — Boutique Hotel

- **Slug**: `18-boutique-hotel` → `The Larkspur`
- **Concept**: A small city hotel with a single-page identity — hero panorama, rooms as chapters, restaurant + rooftop bar as sub-sections.
- **Palette**: cream `#f0e5d4`, ink `#141210`, terracotta `#c46a4a`, sage `#7a8f6d`, gold `#c9a45c`.
- **Type**: Fraunces (display) / GT America (body).
- **Motion**: Hero panorama has a slow pan (12s). Room cards flip vertically on hover.
- **Signature moment**: A room-availability strip that shows tonight's rate and available rooms across three types.
- **Assets**: 1 hero (marketing_studio_image, hotel façade at dusk). 2 room interiors (marketing_studio_image).
- **Sections**: Hero → Rooms (3) → Restaurant → Rooftop bar → Book stay.
- **Copy voice**: warm, first-person plural. "There are eighteen rooms."

### 19 — Solar / Renewable Energy

- **Slug**: `19-solar` → `Sunward Solar`
- **Concept**: A residential solar installer with a scientific-instrument palette — deep blue + electric yellow, roof isometric SVG, live sun-angle calculator.
- **Palette**: deep blue `#0d1a2c`, off-white `#f0eee8`, electric yellow `#f0b400`, warm brass `#c9955a`, moss `#3a5348`.
- **Type**: DM Serif Display (display) / IBM Plex Sans (body).
- **Motion**: An isometric roof SVG shows panels installing one by one as the section scrolls into view.
- **Signature moment**: A miniature "yearly savings estimator" — three sliders (monthly bill, roof age, zip code) and a real-time output.
- **Assets**: 0 generated images.
- **Sections**: Hero → How it works (3 steps) → Estimator → Financing → Free consultation.
- **Copy voice**: engineer-plain, "we install what pays back."

### 20 — Veterinary Hospital

- **Slug**: `20-vet-hospital` → `Cedarwood Veterinary`
- **Concept**: A warm, high-craft clinic for pets — soft palette, hand-drawn animal illustrations, "meet the doctors and the clinic cats" energy.
- **Palette**: cream `#f5efe4`, ink `#1a1614`, sage `#98a884`, terracotta `#c46a4a`, dim `#7a746c`.
- **Type**: Recoleta (display) / Manrope (body).
- **Motion**: Small SVG paw-prints step across the hero at 3s. Card hovers use a warm-glow shadow.
- **Signature moment**: The clinic cats — three named cats with SVG portraits and micro-bios. Client-favorite easter egg.
- **Assets**: 1 hero photo (marketing_studio_image, veterinarian with dog, warm interior).
- **Sections**: Hero → Services → Clinic cats → Doctors → New patient form → Emergency line.
- **Copy voice**: warm, "we sit on the floor to examine your dog."

---

## SHOWPIECE BRIEFS (21–25)

These exist to show the ceiling. Fundamentally different from each other and from the niche seeds.

### 21 — 3D Product Configurator

- **Slug**: `21-product-configurator` → `Astria Objects`
- **Concept**: Real-time 3D configurator for a hand-poured concrete lamp. Orbit controls, material swatches (raw / sealed / graphite), a base-color picker. Feels like a small-batch product page.
- **Tech**: Three.js, GLB model, OrbitControls. `@react-three/fiber`-free — vanilla Three.js for portability.
- **Palette**: paper `#f0ece4`, ink `#111`, concrete `#a8a29a`, one accent per finish.
- **Type**: Söhne Breit (display) / Söhne (body).
- **Motion**: Object idles with a slow y-rotation. Material swap triggers a 400ms crossfade.
- **Signature moment**: The material swap. Also: pressing `space` triggers a satisfying full rotation.
- **Assets**: 1 GLB mesh (image_to_3d from a rendered lamp still). 1 hero still.
- **Sections**: Hero (configurator, fills viewport) → Object story (short) → Specs → Order enquiry.

### 22 — Kinetic Typography Agency

- **Slug**: `22-kinetic-typography` → `Marrow Type`
- **Concept**: The type IS the hero. A variable-font specimen page for a fictional creative agency. Weight/width/slant morph on scroll and cursor.
- **Tech**: Variable font (Roboto Flex + Fraunces) with live font-variation-settings driven by scroll + pointer.
- **Palette**: paper `#f4f0eb`, ink `#0f0f0f`, hot `#ff3d1f`.
- **Type**: Roboto Flex (variable), Fraunces (accent italic).
- **Motion**: Every hero letter has an independent `wght/wdth/slnt` responsive to scroll velocity.
- **Signature moment**: Cursor near a letter widens it and slants it toward the cursor.
- **Assets**: 0.
- **Sections**: Hero (kinetic) → Work (kinetic captions) → Manifesto → Contact.

### 23 — Generative Art

- **Slug**: `23-generative-art` → `Field Study 07`
- **Concept**: A generative-art collection page. Each visit produces a unique seeded canvas piece (flow field over Perlin noise) hero. A gallery of prior seeds. A "mint your seed" CTA.
- **Tech**: Canvas 2D with a seedable PRNG (mulberry32) + Perlin noise. Seed derived from URL param, otherwise random and stamped.
- **Palette**: bone `#f3f0e8`, ink `#0f0f0f`, one accent picked by seed.
- **Type**: Söhne Mono (labels) / Söhne (body).
- **Motion**: Field particles draw for 12s then settle. A "regenerate" button re-seeds.
- **Signature moment**: Every reload is a new artwork. Seed shown in the URL like `?seed=87f342`.
- **Assets**: 0.
- **Sections**: Hero (canvas) → Series index (12 seeds as thumbnails) → About the series → Order print.

### 24 — Scroll-Driven Cinematic Data Story

- **Slug**: `24-data-story` → `Longform: 500 Winters`
- **Concept**: A scroll-driven long-form piece — 5 chapters of a climate/culture data story. Each chapter is a full-viewport scene where data visualizations animate as the reader arrives. Feels like the New York Times "The Dying Sea" pieces.
- **Tech**: `IntersectionObserver` per chapter, canvas + SVG viz. Sticky layout with fixed viz and scrolling narrative text on the right.
- **Palette**: paper `#f2ede4`, ink `#1a1614`, cold blue `#2b5e91`, warm red `#c94a3a`.
- **Type**: Tiempos Text (body) / Söhne (captions).
- **Motion**: Every chapter's viz builds on entering viewport. Chapter titles fade in with `cubic-bezier(.2,.9,.2,1)` 1400ms.
- **Signature moment**: A 500-year line chart that draws forward as the reader scrolls, with historical annotations pinned to years.
- **Assets**: 0.
- **Sections**: Cover → 5 chapters → About the piece.

### 25 — WebGL Hero (Raymarched Liquid Metal)

- **Slug**: `25-webgl-hero` → `Fold — Shader Study`
- **Concept**: A full-viewport WebGL fragment shader hero — signed-distance-field liquid metal on a black canvas, cursor-reactive normals, a single word floating over it in a variable serif. Feels otherworldly.
- **Tech**: Vanilla WebGL 1.0 (portable). Custom fragment shader with SDF sphere + noise displacement + PBR-lite lighting. No Three.js dependency.
- **Palette**: void `#000`, bone `#efe9d9`, mercury `#c2c5cc`, warm accent `#c9a353`.
- **Type**: Fraunces (variable italic) / Söhne Mono (labels).
- **Motion**: Continuous shader animation at 60fps. Cursor position feeds a `u_mouse` uniform influencing displacement.
- **Signature moment**: The shader itself. On idle (5s+ without cursor movement), the metal breathes.
- **Assets**: 0.
- **Sections**: Hero (shader fills viewport) → Studio blurb → Contact. Minimal.

---

## PILOT ORDER

The first phase builds sites **01 (Med spa)**, **04 (Roofing)**, and **25 (WebGL hero)**. The gate report includes live GitHub Pages URLs for each, credit consumption, and lessons — then execution stops for user approval.

*Constitution and briefs frozen at 2026-07-08.*
