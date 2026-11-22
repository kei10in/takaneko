import { RefObject, useEffect, useRef, useState } from "react";
import { RandomGoods } from "~/features/products/product.ts";
import { RandomGoodsCardLink } from "../_app.trade/RandomGoodsCard.tsx";

interface Props {
  items: readonly RandomGoods[];
}

export function RandomGoodsCarousel({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  return (
    <div>
      <div
        ref={viewportRef}
        className="scrollbar-hidden overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
      >
        <ul ref={trackRef} className="flex w-max gap-4 px-4 pt-1 pb-4">
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
