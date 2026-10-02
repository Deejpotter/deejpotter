"use client";

import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";

/**
 * Small client-side pieces that give the otherwise static homepage some life.
 * Each one is decorative: the page reads the same with JavaScript off or with
 * reduced motion on (the CSS in globals.css stands the animations down).
 */

/** Slides its content in the first time it scrolls into view. */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  // null until mounted: the server HTML has no data-shown, so nothing is hidden
  // for visitors whose JavaScript is slow or blocked.
  const [shown, setShown] = useState<boolean | null>(null);

  useEffect(() => {
    const node = ref.current;
    // Without IntersectionObserver (old browsers, tests) show it straight away
    // rather than leaving the section invisible.
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    setShown(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-shown={shown ?? undefined} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/**
 * Tracks the cursor over a grid so each `.spotlight` tile can light up where
 * the pointer is. One listener on the grid instead of one per tile.
 */
export function SpotlightGrid({ children, className = "" }: { children: ReactNode; className?: string }): ReactElement {
  return (
    <div
      className={className}
      onPointerMove={(event) => {
        const tile = (event.target as HTMLElement).closest<HTMLElement>(".spotlight");
        if (!tile) return;
        const box = tile.getBoundingClientRect();
        tile.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
        tile.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/**
 * A wireframe box that "prints" layer by layer and tilts towards the cursor,
 * so the hero shows the physical side of the work, not just the web side.
 */
export function PrintCube(): ReactElement {
  const [tilt, setTilt] = useState({ x: -18, y: 32 });

  useEffect(() => {
    // Respect reduced motion: keep the resting angle and skip the listener.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (event: PointerEvent) => {
      const dx = event.clientX / window.innerWidth - 0.5;
      const dy = event.clientY / window.innerHeight - 0.5;
      setTilt({ x: -18 - dy * 20, y: 32 + dx * 40 });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const faces = [
    "rotateY(0deg) translateZ(5rem)",
    "rotateY(90deg) translateZ(5rem)",
    "rotateY(180deg) translateZ(5rem)",
    "rotateY(-90deg) translateZ(5rem)",
  ];

  return (
    <div aria-hidden="true" className="flex h-72 items-center justify-center [perspective:900px]">
      <div
        className="relative h-40 w-40 transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {faces.map((transform) => (
          <div
            key={transform}
            className="absolute inset-0 overflow-hidden border border-emerald-300/70 bg-emerald-300/5"
            style={{ transform }}
          >
            {/* Layer lines, like a print seen side on */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_top,transparent_0_7px,rgba(110,231,183,0.18)_7px_8px)]" />
            <div className="print-fill absolute inset-0 bg-gradient-to-t from-emerald-400/50 to-emerald-300/10" />
          </div>
        ))}
        <div
          className="absolute inset-0 border border-emerald-300/70"
          style={{ transform: "rotateX(90deg) translateZ(5rem)" }}
        />
        <div
          className="absolute inset-0 border border-emerald-300/40 bg-emerald-400/10"
          style={{ transform: "rotateX(-90deg) translateZ(5rem)" }}
        />
      </div>
    </div>
  );
}
