export const loadImage = (image: HTMLImageElement, src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    image.addEventListener(
      "load",
      () => {
        resolve(image);
      },
      { once: true },
    );
    image.src = src;
  });
};
