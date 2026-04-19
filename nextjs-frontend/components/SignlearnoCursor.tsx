"use client";

import { Hand } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RING_LERP = 0.12;
const HAND_LERP = 0.28;

type CursorMode = "default" | "pointer" | "text";

function getModeFromElement(el: Element | null): CursorMode {
  if (!el || !(el instanceof Element)) return "default";
  if (el.closest("[data-no-custom-cursor]")) return "default";
  if (el.closest("input, textarea, select, [contenteditable='true']")) return "text";
  if (
    el.closest(
      'a[href], button, [role="button"], summary, label[for], input[type="checkbox"], input[type="radio"]',
    )
  ) {
    return "pointer";
  }
  return "default";
}

export function SignlearnoCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const handPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !motion.matches);
    sync();
    fine.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("signlearno-custom-cursor");
    document.body.classList.add("signlearno-custom-cursor");
    document.body.setAttribute("data-signlearno-cursor", "default");
    return () => {
      document.documentElement.classList.remove("signlearno-custom-cursor");
      document.body.classList.remove("signlearno-custom-cursor");
      document.body.removeAttribute("data-signlearno-cursor");
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      const t = targetRef.current;
      const ring = ringPosRef.current;
      const hand = handPosRef.current;

      ring.x += (t.x - ring.x) * RING_LERP;
      ring.y += (t.y - ring.y) * RING_LERP;
      hand.x += (t.x - hand.x) * HAND_LERP;
      hand.y += (t.y - hand.y) * HAND_LERP;

      const ringEl = ringRef.current;
      const handEl = handRef.current;
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (handEl) {
        handEl.style.transform = `translate3d(${hand.x}px, ${hand.y}px, 0) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      const below = document.elementFromPoint(e.clientX, e.clientY);
      document.body.setAttribute("data-signlearno-cursor", getModeFromElement(below));
    };

    const onLeave = () => {
      setVisible(false);
      document.body.setAttribute("data-signlearno-cursor", "default");
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const fade = visible ? "opacity-100" : "opacity-0";

  return (
    <>
      <div
        ref={ringRef}
        className={`signlearno-cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] transition-opacity duration-200 ease-out ${fade}`}
        aria-hidden
      />
      <div
        ref={handRef}
        className={`signlearno-cursor-hand pointer-events-none fixed left-0 top-0 z-[9999] transition-opacity duration-150 ease-out ${fade}`}
        aria-hidden
      >
        <div className="signlearno-cursor-hand-stack">
          <span className="signlearno-cursor-hand-inner">
            <Hand
              className="signlearno-cursor-hand-svg"
              size={30}
              strokeWidth={2.35}
              aria-hidden
              style={{
                color: "var(--signlearno-green)",
                filter:
                  "drop-shadow(0 2px 4px color-mix(in srgb, var(--signlearno-green) 35%, transparent))",
              }}
            />
          </span>
        </div>
      </div>
    </>
  );
}
