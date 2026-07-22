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

Voice is humble and philosophical. Avoid the generic-AI tells: "Here is the
strange part", rhetorical questions as transitions, triads for rhythm, a closing
aphorism on every piece, "genuinely beautiful", "worth thinking about". Vary
sentence and paragraph length; uniform three-paragraph blocks are themselves a
tell.

## Backdrop

`components/backdrop/wash.tsx` draws both layers from one stream function, so the
particle trails run along the grain of the wash instead of across it. Keep the
guards: DPR capped at 1.5, `IntersectionObserver` plus `visibilitychange` to
pause offscreen, reduced motion draws one frame then cancels, no WebGL2 means no
backdrop. Trails are polylines over a fixed timestep, not per-frame segments,
which would be sub-pixel and frame-rate dependent.

## Git

- Work on `ui/rebuild`. **Do not merge to `main`** until the v0 integration is
  disconnected, or it will regenerate the UI this removed.
- Commits carry no AI co-author trailers.
- The ~90 photography originals live outside the repo in `Pictures for Website/`
  and must be downscaled to ~2400px before any of them is committed.
