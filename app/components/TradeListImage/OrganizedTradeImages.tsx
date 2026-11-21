import { clsx } from "clsx";
import { useCallback } from "react";
import { BsBoxArrowUp } from "react-icons/bs";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi.ts";

interface Props {
  title: string;
  images: (Blob | undefined)[];
}

const TradeListPreview = ({ blob, alt }: { blob: Blob; alt: string }) => {
  const setImageSource = useCallback(
    (image: HTMLImageElement | null) => {
      if (image == null) {
        return;
      }

      const url = URL.createObjectURL(blob);
      image.src = url;
      return () => URL.revokeObjectURL(url);
    },
    [blob],
  );

  return <img ref={setImageSource} alt={alt} className="block text-xs text-gray-100" />;
};

export const OrganizedTradeImages: React.FC<Props> = (props: Props) => {
  const { title, images } = props;

  const showShareButton = shouldUseWebShareApi();

  return (
    <section>
      <h3 className="px-4 font-semibold text-gray-600">{title}</h3>

      <Swiper
        className={clsx(
          "mt-2 min-w-0",
          "[&_.swiper-pagination]:static",
          "[&_.swiper-pagination-bullet]:bg-black",
          "[&_.swiper-pagination-bullet-active]:bg-nadeshiko-800!",
        )}
        modules={[Pagination]}
        centeredSlides={true}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{}}
      >
        {images.map((image, i) => {
          return (
            <SwiperSlide key={i} className="w-fit min-w-0">
              <div className="mx-auto aspect-3/4 w-full max-w-75">
                {image == undefined ? (
                  <div className="aspect-3/4 h-full w-full p-2">
                    <div className="h-full w-full animate-pulse rounded bg-gray-200" />
                  </div>
                ) : (
                  <div className="aspect-3/4 bg-gray-50">
                    <TradeListPreview blob={image} alt={`まとめ画像 ${i}`} />
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {showShareButton && (
        <button
          className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-nadeshiko-800 px-8 py-2 font-semibold text-nadeshiko-50"
          onClick={() => {
            const description = "ひとつにまとめたトレード画像をまとめて共有します。";
            const prefix = "WishList";
            void shareOrganizedTradeImages(
              title,
              description,
              prefix,
              images.filter((x): x is Blob => x != undefined),
            );
          }}
        >
          <p>まとめて共有</p>
          <BsBoxArrowUp />
        </button>
      )}
    </section>
  );
};

export const shareOrganizedTradeImages = async (
  title: string,
  description: string,
  prefix: string,
  images: Blob[],
) => {
  if (window?.navigator?.share == undefined) {
    return;
  }

  const date = Date.now();

  const files = images.map(
    (blob, i) => new File([blob], `${prefix}-${date}-${i + 1}.webp`, { type: "image/webp" }),
  );

  await window.navigator.share({
    title: title,
    text: description,
    files: files,
  });
};
