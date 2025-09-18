import { clsx } from "clsx";
import { ReactNode, useEffect, useRef } from "react";
import { ScrollCalculator } from "./compute";

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

const applyScrollPosition = (
  viewPort: HTMLElement,
  content: HTMLElement,
  scroll: { scrollLeft: number; transform: number },
) => {
  content.style.transform = `translateX(${scroll.transform}px)`;
  viewPort.scrollLeft = scroll.scrollLeft;
};

export default function XScroll({
  children,
  className = "",
  momentum = true,
  momentumDecay = 0.95,
  stopVelocity = 0.02,
}: Props) {
  const viewPortRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef({
    dragging: false,
    rafId: 0 as number | 0,
    pointerId: null as number | null,
    obj: new ScrollCalculator({ stopVelocity, momentumDecay }),
  });

  useEffect(() => {
    const viewPort = viewPortRef.current;
    const content = contentRef.current;
    if (!viewPort) return;
    if (!content) return;

    viewPort.style.overflowX = viewPort.style.overflowX || "auto";
    viewPort.style.overflowY = viewPort.style.overflowY || "hidden";
    viewPort.style.touchAction = viewPort.style.touchAction || "auto";

    // const isInteractive = (t: EventTarget | null): boolean => {
    //   if (!(t instanceof Element)) return false;
    //   return !!t.closest('a, button, input, textarea, select, [contenteditable], [role="button"]');
    // };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // if (isInteractive(e.target)) return;

      const s = stateRef.current;
      s.obj.init({
        startX: e.clientX,
        scrollLeft: viewPort.scrollLeft,
        timeStamp: e.timeStamp,
        scrollWidth: viewPort.scrollWidth,
        contentWidth: content.clientWidth,
      });

      s.dragging = true;
      s.pointerId = e.pointerId;

      try {
        viewPort.setPointerCapture(e.pointerId);
      } catch {
        // do nothing
      }

      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.dragging || e.pointerType !== "mouse") return;

      const newScroll = s.obj.update(e.clientX, e.timeStamp);

      console.log(newScroll);

      applyScrollPosition(viewPort, content, newScroll);

      const sel = window.getSelection?.();
      if (sel && sel.type === "Range") sel.removeAllRanges();
    };

    const stopMomentum = () => {
      const s = stateRef.current;

      const newScroll = s.obj.end();
      applyScrollPosition(viewPort, content, newScroll);

      if (s.rafId) {
        cancelAnimationFrame(s.rafId);
      }
      s.rafId = 0;
    };

    const startMomentum = () => {
      if (!momentum) return;
      const s = stateRef.current;
      stopMomentum();
      const step = (n: DOMHighResTimeStamp) => {
        const { stop, ...newScroll } = s.obj.updateInMomentum(n);

        if (contentRef.current != undefined) {
          applyScrollPosition(viewPort, contentRef.current, newScroll);
        }

        if (!stop) {
          s.rafId = requestAnimationFrame(step);
        } else {
          stopMomentum();
        }
      };
      s.rafId = requestAnimationFrame(step);
    };

    const onPointerUp = (e: PointerEvent) => {
      const s = stateRef.current;

      if (!s.dragging) return;
      if (e && e.pointerType !== "mouse") return;

      const newScrollLeft = s.obj.update(e.clientX, e.timeStamp);

      if (contentRef.current != undefined) {
        applyScrollPosition(viewPort, contentRef.current, newScrollLeft);
      }

      s.dragging = false;
      if (s.pointerId !== null) {
        try {
          const pointerId = s.pointerId;
          s.pointerId = null;
          viewPort.releasePointerCapture(pointerId);
        } catch {
          // do nothing
        }
      }
      startMomentum();
    };

    const onPointerCancel = (e: { pointerType: string }) => {
      const s = stateRef.current;

      if (!s.dragging) return;
      if (e && e.pointerType !== "mouse") return;

      s.dragging = false;
      if (s.pointerId !== null) {
        try {
          const pointerId = s.pointerId;
          s.pointerId = null;
          viewPort.releasePointerCapture(pointerId);
        } catch {
          // do nothing
        }
      }
      startMomentum();
    };

    const onMouseLeaveDoc = () => {
      onPointerCancel({ pointerType: "mouse" });
    };

    viewPort.addEventListener("pointerdown", onPointerDown);
    viewPort.addEventListener("pointermove", onPointerMove, { passive: false });
    viewPort.addEventListener("pointerup", onPointerUp);
    viewPort.addEventListener("pointercancel", onPointerCancel);
    document.addEventListener("mouseleave", onMouseLeaveDoc);

    return () => {
      stopMomentum();
      viewPort.removeEventListener("pointerdown", onPointerDown);
      viewPort.removeEventListener("pointermove", onPointerMove);
      viewPort.removeEventListener("pointerup", onPointerUp);
      viewPort.removeEventListener("pointercancel", onPointerCancel);
      document.removeEventListener("mouseleave", onMouseLeaveDoc);
    };
  }, [momentum, momentumDecay, stopVelocity]);

  return (
    <div
      ref={viewPortRef}
      className={clsx("overscroll-contain", className)}
      style={{ cursor: "auto" }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
