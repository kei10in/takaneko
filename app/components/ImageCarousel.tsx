import { clsx } from "clsx";
import { Link } from "react-router";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  images: {
    src: string;
    alt: string;
    to?: string | undefined;
    replace?: boolean | undefined;
    preventScrollReset?: boolean;
  }[];
}

export const ImageCarousel: React.FC<Props> = (props: Props) => {
  const { images } = props;

  return (
    <div>
      <Swiper
        className={clsx(
          "h-64 w-full lg:h-[30rem]",
          "[&_.swiper-button-next]:opacity-0",
          "[&_.swiper-button-prev]:opacity-0",
          "[&_.swiper-pagination]:bottom-0",
          "[&_.swiper-pagination-bullet]:bg-black",
          "[&_.swiper-pagination-bullet-active]:bg-nadeshiko-800!",
          "lg:[&_.swiper-button-next]:opacity-100",
          "lg:[&_.swiper-button-prev]:opacity-100",
          "lg:[&_.swiper-button-next]:text-white",
          "lg:[&_.swiper-button-prev]:text-white",
        )}
        modules={[Navigation, Pagination, A11y]}
        loop={true}
        slidesPerView={1}
        navigation={{}}
        pagination={{ clickable: true }}
      >
        {images.map((image, i) => {
          const imageComponent = (
            <div key={i}>
              <div
                className="relative h-64 w-full bg-cover bg-center lg:h-[30rem]"
                style={{
                  backgroundImage: `url("${image.src}")`,
                }}
              >
                <div className="absolute inset-0 backdrop-blur-xl" />
                <img
                  src={image.src}
                  alt="アイキャッチ"
                  className="relative mx-auto h-full w-full object-contain"
                />
              </div>
              <div className="h-6" />
            </div>
          );

          return (
            <SwiperSlide key={i}>
              {image.to == undefined ? (
                <div className="block h-full w-full flex-none">imageComponent</div>
              ) : (
                <Link
                  key={i}
                  to={image.to}
                  replace={image.replace}
                  preventScrollReset={image.preventScrollReset}
                  className="block h-full w-full flex-none"
                >
                  {imageComponent}
                </Link>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
