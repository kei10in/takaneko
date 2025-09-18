import { clsx } from "clsx";
import { ReactNode, useEffect, useRef } from "react";

/**
 * HorizontalGrabScroll
 * - タッチ/ペン: ブラウザ標準のスクロールに任せる
 * - マウス: つかんで（grab）横方向だけスクロール
 *
 * 使い方:
 * <HorizontalGrabScroll className="h-64 w-full">
 *   <div style={{ width: 2000 }}> ... wide content ... </div>
 * </HorizontalGrabScroll>
 */
interface Props {
  children: ReactNode;
  className?: string;
  momentum?: boolean;
  momentumDecay?: number;
  stopVelocity?: number; // px/ms
}

export default function XScroll({
  children,
  className = "",
  momentum = true,
  momentumDecay = 0.95,
  stopVelocity = 0.02,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    dragging: false,
    startX: 0,
    startScrollLeft: 0,
    lastX: 0,
    lastTs: 0,
    vx: 0,
    rafId: 0 as number | 0,
    pointerId: null as number | null,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.overflowX = el.style.overflowX || "auto";
    el.style.overflowY = el.style.overflowY || "hidden";
    el.style.touchAction = el.style.touchAction || "auto";

    // const isInteractive = (t: EventTarget | null): boolean => {
    //   if (!(t instanceof Element)) return false;
    //   return !!t.closest('a, button, input, textarea, select, [contenteditable], [role="button"]');
    // };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // if (isInteractive(e.target)) return;

      const s = stateRef.current;
      s.dragging = true;
      s.pointerId = e.pointerId;
      s.startX = e.clientX;
      s.lastX = e.clientX;
      s.startScrollLeft = el.scrollLeft;
      s.lastTs = e.timeStamp;
      s.vx = 0;

      el.classList.add("hgs-dragging");
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // do nothing
      }

      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.dragging || e.pointerType !== "mouse") return;

      const dx = e.clientX - s.startX;
      el.scrollLeft = s.startScrollLeft - dx;

      const dt = Math.max(e.timeStamp - s.lastTs, 1);
      s.vx = (e.clientX - s.lastX) / dt;
      s.lastX = e.clientX;
      s.lastTs = e.timeStamp;

      const sel = window.getSelection?.();
      if (sel && sel.type === "Range") sel.removeAllRanges();
    };

    const stopMomentum = () => {
      const s = stateRef.current;
      if (s.rafId) cancelAnimationFrame(s.rafId);
      s.rafId = 0;
    };

    const startMomentum = () => {
      if (!momentum) return;
      const s = stateRef.current;
      stopMomentum();
      const step = () => {
        const frame = 16;
        if (ref.current) {
          ref.current.scrollLeft -= s.vx * frame;
        }
        s.vx *= momentumDecay;
        if (Math.abs(s.vx) > stopVelocity) {
          s.rafId = requestAnimationFrame(step);
        } else {
          stopMomentum();
        }
      };
      s.rafId = requestAnimationFrame(step);
    };

    const onPointerUpOrCancel = (e: PointerEvent | { pointerType: string }) => {
      const s = stateRef.current;
      if (!s.dragging || (e && e.pointerType !== "mouse")) return;
      s.dragging = false;
      if (s.pointerId !== null) {
        try {
          el.releasePointerCapture(s.pointerId);
        } catch {
          // do nothing
        }
      }
      el.classList.remove("hgs-dragging");
      startMomentum();
    };

    const onMouseLeaveDoc = () => {
      onPointerUpOrCancel({ pointerType: "mouse" });
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove, { passive: false });
    el.addEventListener("pointerup", onPointerUpOrCancel);
    el.addEventListener("pointercancel", onPointerUpOrCancel);
    document.addEventListener("mouseleave", onMouseLeaveDoc);

    return () => {
      stopMomentum();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUpOrCancel);
      el.removeEventListener("pointercancel", onPointerUpOrCancel);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
    };
  }, [momentum, momentumDecay, stopVelocity]);

  return (
    <div ref={ref} className={clsx("overscroll-contain", className)} style={{ cursor: "auto" }}>
      {children}
    </div>
  );
}
