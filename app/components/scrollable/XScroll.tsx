import { clsx } from "clsx";
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef } from "react";
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

export const XScroll = forwardRef<HTMLDivElement, Props>(
  ({ children, className = "", momentum = true, momentumDecay, stopVelocity }: Props, ref) => {
    const viewPortRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => viewPortRef.current as HTMLDivElement);

    const stateRef = useRef<{
      dragging: boolean;
      rafId: number | undefined;
      pointerId: number | undefined;
      scrollCalculator: ScrollCalculator;
    }>({
      dragging: false,
      rafId: undefined,
      pointerId: undefined,
      scrollCalculator: new ScrollCalculator({ stopVelocity, momentumDecay }),
    });

    useEffect(() => {
      const viewPort = viewPortRef.current;
      const content = contentRef.current;
      if (!viewPort || !content) {
        return;
      }

      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType != "mouse") {
          return;
        }

        const s = stateRef.current;

        if (s.rafId) {
          stopMomentum();
          s.scrollCalculator.reInit({
            startX: e.screenX,
            scrollLeft: viewPort.scrollLeft,
            timeStamp: e.timeStamp,
            scrollWidth: viewPort.scrollWidth,
            contentWidth: viewPort.clientWidth,
          });
        } else {
          s.scrollCalculator.init({
            startX: e.screenX,
            scrollLeft: viewPort.scrollLeft,
            timeStamp: e.timeStamp,
            scrollWidth: viewPort.scrollWidth,
            contentWidth: viewPort.clientWidth,
          });
        }

        s.dragging = true;
        s.pointerId = undefined;
        s.rafId = undefined;

        e.preventDefault();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") {
          return;
        }

        const s = stateRef.current;
        if (!s.dragging) {
          return;
        }

        const newScroll = s.scrollCalculator.update(e.screenX, e.timeStamp);

        if (!s.scrollCalculator.isScrolling) {
          return;
        }

        // Pointer Capture はスクロールであることが確定してから行います。
        // PointerDown など、クリックの可能性があるときに Pointer Capture を行う
        // とクリックができなくなります。
        if (s.pointerId == undefined) {
          try {
            viewPort.setPointerCapture(e.pointerId);
            s.pointerId = e.pointerId;
          } catch {
            // do nothing
          }
        }

        applyScrollPosition(viewPort, content, newScroll);

        const sel = window.getSelection?.();
        if (sel && sel.type === "Range") {
          sel.removeAllRanges();
        }
      };

      const stopMomentum = () => {
        const s = stateRef.current;

        if (s.rafId) {
          cancelAnimationFrame(s.rafId);
        }
        s.rafId = undefined;
      };

      const startMomentum = () => {
        if (!momentum) {
          return;
        }

        const s = stateRef.current;

        stopMomentum();

        const step = (n: DOMHighResTimeStamp) => {
          const { stop, ...newScroll } = s.scrollCalculator.updateInMomentum(n);
          applyScrollPosition(viewPort, content, newScroll);

          if (!stop) {
            s.rafId = requestAnimationFrame(step);
          } else {
            stopMomentum();
          }
        };
        s.rafId = requestAnimationFrame(step);
      };

      const endScrolling = (e: { screenX: number; timeStamp: number }) => {
        const s = stateRef.current;
        if (!s.dragging) {
          return;
        }

        const newScrollLeft = s.scrollCalculator.update(e.screenX, e.timeStamp);
        applyScrollPosition(viewPort, content, newScrollLeft);

        s.dragging = false;
        if (s.pointerId != undefined) {
          try {
            const pointerId = s.pointerId;
            s.pointerId = undefined;
            viewPort.releasePointerCapture(pointerId);
          } catch {
            // do nothing
          }
        }
        startMomentum();
      };

      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerType != "mouse") {
          return;
        }
        endScrolling(e);
      };

      const onPointerCancel = (e: PointerEvent) => {
        if (e.pointerType != "mouse") {
          return;
        }
        endScrolling(e);
      };

      const onMouseLeaveDoc = (e: MouseEvent) => {
        endScrolling(e);
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
  },
);

XScroll.displayName = "XScroll";
