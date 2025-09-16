import { clsx } from "clsx";
import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

interface Props {
  images: { src: string; alt: string }[];
}

export const ImageSlide: React.FC<Props> = (props: Props) => {
  const { images } = props;

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="w-full">
      <Swiper
        className="aspect-square w-full select-none"
        loop={true}
        spaceBetween={32}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        observer={true}
        modules={[Navigation, Thumbs]}
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
      <Swiper
        className={clsx("mt-2 select-none")}
        onSwiper={(swiper) => setThumbsSwiper(swiper)}
        freeMode={{ enabled: true }}
        slidesPerView={"auto"}
        watchSlidesProgress={true}
        observer={true}
        modules={[Thumbs, FreeMode, Navigation]}
      >
        {images.map((image, i) => (
          <SwiperSlide
            key={i}
            className={clsx("h-fit w-fit", images.length == i + 1 ? "pr-0" : "pr-2")}
          >
            <div className="h-16 w-16 bg-gray-50 select-none">
              <img
                className="aspect-square h-full w-full object-contain"
                src={image.src}
                alt={image.alt}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
