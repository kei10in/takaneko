import type { EmblaEventCallbackType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useEffectEvent, useState } from "react";

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

export const useSetlistCarousel = (
  initialSlideIndex: number,
  slideCount: number,
  onSelectedEventChange: (index: number) => void,
) => {
  const preloadSlideRadius = 3;
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(initialSlideIndex);
  const [renderedSlideRange, setRenderedSlideRange] = useState(() =>
    getPreloadRange([initialSlideIndex], slideCount, 0),
  );
  const [carouselRef, carouselApi] = useEmblaCarousel({
    startSnap: initialSlideIndex,
    align: "start",
    containScroll: false,
    loop: false,
  });
  const notifySelectedEventChange = useEffectEvent(onSelectedEventChange);

  useEffect(() => {
    if (carouselApi == undefined) {
      return;
    }
    let isPreloadReady = false;
    const allowDrag: EmblaEventCallbackType<"pointerdown"> = (_api, event) => {
      const target = event.detail.target;
      return !(target instanceof Element && target.closest("button, input, select, textarea"));
    };
    const syncSelectedSlide = () => {
      const index = carouselApi.selectedSnap();
      setSelectedSlideIndex(index);
      // 先読み前に操作された場合も、選択した詳細はすぐ表示する。
      setRenderedSlideRange((previous) =>
        index >= previous.first && index <= previous.last
          ? previous
          : getPreloadRange([index], slideCount, isPreloadReady ? preloadSlideRadius : 0),
      );
      notifySelectedEventChange(index);
    };
    const syncRenderedSlideRange = () => {
      if (!isPreloadReady) {
        return;
      }
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
      setSelectedSlideIndex(carouselApi.selectedSnap());
      syncRenderedSlideRange();
    };
    carouselApi
      .on("pointerdown", allowDrag)
      .on("select", syncSelectedSlide)
      .on("slidesinview", syncRenderedSlideRange)
      .on("reinit", syncAfterReInit);
    syncAfterReInit();
    // Effectが描画前に実行されても、選択中の詳細を描画するフレームを先に確保する。
    let preloadFrame = requestAnimationFrame(() => {
      preloadFrame = requestAnimationFrame(() => {
        isPreloadReady = true;
        setRenderedSlideRange(
          getPreloadRange([carouselApi.selectedSnap()], slideCount, preloadSlideRadius),
        );
        syncRenderedSlideRange();
      });
    });
    return () => {
      cancelAnimationFrame(preloadFrame);
      carouselApi
        .off("pointerdown", allowDrag)
        .off("select", syncSelectedSlide)
        .off("slidesinview", syncRenderedSlideRange)
        .off("reinit", syncAfterReInit);
    };
  }, [carouselApi, slideCount]);

  return { carouselRef, selectedSlideIndex, renderedSlideRange };
};
