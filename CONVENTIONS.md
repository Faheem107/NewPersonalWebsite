# Conventions

Short on purpose. These are the decisions that are not obvious from the code.

## Design language

Cyanotype: cold paper, Prussian blue accent. Content sits on **plates**, which
are a framed field with a hairline edge and a caption rail, never cards.

Never reintroduce: gradient fills, heavy backdrop blur, drop shadows, pill
badges, left-border accent bars, hover lifts. Use `.plate` and `.caption` from
`app/globals.css` rather than inventing a new surface.

## Type

**Inter** for the name and the wordmark only, via `.name`. **Lexend** for
everything else. Both are variable, which the weight-on-hover interactions
depend on.

Weight is a function of size. The `--wght-*` and `--track-*` tokens in
`app/globals.css` are paired: never change a weight without checking its
tracking. Lexend has no width axis, so `.caption` gets its condensed register
from weight and letter-spacing, and `font-synthesis-weight: none` stays.

## Comments

Short, and only where the code is genuinely non-obvious. No change logs, no
narration of what something used to be. If a constraint is load-bearing, one or
two lines naming it is enough.

## Entrances

Anything with a scripted entrance carries `data-enter`, which
`html[data-motion='on'] [data-enter] { opacity: 0 }` holds hidden from the first
painted frame. The inline script in `app/layout.tsx` sets that flag, so nothing
is ever hidden with JavaScript off or under reduced motion. The animation code
removes the attribute as it takes over, and every tween carries `clearProps`: a
leftover transform is a stacking context, and one on each article is what buried
the glossary boxes under the following text.

Entrance effects run through `useIsomorphicLayoutEffect`
(`lib/motion/layout-effect.ts`), not `useEffect`, or the content paints before it
is hidden. `PageHeader` waits on `document.fonts.ready` before splitting the
heading, since splitting against the fallback face re-wraps it mid-animation.

## Overlays

Anything full-screen must portal to `document.body`. Fixed positioning resolves
against the nearest transformed ancestor, which is how the torus modals ended up
pinned above the torus.

Scroll locking goes through `useScrollLock` (`lib/motion/scroll-lock.ts`). It
stops Lenis, sets `overflow: hidden`, **and** pins the body with
`position: fixed`. All three are needed: Lenis does not smooth touch, and
`overflow: hidden` does not stop a touch drag in mobile Safari.

## Cursor

`lib/motion/pointer.tsx` is a **module-level store, not React state**. Every
`useStick` element consumes it, so held in a provider it re-renders the whole
subtree on each hover. Keep the context value identity-stable and keep writes as
plain mutations.

`components/custom-cursor.tsx` polls it from one rAF loop and writes transforms
straight to the DOM. It stores the stuck **element**, not its rect, and
re-measures each frame, because Lenis fires `scroll` every frame. No
`mix-blend-mode`: it flickers over `.plate`'s `backdrop-filter`.

`useStick` is for isolated controls. Dense lists use `useHighlight`.

## Torus

`lib/torus-geometry.ts` is the single source for the camera and the shape. The
shader reads it as uniforms and `circular-menu.tsx` reads it through `pxPerUnit`,
so the ring of icons derives from the torus. Never put a pixel radius here. Size
is set by `CAMERA_Z`: lowering it makes the form occupy more of the frame without
touching any of the shape's own numbers.

The colour is a toned cyanotype, ramping deep Prussian to cyan to violet to a
warm gold around the ring. Dark mode blends additively, so nothing in the ramp
may approach 1.0 or the silhouette clips to a flat white ring.

The `Canvas` keeps `resize={{ offsetSize: true }}` so an ancestor's transform
cannot size it, and `dpr={[1, 2]}` so a phone does not render at 3x.

The magnet winds down to almost nothing while the menu is open, since the pointer
is necessarily inside the form whenever the icons are showing.

## Content

`content/research.ts` and `content/thoughts.ts` are the single source for those
pages **and** the search index. Notes come from the filesystem: adding
`content/notes/<subject>/<topic>.mdx` creates the route, the sidebar entry, the
prev/next links and the search entries with no code change.

`lib/search.ts` is server-only. The matcher lives in `lib/search-match.ts` so the
client dialog can import it without pulling `node:fs` into the browser bundle.
Matching is strict all-terms, not fuzzy.

## Writing

**No em dashes anywhere.** Use a comma, colon or full stop, or restructure.

Voice is humble and plain enough to follow first time. Avoid the generic tells:
"Here is the strange part", rhetorical questions as transitions, triads for
rhythm, a closing aphorism on every piece, "genuinely beautiful", "worth thinking
about". Vary sentence and paragraph length.

Watch the last clause of a sentence. That is where a flourish gets smuggled in,
and it is usually doing the job the description should have done.

## Glosses

`content/glossary.ts` holds every term that explains itself. Prose refers to one
with `[[key]]` or `[[key|words as they read here]]`, and `lib/annotate.tsx` is
the only thing that parses it. Route any new content source through
`stripAnnotations`, which is why the search index never shows a bracket.

Prefer `[[key|display]]`. The bare form falls back to the entry's capitalised
`term` and lands mid-sentence as "One The micromort is...".

Dotted underline means "there is an explanation here"; `.rule-link`'s solid
underline means "this navigates". Keep them distinguishable.

The box sets its own typography through `.gloss-box`, because a gloss inside a
`.caption` would inherit uppercase and 0.14em tracking. Its horizontal clamp goes
through motion's `x`, never a `transform` in `style`, which motion overwrites on
the first frame.

Budget it: at most two terms per research entry and one or two per piece.

## Backdrop

`components/backdrop/pattern.tsx` draws one construction per section. Every
point's position comes from `gl_VertexID`, so there are no attribute buffers and
the CPU does nothing between frames.

Each pattern is a real construction rather than decoration and should stay that
way. Everything is sized against `reach`, the centre-to-corner distance of the
viewport, and the budget grows with it through `countFor`, so a construction
fills the screen at any aspect **without being stretched**. If a pattern looks
thin on a wide display that is a budget question, not a reason to scale the
geometry.

The field leans slightly toward the pointer. Keep it a lean, not a spotlight.

**No haze layer.** A soft noise wash behind these reads as fog. If the backdrop
needs to be quieter on a page, pass `alpha`.

The effect waits for `resolvedTheme`: building the context before next-themes has
resolved only tears it down a moment later, and the restart is visible as a
flicker on every page.

Keep the guards: DPR capped at 2, `IntersectionObserver` plus `visibilitychange`
to pause offscreen, reduced motion draws one frame then cancels, no WebGL2 means
no backdrop.

## Glass

`.plate` is a framed field, not frosted glass. The blur is 2px over a roughly
half-opaque fill, so the backdrop reads through it.

Dialogs and modals use `.plate-solid`: they sit over the whole page rather than
over the backdrop, and there the text does need something opaque.

## Git

- Work on `ui/rebuild`, then fast-forward `main` to it. If `origin/v0/*` ever
  gains a commit, ask before pushing to `main`.
- Commits carry no co-author trailers.
- The photography originals live outside the repo in `Pictures for Website/` and
  must be downscaled to ~2400px before any of them is committed.
