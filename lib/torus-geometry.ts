/**
 * The torus, in one place.
 *
 * These numbers used to exist twice: once as literals inside the vertex shader
 * string in components/torus-shader.tsx, and once as hand-tuned pixel constants
 * in components/circular-menu.tsx. Nothing kept them in agreement, so the ring
 * of icons sat at whatever radius had looked right at the time rather than
 * anywhere the shape actually is.
 *
 * Both sides read from here now, and the conversion between world units and
 * pixels is a function rather than an assumption.
 */

export const CAMERA_Z = 13
/** vertical field of view, degrees */
export const CAMERA_FOV = 45

/**
 * Ring centreline and tube of the torus.
 *
 * These three constants (with SPHERE_RADIUS) are the whole form, and they were
 * scaled up together by ~1.28 from their tuned values (1.8 / 0.6 / 2.4) to make
 * the torus read larger without touching any of the relationships between them.
 * Because the icon ring, the shader torus and the container all derive from
 * these through pxPerUnit, a uniform bump enlarges everything at once: the ring
 * of icons still sits on the tube line and the silhouette still closes just
 * outside it. Keep any future size change uniform for the same reason.
 */
export const TORUS_RADIUS = 2.3
export const TUBE_RADIUS = 0.77

/**
 * Radius of the ball the torus becomes when the menu opens.
 *
 * Was 3.6, which projected wider than the container that held it, so the icons
 * floated in the middle of a shape whose edge was off past the name. At the
 * tuned 2.4 the silhouette sat just outside the icon ring; this 3.05 is that
 * same ratio carried through the uniform enlargement above.
 */
export const SPHERE_RADIUS = 3.05

/**
 * World height visible across a square canvas at the z = 0 plane. The camera
 * looks at the origin, so this is the plane the form sits in.
 */
const VIEW_UNITS = 2 * CAMERA_Z * Math.tan(((CAMERA_FOV * Math.PI) / 180) / 2)

/** Scale factor for a square canvas of the given CSS size. */
export function pxPerUnit(canvasPx: number) {
  return canvasPx / VIEW_UNITS
}

/** Padding between the sphere's silhouette and the edge of its container. */
export const CONTAINER_PAD = 24

/** CSS size of the box the form needs, for a canvas of the given size. */
export function containerForCanvas(canvasPx: number) {
  return Math.round(SPHERE_RADIUS * pxPerUnit(canvasPx) * 2 + CONTAINER_PAD)
}

/**
 * The inverse: how large a canvas has to be for the form to fill a container of
 * the given width.
 *
 * The canvas was a flat 600px on phones and 800px elsewhere, which put the
 * container at 364px on a 375px screen with 327px of room after the page
 * padding, so the home page scrolled sideways and every column under it read as
 * shifted. Sizing runs this way round now: measure the room available, and let
 * the shape follow. Everything else (the icon ring, the shader torus) already
 * derives from pxPerUnit, so it all scales together.
 */
export function canvasForContainer(containerPx: number) {
  return ((containerPx - CONTAINER_PAD) * VIEW_UNITS) / (2 * SPHERE_RADIUS)
}
