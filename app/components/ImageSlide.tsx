import { clsx } from "clsx";
import { useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { XScroll } from "./scrollable/XScroll";

interface Props {
  images: { src: string; alt: string }[];
}

export const ImageSlide: React.FC<Props> = (props: Props) => {
  const { images } = props;

  const swiperRef = useRef<SwiperType>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const thumbsOffset = 40;
  const [markerOffset, setMarkerOffset] = useState(thumbsOffset);

  return (
    <div className="w-full">
      <Swiper
        className="aspect-square w-full select-none"
        loop={true}
        spaceBetween={32}
        observer={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => {
          const li = listRef.current?.children[swiper.realIndex] as HTMLLIElement | undefined;
          const liRect = li?.getBoundingClientRect();
          const ulRect = listRef.current?.getBoundingClientRect();
          const scrollRect = scrollRef.current?.getBoundingClientRect();

          // 選択しているサムネイルを示すマーカーの位置の計算
          if (liRect != undefined && ulRect != undefined) {
            setMarkerOffset(liRect.left - ulRect.left);
          }

          // li が listRef.current の表示領域の外にはみ出している場合にスクロール
          if (liRect != undefined && scrollRect != undefined) {
            if (liRect.left - thumbsOffset < scrollRect.left) {
              // li の左端がスクロールコンテナの左端より左にはみ出している場合
              scrollRef.current?.scrollBy({
                left: liRect.left - scrollRect.left - thumbsOffset,
                behavior: "smooth",
              });
            } else if (liRect.right + thumbsOffset > scrollRect.right) {
              // li の右端がスクロールコンテナの右端より右にはみ出している場合
              scrollRef.current?.scrollBy({
                left: liRect.right - scrollRect.right + thumbsOffset,
                behavior: "smooth",
              });
            }
          }
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={i} className="aspect-square h-fit w-fit">
            <div className={clsx("h-full w-full flex-none bg-gray-50")}>
              <img
                className="aspect-square h-full w-full object-contain"
                src={image.src}
                alt={image.alt}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="relative">
        <XScroll ref={scrollRef} className="scrollbar-hidden overflow-y-auto py-2">
          <ul className="inline-flex space-x-2 px-10" ref={listRef}>
            {images.map((image, i) => (
              <li key={i} className={clsx("h-fit w-fit min-w-0 flex-none")}>
                <button
                  className="block h-16 w-16 bg-gray-50 select-none"
                  onClick={() => {
                    if (swiperRef.current == undefined) {
                      return;
                    }
                    swiperRef.current.slideToLoop(i);
                  }}
                >
                  <img
                    className="aspect-square h-full w-full object-contain"
                    src={image.src}
                    alt={image.alt}
                  />
                </button>
              </li>
            ))}
          </ul>
          <div
            className="bg-nadeshiko-800 mt-1 h-0.5 w-16 rounded-full transition-transform duration-300"
            style={{ transform: `translateX(${markerOffset}px)` }}
          />
        </XScroll>
        <button
          className="absolute top-0 left-0 hidden h-20 w-10 items-center justify-center bg-white opacity-60 transition-opacity hover:opacity-80 pointer-fine:flex"
          onClick={() => {
            const r = scrollRef.current?.getBoundingClientRect();
            scrollRef.current?.scrollBy({
              left: -(r?.width ?? 0) * 0.6,
              behavior: "smooth",
            });
          }}
        >
          <BsChevronLeft className="mr-0.5 size-5 text-gray-600" />
        </button>
        <button
          className="absolute top-0 right-0 hidden h-20 w-10 items-center justify-center bg-white opacity-60 transition-opacity hover:opacity-80 pointer-fine:flex"
          onClick={() => {
            const r = scrollRef.current?.getBoundingClientRect();
            scrollRef.current?.scrollBy({
              left: (r?.width ?? 0) * 0.6,
              behavior: "smooth",
            });
          }}
        >
          <BsChevronRight className="size-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};
