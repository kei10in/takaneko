import { Image, loadImage } from "canvas";
import Konva from "konva";
import "konva/canvas-backend";
import { ImagePosition } from "~/features/products/product";
import { Rect } from "~/utils/types/dimensions";
import { Size } from "~/utils/types/Size";

export class RandomGoodsItemList {
  readonly frame: Size;
  readonly frameMarginX: number;
  readonly frameMarginY: number;
  readonly itemMarginX: number;
  readonly itemMarginY: number;

  readonly box: Size;

  readonly layoutX: number;
  readonly layoutY: number;

  readonly files: string[];

  constructor(files: string[]) {
    this.frameMarginX = 50;
    this.frameMarginY = 50;
    this.itemMarginX = 25;
    this.itemMarginY = 25;

    this.box = { width: 450, height: 450 };

    if (files.length <= 4) {
      this.layoutX = 2;
      this.layoutY = 2;
    } else {
      this.layoutX = 3;
      this.layoutY = Math.ceil(files.length / this.layoutX);
    }

    this.frame = {
      width:
        this.frameMarginX * 2 +
        this.box.width * this.layoutX +
        this.itemMarginX * (this.layoutX - 1),
      height:
        this.frameMarginY * 2 +
        this.box.height * this.layoutY +
        this.itemMarginY * (this.layoutY - 1),
    };

    this.files = files;
  }

  photoPosition(image: Image, col: number, row: number): Rect {
    const boxX = this.frameMarginX + col * (this.box.width + this.itemMarginX);
    const boxY = this.frameMarginY + row * (this.box.height + this.itemMarginY);

    const scale = Math.min(
      this.box.width / image.naturalWidth,
      this.box.height / image.naturalHeight,
    );
    const width = Math.floor(image.naturalWidth * scale);
    const height = Math.floor(image.naturalHeight * scale);

    // この画像生成では必ず格子点に配置しないといけない。
    const x = boxX + Math.floor((this.box.width - width) / 2);
    const y = boxY + Math.floor((this.box.height - height) / 2);

    return { x, y, width, height };
  }

  async draw(): Promise<{ buffer: Buffer; positions: ImagePosition[] }> {
    const positions: ImagePosition[] = [];

    const stage = new Konva.Stage({
      width: this.frame.width,
      height: this.frame.height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    layer.add(
      new Konva.Rect({
        x: 0,
        y: 0,
        width: this.frame.width,
        height: this.frame.height,
        fill: "white",
      }),
    );

    for (const [index, file] of this.files.entries()) {
      const image = await loadImage(file);
      const col = index % this.layoutX;
      const row = Math.floor(index / this.layoutX);
      const pos = this.photoPosition(image, col, row);

      layer.add(
        new Konva.Image({
          image: image as unknown as CanvasImageSource,
          ...pos,
        }),
      );

      positions.push({ id: index + 1, ...pos });
    }

    const dataUrl = await stage.toDataURL({ mimeType: "image/webp", quality: 0.95 });

    // Write Data URL to file
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    return { buffer, positions };
  }
}
