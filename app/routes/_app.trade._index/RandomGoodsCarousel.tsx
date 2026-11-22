import {
  MouseEvent,
  PointerEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RandomGoods } from "~/features/products/product.ts";
import { RandomGoodsCardLink } from "../_app.trade/RandomGoodsCard.tsx";

interface Props {
  items: readonly RandomGoods[];
}

export function RandomGoodsCarousel({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const mouseDragHandlers = useMouseDragScroll();

  return (
    <div>
      <div
        ref={viewportRef}
        className="scrollbar-hidden overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
        {...mouseDragHandlers}
        onDragStart={(event) => event.preventDefault()}
      >
        <ul ref={trackRef} className="flex w-max gap-4 px-4 pt-1 pb-4 select-none">
          {items.map((item) => (
            <li key={item.slug} className="w-40 flex-none sm:w-48">
              <RandomGoodsCardLink item={item} />
            </li>
          ))}
        </ul>
      </div>
      <CarouselPositionIndicator viewportRef={viewportRef} trackRef={trackRef} />
    </div>
  );
}

const mouseDecelerationPerMs = 0.998;
const minimumMouseVelocity = 0.02;
const dragSampleWindowMs = 120;
const clickDragThreshold = 5;

function useMouseDragScroll() {
  const dragListeners = useRef<AbortController | null>(null);
  const suppressClick = useRef(false);
  const momentumFrame = useRef<number | null>(null);

  const stopMomentum = useCallback(() => {
    if (momentumFrame.current !== null) {
      cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
  }, []);

  const stopDrag = useCallback(() => {
    dragListeners.current?.abort();
    dragListeners.current = null;
  }, []);

  useEffect(
    () => () => {
      stopDrag();
      stopMomentum();
    },
    [stopDrag, stopMomentum],
  );

  const startMomentum = (viewport: HTMLDivElement, velocity: number) => {
    const start = viewport.scrollLeft;
    const end = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (velocity > 0 ? start >= end : start <= 0) {
      return;
    }
    const startedAt = performance.now();
    // 解放時の速度から、減速しきるまでの移動距離を見積もる。
    const projectedDistance = (velocity * mouseDecelerationPerMs) / (1 - mouseDecelerationPerMs);

    const advance = (now: number) => {
      // フレーム間隔に左右されないよう、解放時からの経過時間で位置を求める。
      const remaining = mouseDecelerationPerMs ** Math.max(0, now - startedAt);
      const position = Math.min(end, Math.max(0, start + projectedDistance * (1 - remaining)));
      viewport.scrollLeft = position;
      const reachedEnd = velocity > 0 ? position >= end : position <= 0;
      const hasMomentum = Math.abs(velocity * remaining) > minimumMouseVelocity;
      momentumFrame.current = !reachedEnd && hasMomentum ? requestAnimationFrame(advance) : null;
    };

    momentumFrame.current = requestAnimationFrame(advance);
  };

  return {
    onPointerDown(event: PointerEvent<HTMLDivElement>) {
      const grabbingMomentum = momentumFrame.current !== null;
      stopMomentum();
      stopDrag();
      suppressClick.current = false;
      const viewport = event.currentTarget;
      if (
        event.pointerType !== "mouse" ||
        event.button !== 0 ||
        viewport.scrollWidth <= viewport.clientWidth
      ) {
        return;
      }

      const controller = new AbortController();
      dragListeners.current = controller;
      const { pointerId } = event;
      if (grabbingMomentum) {
        // 慣性中の押下は一覧をつかみ直す操作なので、カードへのフォーカス移動とリンクの起動を抑える。
        event.preventDefault();
        suppressClick.current = true;
      }
      let last = { x: event.clientX, at: event.timeStamp };
      const samples = [last];
      let dragged = grabbingMomentum;

      const move = (moveEvent: globalThis.PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) {
          return;
        }
        const delta = moveEvent.clientX - last.x;
        if (delta === 0 || (!dragged && Math.abs(delta) < clickDragThreshold)) {
          return;
        }

        viewport.scrollLeft -= delta;
        dragged = true;
        suppressClick.current = true;
        last = { x: moveEvent.clientX, at: moveEvent.timeStamp };
        samples.push(last);
        // 解放時の速度を直近の横移動から求めるため、計測区間の開始直前の点も残す。
        while (samples.length > 2 && samples[1].at < last.at - dragSampleWindowMs) {
          samples.shift();
        }
      };

      const release = (releasedAt: number) => {
        stopDrag();
        const first = samples[0];
        const elapsed = releasedAt - first.at;
        if (!dragged || elapsed <= 0 || releasedAt - last.at > dragSampleWindowMs) {
          return;
        }
        const velocity = (first.x - last.x) / elapsed;
        if (Math.abs(velocity) > minimumMouseVelocity) {
          startMomentum(viewport, velocity);
        }
      };

      const options = { capture: true, signal: controller.signal };
      const document = viewport.ownerDocument;
      // ドラッグを開始した要素の境界を越えても、ボタンを離すまで同じポインターを追跡する。
      document.addEventListener("pointermove", move, options);
      document.addEventListener(
        "pointerup",
        (up) => {
          if (up.pointerId === pointerId) {
            release(up.timeStamp);
          }
        },
        options,
      );
      // 他のボタンを押したまま左ボタンを離す操作も拾うため、mouseup を監視する。
      document.addEventListener(
        "mouseup",
        (up) => {
          if (up.button === 0) {
            release(up.timeStamp);
          }
        },
        options,
      );
      document.addEventListener(
        "pointercancel",
        (cancel) => {
          if (cancel.pointerId === pointerId) {
            stopDrag();
          }
        },
        options,
      );
      // ウィンドウ自体がフォーカスを失ったらドラッグを中断する。
      // キャプチャを有効にすると、ページ内のフォーカス移動でも中断されてしまう。
      document.defaultView?.addEventListener("blur", stopDrag, { signal: controller.signal });
    },
    onWheelCapture: stopMomentum,
    onClickCapture(event: MouseEvent<HTMLDivElement>) {
      if (event.detail > 0 && suppressClick.current) {
        suppressClick.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    },
  };
}

interface IndicatorProps {
  viewportRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLUListElement | null>;
}

function CarouselPositionIndicator({ viewportRef, trackRef }: IndicatorProps) {
  const [visibleRatio, setVisibleRatio] = useState(1);
  const barRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLMeterElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const meter = meterRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!bar || !meter || !viewport || !track) {
      return;
    }

    let scrollRange = 0;
    let travelPercent = 0;

    const updatePosition = () => {
      if (scrollRange === 0) {
        return;
      }

      const progress = viewport.scrollLeft / scrollRange;
      bar.style.transform = `translateX(${progress * travelPercent}%)`;

      const value = Math.round(Math.max(0, Math.min(1, progress)) * 100);
      if (meter.value !== value) {
        meter.value = value;
      }
    };

    const measure = () => {
      const viewportWidth = viewport.clientWidth;
      const contentWidth = track.scrollWidth;
      scrollRange = viewportWidth > 0 ? Math.max(0, contentWidth - viewportWidth) : 0;
      setVisibleRatio(scrollRange > 0 ? viewportWidth / contentWidth : 1);
      // translateX の百分率に合わせて、移動距離をバー自体の幅で割る。
      travelPercent = scrollRange > 0 ? (scrollRange / viewportWidth) * 100 : 0;
      updatePosition();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    viewport.addEventListener("scroll", updatePosition, { passive: true });
    measure();

    return () => {
      resizeObserver.disconnect();
      viewport.removeEventListener("scroll", updatePosition);
    };
  }, [viewportRef, trackRef]);

  return (
    <div className="mx-4 mt-1" hidden={visibleRatio === 1}>
      <meter
        ref={meterRef}
        className="sr-only"
        aria-label="横スクロール位置"
        min={0}
        max={100}
        value={0}
      />
      <div aria-hidden="true" className="relative h-1 overflow-hidden rounded-full bg-white">
        <div
          ref={barRef}
          className="absolute inset-y-0 left-0 rounded-full bg-zinc-300"
          style={{ width: `${visibleRatio * 100}%` }}
        />
      </div>
    </div>
  );
}
