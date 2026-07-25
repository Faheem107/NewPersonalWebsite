# CLAUDE.md

Conventions for this repo. Short on purpose; the reasoning lives in the comments
at each site.

## Design language

Cyanotype: cold paper, Prussian blue accent. Content sits on **plates** (framed
field, hairline edge, caption rail), never cards.

Never reintroduce: gradient fills, `backdrop-blur-3xl`, drop shadows, pill
badges, left-border accent bars, hover lifts. Those were the specific v0 tells
that were removed twice. Use `.plate` and `.caption` from `app/globals.css`
rather than inventing a new surface.

## Type

**Inter** for the name and the wordmark only, via `.name`. **Lexend** for
everything else. Both are variable and self-hosted by `next/font`, so they render
identically on every platform and the weight-on-hover interactions work.

Weight is a function of size, not one flat body weight. The `--wght-*` and
`--track-*` tokens in `app/globals.css` are paired: never change a weight without
checking its tracking. Lexend sets optically heavier and wider than most
grotesques, which is why body sits at 340 and display steps carry negative
tracking.

Lexend has no width axis, so `.caption` gets its condensed register from weight
and letter-spacing. `font-synthesis-weight: none` stays.

## Cursor

`lib/motion/pointer.tsx` is a **module-level store, not React state**. This is
load-bearing: when the variant and stick target lived in `useState` on a provider
that every `useStick` element consumed, hovering one link in a dense list
re-rendered the whole subtree. Keep the context value identity-stable, and keep
writes as plain mutations.

`components/custom-cursor.tsx` polls that store from a single rAF loop and writes
transforms straight to the DOM. It stores the stuck **element**, not its rect, and
re-measures each frame, because Lenis fires `scroll` every frame and the old
unstick-on-scroll dropped the cursor constantly. No `mix-blend-mode`: it flickers
over `.plate`'s `backdrop-filter`.

`useStick` is for isolated controls. Dense lists use `useHighlight`.

## Overlays

Anything full-screen must portal to `document.body`. Fixed positioning is
relative to the nearest transformed ancestor, and the GSAP entrance timelines put
transforms on wrappers, which is what pinned the torus modals above the torus.

Scroll locking goes through `useScrollLock` (`lib/motion/scroll-lock.ts`).
`overflow: hidden` alone does not stop Lenis.

## Torus

`lib/torus-geometry.ts` is the single source for the camera and the shape. The
shader reads it as uniforms and `circular-menu.tsx` reads it through `pxPerUnit`,
so the ring of icons is derived from the torus rather than guessed. Never
reintroduce a pixel radius here: the ring sat at a flat 150px for a long time and
was concentric with nothing.

That GSAP entrance is a trap for anything measured. It scales `[data-torus]` from
0.9, and a bounding rect includes an ancestor's transform, so r3f sized its canvas
mid-animation and rendered 32px off-centre for months. The `Canvas` keeps
`resize={{ offsetSize: true }}` for that reason.

The magnet winds down to almost nothing while the menu is open, since the pointer
is necessarily inside the form whenever the icons are showing.

## Content

`content/research.ts` and `content/thoughts.ts` are the single source for those
pages **and** the search index. Notes are derived from the filesystem: adding
`content/notes/<subject>/<topic>.mdx` creates the route, the sidebar entry, the
prev/next links and the search entries with no code change.

`lib/search.ts` is server-only (it reads the notes tree). The matcher lives in
`lib/search-match.ts` so the client dialog can import it without pulling
`node:fs` into the browser bundle. Matching is strict all-terms, not fuzzy: a
fuzzy scorer matched "brewster" against "Probability Distributions" and navigated
to the wrong page.

## Writing

**No em dashes anywhere.** Use a comma, colon or full stop, or restructure.

Voice is humble and philosophical, and plain enough to follow first time. Avoid
the generic-AI tells: "Here is the strange part", rhetorical questions as
transitions, triads for rhythm, a closing aphorism on every piece, "genuinely
beautiful", "worth thinking about". Vary sentence and paragraph length; uniform
three-paragraph blocks are themselves a tell.

Watch the last clause of a sentence in particular. That is where a flourish gets
smuggled in ("the only law that tells time which way to run", "the language
everything else is written in"), and it is usually doing the job the description
should have done.

`content/thoughts.ts` follows Vsauce's shape: open on something concrete, follow
one thread, name the effect or study where there is one, stop before the moral.
Where a well-known story turns out to be shakier than its retelling, say so in
the piece.

## Backdrop

`components/backdrop/pattern.tsx` draws one construction per section: stars,
halftone, interference, phyllotaxis, lattice. Every point's position comes from
`gl_VertexID` in the vertex shader, so there are no attribute buffers and the CPU
does nothing between frames.

Each pattern is a real construction rather than decoration, and should stay that
way: interference is an actual path difference between two sources, phyllotaxis
is the golden angle that packs a sunflower head and lights its Fibonacci arms,
halftone varies dot **area** against a tone field and then defocuses it by
distance from a sweeping focal plane. `halftone` replaced `orbits`, which was
nested tilted ellipses and resolved into a rosette: a real construction, but the
one that read as decoration, and it was sitting behind the photographs.

Everything is sized against `reach`, the centre-to-corner distance of the
viewport, and the point budget grows with it through `countFor`. Both are there
so a construction fills the screen at any aspect **without being stretched**: the
sunflower head gets more seeds at the same packing, the halftone screen gets more
dots at the same pitch. If a pattern looks thin on a wide display, that is a
budget question, not a reason to scale the geometry up.

`v_soft` is the one varying besides alpha. It exists because a defocused dot is
a wide disc with a soft rim, not a large dot with a hard one; every pattern but
halftone leaves it at the 0.26 the fragment shader used to hard-code.

The field leans slightly toward the pointer, reading the same module-level store
as the cursor. Keep it a lean: the displacement is the offset times a falloff so
it vanishes both far away and at the pointer itself, it peaks around ten pixels,
and the brightness term is 12%. It is not a spotlight.

**No haze layer.** An earlier version put a soft noise wash behind these and it
read as fog: it hid the pattern and made the whole site look glassy. If the
backdrop needs to be quieter on a given page, pass `alpha`, do not add
atmosphere.

Keep the guards: DPR capped at 2, `IntersectionObserver` plus `visibilitychange`
to pause offscreen, reduced motion draws one frame then cancels, no WebGL2 means
no backdrop.

## Glass

`.plate` is a framed field, not frosted glass. The blur is 2px and the fill is
about half opaque, so the backdrop reads through it. It was 10px over a 74% fill
and that was the single biggest reason the patterns behind it could not be seen.

Dialogs and modals use `.plate-solid` instead: they sit over the whole page
rather than over the backdrop, and there the text does need something opaque.

## Git

- Work on `ui/rebuild`, then fast-forward `main` to it. The old rule here was
  never to merge to `main`, on the grounds that the v0 integration would
  regenerate the UI the rebuild removed. `main` has carried the rebuild since
  `be8c8e2` and the v0 branch has not moved since May 2026, so that risk is
  spent. If `origin/v0/*` ever gains a commit, treat the old rule as back in
  force and ask before pushing to `main`.
- Commits carry no AI co-author trailers.
- The ~90 photography originals live outside the repo in `Pictures for Website/`
  and must be downscaled to ~2400px before any of them is committed.
