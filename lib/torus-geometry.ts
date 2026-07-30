/**
 * The torus, in one place. The shader reads these as uniforms and
 * circular-menu.tsx reads them through pxPerUnit, so the ring of icons derives
 * from the shape. Never put a pixel radius in here.
 */

export const CAMERA_Z = 11.4
/** vertical field of view, degrees */
export const CAMERA_FOV = 45

/** Ring centreline and tube. Keep any size change uniform across all three. */
export const TORUS_RADIUS = 2.3
export const TUBE_RADIUS = 0.77

/** Radius of the ball the torus becomes when the menu opens. */
export const SPHERE_RADIUS = 3.05

/**
 * World height visible across a square canvas at z = 0, the plane the form sits
 * in. Lowering CAMERA_Z shrinks it, so the shape takes more of the frame.
 */
const VIEW_UNITS = 2 * CAMERA_Z * Math.tan(((CAMERA_FOV * Math.PI) / 180) / 2)

/** Scale factor for a square canvas of the given CSS size. */
export function pxPerUnit(canvasPx: number) {
  return canvasPx / VIEW_UNITS
}

/** Padding between the sphere's silhouette and the edge of its container. */
export const CONTAINER_PAD = 20

/** CSS size of the box the form needs, for a canvas of the given size. */
export function containerForCanvas(canvasPx: number) {
  return Math.round(SPHERE_RADIUS * pxPerUnit(canvasPx) * 2 + CONTAINER_PAD)
}

/**
 * The inverse. Sizing runs this way round so the shape follows the room the page
 * has, rather than a fixed canvas overflowing a phone.
 */
export function canvasForContainer(containerPx: number) {
  return ((containerPx - CONTAINER_PAD) * VIEW_UNITS) / (2 * SPHERE_RADIUS)
}
