import type { EmblaEventCallbackType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

interface SlideRange {
  first: number;
  last: number;
}

const getPreloadRange = (
  slideIndexes: number[],
  slideCount: number,
  preloadSlideRadius: number,
): SlideRange => ({
  first: Math.max(0, Math.min(...slideIndexes) - preloadSlideRadius),
  last: Math.min(slideCount - 1, Math.max(...slideIndexes) + preloadSlideRadius),
});

export const useSetlistCarousel = (initialSlideIndex: number, slideCount: number) => {
  const preloadSlideRadius = 8;
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(initialSlideIndex);
  const [renderedSlideRange, setRenderedSlideRange] = useState(() =>
    getPreloadRange([initialSlideIndex], slideCount, preloadSlideRadius),
  );
  const [carouselRef, carouselApi] = useEmblaCarousel({
    startSnap: initialSlideIndex,
    align: "start",
    containScroll: false,
    loop: false,
  });

  useEffect(() => {
    if (carouselApi == undefined) {
      return;
    }
    const allowDrag: EmblaEventCallbackType<"pointerdown"> = (_api, event) => {
      const target = event.detail.target;
      return !(target instanceof Element && target.closest("button, input, select, textarea"));
    };
    const syncSelectedSlide = () => setSelectedSlideIndex(carouselApi.selectedSnap());
    const syncRenderedSlideRange = () => {
      const visibleSlideIndexes = carouselApi.slidesInView();
      // IntersectionObserverの初回通知や切り替わりで表示対象が空でも、詳細を消さない。
      if (visibleSlideIndexes.length == 0) {
        return;
      }
      const nextRange = getPreloadRange(visibleSlideIndexes, slideCount, preloadSlideRadius);
      setRenderedSlideRange((previous) =>
        nextRange.first == previous.first && nextRange.last == previous.last ? previous : nextRange,
      );
    };
    const syncAfterReInit = () => {
      syncSelectedSlide();
      syncRenderedSlideRange();
    };
    carouselApi
      .on("pointerdown", allowDrag)
      .on("select", syncSelectedSlide)
      .on("slidesinview", syncRenderedSlideRange)
      .on("reinit", syncAfterReInit);
    syncAfterReInit();
    return () => {
      carouselApi
        .off("pointerdown", allowDrag)
        .off("select", syncSelectedSlide)
        .off("slidesinview", syncRenderedSlideRange)
        .off("reinit", syncAfterReInit);
    };
  }, [carouselApi, slideCount]);

  return { carouselRef, selectedSlideIndex, renderedSlideRange };
};
