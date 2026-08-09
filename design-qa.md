# Design QA

## Comparison target

- Source visual truth: `qa/transformation-pack-24fps/source-frame-0253.webp`, extracted from the approved 12-second composite master at 24 fps
- Desktop implementation: `qa/transformation-sequence-review/desktop-reveal.png`
- Mobile implementation: `qa/transformation-sequence-review/mobile-transform.png`
- Reverse-scrub implementation: `qa/transformation-sequence-review/desktop-arrival-after-reverse.png`
- Combined comparison: `qa/transformation-sequence-review/frame-sequence-comparison.png`
- Source pixels: 1280 x 720
- Desktop capture: 1425 x 1000 from a 1440 x 1000 responsive override
- Mobile capture: 375 x 844 from a 390 x 844 responsive override
- State: Cut Ritual chapter 04 — Reveal for the primary comparison

## Full-view comparison evidence

`qa/transformation-sequence-review/frame-sequence-comparison.png` places the exact final sequence frame and the rendered Three.js Reveal state in one image. The client, haircut, chair, cape, warm-white studio, brass details, floor contact, and viewing angle remain visibly consistent. The implementation intentionally scales the subject down to reserve the left editorial column and bottom chapter rail while keeping the source background continuous with the section.

## Focused evidence

- `desktop-reveal.png` verifies a clean final haircut, readable editorial copy, the complete chair, and the active Reveal chapter at the desktop breakpoint.
- `desktop-arrival-after-reverse.png` verifies that a rapid Reveal → Drape → Transform → Arrival reversal resolves to the correct early frame without double exposure or a stale decoded video frame.
- `mobile-transform.png` verifies the smaller 720 px sequence at the mobile breakpoint, including readable copy, enlarged chair, visible chapter rail, and unobstructed booking CTA.

## Required fidelity surfaces

- Fonts and typography: Archivo and IBM Plex Mono remain consistent with the established site. Large uppercase chapter headings retain tight tracking and strong contrast without obscuring the chair.
- Spacing and layout rhythm: the pinned desktop composition keeps its editorial column, centered Three.js stage, metadata line, vertical signature, and four-step rail. Mobile separates copy, subject, rail, and booking CTA into distinct bands.
- Colors and visual tokens: the approved warm-white source background, black typography, and restrained sand/brass accents are preserved. The CanvasTexture uses sRGB output without the video-only contrast shader.
- Image quality and asset fidelity: the three supplied AI clips remain preserved in the 12-second, 1280 x 720, silent H.264 master. The master is sampled into 289 WebP frames at the source 24 fps for both 1280 x 720 desktop and 720 x 405 mobile delivery.
- Interaction and performance: each device fetches one packed sequence—5.2 MB desktop or 2.2 MB mobile—before the section is reached. The renderer slices compressed WebPs from that in-memory pack, so scrolling creates no per-frame network requests. Two Three.js CanvasTextures hold the current adjacent pair; a bounded LRU holds 24 decoded desktop frames or 32 mobile frames and closes evicted ImageBitmaps.
- GPU cost: mobile rendering is capped at a 1x pixel ratio with antialiasing disabled, and the moving canvas no longer sits beneath a live backdrop blur.
- Accessibility: chapter controls are real buttons with descriptive labels and `aria-current`; the canvas has a semantic text alternative; keyboard focus remains visible; reduced motion resolves to the final frame.

## Findings

No actionable P0, P1, or P2 visual or interaction findings remain for the frame-sequence experience.

## Verification

- Browser: Codex in-app browser.
- Desktop: Reveal, Drape, Transform, and Arrival chapter navigation, including rapid forward/reverse scrubbing.
- Mobile: Transform chapter at 390 x 844 using the dedicated 720 px sequence.
- Console: zero warnings and zero errors after desktop and mobile interaction passes.
- Assets: one 289-frame desktop pack and one 289-frame mobile pack are present in the Sites build.
- Motion audit: all 288 adjacent 24 fps frame pairs were measured; 266 low-motion pairs interpolate and 22 high-motion or edit pairs snap to the nearest real frame.
- Build: `npm run build` passed.
- Sites worker tests: `npm run test:sites` passed, 4 of 4.

## Follow-up polish

- No blocking follow-up remains. A physical-device pass can still tune the subjective chapter pacing if desired.

final result: passed
