"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { setLenis, wheelIsOwned } from "@/lib/smooth-scroll";

/**
 * The page glides with the wheel the way the reference does: the wheel moves a
 * target and the page follows it with inertia. Touch keeps its native scroll,
 * and the works section takes the wheel back for its own steps.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.09,
      autoRaf: true,
      stopInertiaOnNavigate: true,
      virtualScroll: (data) =>
        !(data.event.type.includes("wheel") && wheelIsOwned()),
    });

    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
