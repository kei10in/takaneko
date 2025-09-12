import { loadImage } from "canvas";
import Konva from "konva";
import "konva/canvas-backend";
import fs from "node:fs";
import { ImagePosition } from "~/features/products/product";
import { Size } from "~/utils/types/Size";

export class ProductImage {
  readonly frame: Size;
  readonly xMargin: number;
  readonly yMargin: number;
  readonly xSpace: number;

  readonly box: Size;
  readonly size: Size;

  constructor(private files: string[]) {
    this.frame = { width: 33, height: 33 };
    this.xMargin = 18;
    this.yMargin = 18;
    this.xSpace = this.xMargin;

    this.box = {
      width: 154,
      height: 220,
    };

    this.size = {
      width: this.frame.width * 2 + this.box.width * 6 + this.xSpace * 4 + this.xMargin,
      height: this.frame.height * 2 + this.box.height * 5 + this.yMargin * 4,
    };
  }

  photoRects(): ImagePosition[] {
    return this.files.map((_, index) => {
      const row = Math.floor(index / 6);
      const col = index % 6;

      const x =
        this.frame.width +
        col * (this.box.width + this.xSpace) +
        (col >= 3 ? this.xMargin - this.xSpace : 0);
      const y = this.frame.height + row * (this.box.height + this.yMargin);

      return { id: index + 1, x, y, width: this.box.width, height: this.box.height };
    });
  }

  writePositions(output: string) {
    const positions = this.photoRects();
    fs.writeFileSync(output, JSON.stringify(positions, null, 2));
  }

  async draw(output: string) {
    const stage = new Konva.Stage({
      width: this.size.width,
      height: this.size.height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    layer.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width: this.size.width,
        height: this.size.height,
        fill: "white",
      }),
    );

    const positions = this.photoRects();

    for (const [index, file] of this.files.entries()) {
      const pos = positions[index];
      const { x, y, width, height } = pos;

      const image = await loadImage(file);

      layer.add(
        new Konva.Image({
          x,
          y,
          image: image as unknown as CanvasImageSource,
          width: width,
          height: height,
          fit: "cover",
        }),
      );
    }

    const dataUrl = await stage.toDataURL({ mimeType: "image/webp", quality: 0.95 });

    // Write Data URL to file
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(output, buffer);
  }
}
