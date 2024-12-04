import { Link } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface Props {
  images: { src: string; alt: string; to?: string | undefined; replace?: boolean | undefined }[];
}

export const ImageCarousel: React.FC<Props> = (props: Props) => {
  const { images } = props;

  const extendedImages = [images[images.length - 1], ...images, images[0]];

  const [index, setIndex] = useState(1);
  // スライドを連打できなくするためのフラグ
  // 連打ができるとスライドのループが期待通りに動かなくなる。
  const [isTransitioning, setIsTransitioning] = useState(false);
  // スライドがループするときに fake image から actual image にもどすときに
  // トランジションを止めるために必要なフラグ
  const [isResetting, setIsResetting] = useState(false);

  const handlePrev = () => {
    if (isTransitioning) {
      return;
    }
    setIsResetting(false);
    setIsTransitioning(true);
    setIndex((v) => v - 1);
  };

  const handleNext = () => {
    if (isTransitioning) {
      return;
    }
    setIsResetting(false);
    setIsTransitioning(true);
    setIndex((v) => v + 1);
  };

  const handleDirectJump = (i: number) => {
    if (isTransitioning || i + 1 === index) {
      return;
    }
    setIndex(i + 1);
    setIsTransitioning(true);
    setIsResetting(false);
  };

  return (
    <div className="w-full">
      <div className="flex h-64 w-full items-center overflow-hidden lg:h-[30rem]">
        <div className="flex-none text-center lg:w-32">
          <button className="rounded-full p-2 lg:hover:bg-gray-100" onClick={handlePrev}>
            <HiChevronLeft className="h-8 w-full text-gray-600" />
          </button>
        </div>

        <div className="relative h-full flex-1 overflow-hidden">
          <div
            className={clsx(
              "flex h-full w-full flex-none bg-gray-200 ease-in",
              isResetting ? "transition-none" : "transition-transform",
            )}
            style={{ transform: `translateX(-${index * 100}%)` }}
            onTransitionEnd={() => {
              if (index === 0) {
                setIsResetting(true);
                setIndex(extendedImages.length - 2);
              } else if (index === extendedImages.length - 1) {
                setIsResetting(true);
                setIndex(1);
              }
              setIsTransitioning(false);
            }}
          >
            {extendedImages.map((image, i) => {
              const imageComponent = (
                <div
                  key={i}
                  className="relative h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${image.src}")`,
                  }}
                >
                  <div className="absolute inset-0 bg-opacity-20 backdrop-blur-xl" />
                  <img
                    src={image.src}
                    alt="アイキャッチ"
                    className="relative mx-auto h-full w-full object-contain"
                  />
                </div>
              );

              return image.to == undefined ? (
                <div className="block h-full w-full flex-none">imageComponent</div>
              ) : (
                <Link
                  key={i}
                  to={image.to}
                  replace={image.replace}
                  className="block h-full w-full flex-none"
                >
                  {imageComponent}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex-none text-center lg:w-32">
          <button className="rounded-full p-2 lg:hover:bg-gray-100" onClick={handleNext}>
            <HiChevronRight className="h-8 w-full text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-fit items-center py-2">
        {images.map((_, i) => {
          const idx =
            index == 0 ? images.length - 1 : index == extendedImages.length - 1 ? 0 : index - 1;
          return (
            <button
              key={i}
              data-selected={i == idx ? "true" : undefined}
              className="group flex h-4 w-4 items-center justify-center rounded-full"
              onClick={() => handleDirectJump(i)}
            >
              <div className="h-2 w-2 rounded-full bg-gray-300 group-data-[selected]:bg-nadeshiko-800" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
