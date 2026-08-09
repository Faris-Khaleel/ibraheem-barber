# Design QA — Dubai Meridian

## Comparison target

- Source visual truth: `/Users/fariskhaleel/.codex/generated_images/019fe06e-5f48-7a73-9f6f-f755d79ed3ab/exec-8d7e8578-92f5-4d2a-b080-95aaa27a2dad.png`
- Desktop implementation: `qa/dubai-meridian/implementation-desktop-final.png`
- Mobile implementation: `qa/dubai-meridian/implementation-mobile-final.png`
- Combined comparison: `qa/dubai-meridian/comparison-desktop.png`
- Source pixels: 1488 x 1058, normalized to 1440 x 1024 for comparison
- Desktop capture: 1440 x 1024 CSS viewport, 1425 x 1024 captured content area
- Mobile capture: 390 x 844 responsive override, 375 x 844 captured content area
- State: Dubai Meridian mid-scroll, desktop progress 0.575 and mobile progress 0.572

## Full-view comparison evidence

The combined comparison places the selected Option 1 mock and the rendered mid-scroll implementation in one image. The implementation preserves the mock's warm-paper field, oversized `CUT IN DUBAI.` typography, exact coordinates, Arabic locality marker, sand sun, orbital waypoints, black meridian arc, sepia coastal contour, thin rule, and direct transition into the alternating Services bands. The existing fixed black navigation remains visible because this is an insertion into the established live site rather than a standalone page comp.

## Focused evidence

- Desktop confirms the selected left-heavy typography, large right-cropped sun, restrained geographic linework, and uninterrupted cream-to-services transition.
- Mobile confirms the same hierarchy reflows without horizontal overflow: coordinates, headline, Dubai label, sun/meridian, coastal contour, scroll cue, and persistent WhatsApp conversion remain legible.
- The sun follows a curved scroll path rather than a linear translation. Verified samples: start `72% / 64%`, middle `91.62% / 44.95%`, end `106% / 68%`.

## Required fidelity surfaces

- Typography: existing Archivo and IBM Plex Mono tokens are retained; the display is uppercase, tightly tracked, and sized to the selected mock.
- Color: the section uses the established warm paper and black, plus one muted sand object. No purple, gradients, cards, or generic skyline photography were introduced.
- Assets: both decorative surfaces are real ImageGen assets. The transparent sun is an optimized 1254 x 1254 WebP; the meridian plate is a 1774 x 887 WebP.
- Motion: one passive scroll listener is RAF-gated. It updates CSS custom properties for the sun position and restrained plate parallax; there are no per-frame network requests or canvas decoders.
- Accessibility: the section has a labelled heading, decorative images are hidden from assistive technology, Arabic direction and language are declared, and reduced motion freezes the composition at its representative midpoint.
- Responsive behavior: desktop and mobile have purpose-built scale and placement rules; mobile produced zero horizontal overflow.

## Findings and fix history

- P1 fixed: removed the solid headline backing that visibly separated the copy block from the generated paper texture.
- P2 fixed: reduced desktop sun scale and headline size to match the mock's balance.
- P2 fixed: stacked `DUBAI / UAE` and `دبي` and lifted the pair above the horizontal meridian rule.
- No actionable P0, P1, or P2 findings remain.

## Verification

- Browser: Codex in-app browser, desktop and mobile responsive passes.
- Console: zero warnings and zero errors after interaction.
- Motion: start, midpoint, and end positions verified; forward scroll reaches progress 1.000.
- Build: `npm run build` passed and emitted `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
- Sites worker tests: `npm run test:sites` passed, 4 of 4.

## Mobile responsive follow-up

- Audited the hero, navigation, work gallery, transformation, Dubai interlude, Services, About, image break, Contact, final CTA, and footer at 390 x 844 and 320 x 720.
- Enlarged the transformation film on phones and lifted the four-step chapter rail above the booking control.
- Reduced the floating WhatsApp control's footprint, removed hidden-link focus/pointer exposure, and made it withdraw from Contact onward so the phone number remains unobstructed.
- Tightened the smallest About heading, added safe-area-aware header spacing, and disabled sticky hover treatments on touch devices.
- Verified zero horizontal overflow at the 390 x 844 viewport and clean fitting at the 320 x 720 compact viewport.
- Added a dedicated 701–980 px tablet composition and a real chair poster beneath the native video, so the chair remains visible before decoding, during slow loading, and with reduced motion.
- Added a touch-gesture video unlock and coarse-pointer fast-seek path so iOS and mobile Safari repaint the paused transformation film while the finger is actively scrolling.
- Confirmed the protected branch alias redirects the MP4 request to Vercel SSO, while `https://ibraheem-barber.vercel.app/videos/ritual-transformation.mp4` returns public `video/mp4` responses with byte-range support. The public production domain is now canonical, and the redundant mobile transformation topline was removed.
- Reproduced the transformation in an iPhone 15 WebKit session with a coarse pointer. At chapter 03 the native video decoded at 7.59 seconds with `readyState: 4`, the visible video layer replaced the poster, the deterministic fallback advanced to `03-cape-before.webp`, horizontal overflow remained zero, and the console remained clean.

final result: passed
