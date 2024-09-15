import clsx from "clsx";
import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

interface Props {
  images: { src: string; alt: string }[];
}

export const ImageSlide: React.FC<Props> = (props: Props) => {
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
    <div className="aspect-square w-full">
      <div className="relative overflow-hidden">
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
          {extendedImages.map((image, i) => (
            <div key={i} className={clsx("h-full w-full flex-none bg-gray-50")}>
              <img
                className="aspect-square h-full w-full object-contain"
                src={image.src}
                alt={image.alt}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-2 flex w-fit items-center gap-2">
        <button className="h-full rounded-full p-2 hover:bg-gray-100" onClick={handlePrev}>
          <HiChevronLeft className="w-full" />
        </button>

        {images.map((img, i) => {
          const idx =
            index == 0 ? images.length - 1 : index == extendedImages.length - 1 ? 0 : index - 1;
          return (
            <button
              key={i}
              className="relative block h-16 w-16"
              onClick={() => handleDirectJump(i)}
            >
              <img className="h-full w-full object-contain" src={img.src} alt={img.alt} />
              <div
                className={clsx(
                  "absolute inset-0 border border-gray-400",
                  i == idx ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="h-full w-full border border-white" />
              </div>
            </button>
          );
        })}

        <button className="h-full rounded-full p-2 hover:bg-gray-100" onClick={handleNext}>
          <HiChevronRight className="w-full" />
        </button>
      </div>
    </div>
  );
};
