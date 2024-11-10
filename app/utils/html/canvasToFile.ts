export const canvasToFile = (
  canvas: HTMLCanvasElement,
  fileName: string,
  mimeType: string = "image/png",
  quality: number = 1.0,
): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: mimeType });
          resolve(file);
        } else {
          reject(new Error("Canvas to Blob conversion failed."));
        }
      },
      mimeType,
      quality,
    );
  });
};
