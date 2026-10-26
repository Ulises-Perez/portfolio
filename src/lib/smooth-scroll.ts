import type Lenis from "lenis";

let instance: Lenis | null = null;
let wheelOwned = false;

/** The page glider, once the client mounts it. */
export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

/**
 * Whether the works are answering the wheel for the event being dispatched.
 * The works handler runs in the capture phase, so this is already decided
 * when Lenis sees the same event.
 */
export function setWheelOwned(value: boolean) {
  wheelOwned = value;
}

export function wheelIsOwned() {
  return wheelOwned;
}

/** The glide of a work: quick to leave, slow to settle. */
export function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}
