# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Ibraheem Barber Direction

- The approved visual source is `exec-19383d9b-80b4-49d4-84f1-b1a6aa8cf07b.png`: bold neo-grotesk typography, cinematic black/cream/sand palette, alternating service bands, and editorial image crops.
- Use Peachweb only as inspiration for immersive pacing, atmospheric depth, floating navigation, scroll cues, and restrained motion. Do not copy its branding, purple palette, 3D imagery, or product layout.
- Use built-in ImageGen for still photography. Reserve Higgsfield credits for an explicitly approved hero-video concept after showing its exact cost.
- The approved scroll-transformation direction uses a seamless warm-white studio, not the site's dark cinematic treatment: an empty chair, client descent, flying barber cape, rotating haircut-and-beard progression, and a clean final reveal. Keep generated media backgrounds visually continuous with the white section.
- The transformation must prioritize physical-phone smoothness and realism: use the approved single 24 fps human transformation film as native video, not Blender characters, a WebGL frame decoder, or per-frame network requests. Keep the video background continuous with the warm-white section and avoid backdrop blur over it. The section remains scroll-directed by mapping scroll progress to the paused video's timeline; preserve dense video keyframes so forward and reverse seeking stay responsive.
- The approved Dubai identity interlude sits directly after the transformation and before Services: warm paper, oversized `CUT IN DUBAI.` type, exact city coordinates, Arabic `دبي`, a restrained sand sun following a scroll-driven meridian path, and delicate sepia coastal linework. Keep it editorial and geographic rather than using generic skyline photography.
- Use real Three.js for selected dimensional moments; the approved first application is an interactive barber-chair artifact in the precision statement. Keep it restrained, lazy-loaded, responsive, and reduced-motion safe.
- Ibraheem's supplied casual portrait is the identity reference for face, complexion, eyebrows, and curl pattern. Use the generated `ibraheem-editorial-v2` studio portrait for the About section; do not substitute a generic model.
- WhatsApp and phone are the conversion path. Keep all contact values centralized. Ibraheem's supplied number is `+971 55 166 2381` (`971551662381` for WhatsApp links).
- Mobile is a first-class presentation: keep the transformation subject large enough to read, preserve a real empty-chair poster beneath the video for loading and reduced-motion states, unlock native video scrubbing from the first touch gesture and allow coarse-pointer seeks to follow the finger, keep its chapter rail clear of the floating booking control, and hide the floating WhatsApp control from the Contact section onward so it never obscures the phone actions.
- The public share URL is `https://ibraheem-barber.vercel.app/`. Do not share Vercel branch aliases containing `-git-main-`; those preview domains are protected and can prevent Safari's media loader from receiving the transformation MP4.
- Do not show prices or fabricate reviews, awards, experience, clients, qualifications, address, hours, phone number, or social handles.
