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

/** ring centreline of the torus */
export const TORUS_RADIUS = 1.8
export const TUBE_RADIUS = 0.6

/**
 * Radius of the ball the torus becomes when the menu opens.
 *
 * Was 3.6, which projected to 534px across: wider than the container that held
 * it, so the icons floated in the middle of a shape whose edge was off past the
 * name. At 2.4 the silhouette sits just outside the icon ring, which is what
 * makes the icons read as being inside it.
 */
export const SPHERE_RADIUS = 2.4

/**
 * World height visible across a square canvas at the z = 0 plane. The camera
 * looks at the origin, so this is the plane the form sits in.
 */
const VIEW_UNITS = 2 * CAMERA_Z * Math.tan(((CAMERA_FOV * Math.PI) / 180) / 2)

/** Scale factor for a square canvas of the given CSS size. */
export function pxPerUnit(canvasPx: number) {
  return canvasPx / VIEW_UNITS
}
