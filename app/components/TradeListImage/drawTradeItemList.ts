import Konva from "konva";
import { ImageSource } from "~/utils/html/types";
import { loadImage } from "~/utils/loadImage";
import { TradeItemRenderProps } from "./TradeItemRenderProps";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

class ItemRect {
  readonly image: { width: number; height: number };
  readonly icon: { width: number; height: number };
  readonly title: { x: number; y: number; fontSize: number; lineHeight: number };
  readonly description: { x: number; y: number; fontSize: number; lineHeight: number };
  readonly textPadding: { x: number; y: number };

  constructor(width: number) {
    this.image = {
      width: width,
      height: width / 0.7,
    };
    this.icon = {
      width: this.image.width * 0.25,
      height: this.image.width * 0.25,
    };

    this.textPadding = { x: 0, y: width * 0.02 };

    this.title = {
      x: this.textPadding.x,
      y: this.image.height + this.textPadding.y,
      fontSize: this.image.height / 12,
      lineHeight: 1.2,
    };
    this.description = {
      x: this.textPadding.x,
      y: this.title.y + this.title.fontSize * this.title.lineHeight,
      fontSize: this.title.fontSize * 0.75,
      lineHeight: 1.2,
    };
  }

  public get width() {
    return this.image.width;
  }

  public get height() {
    return (
      this.image.height +
      this.textPadding.y +
      this.title.fontSize * this.title.lineHeight +
      this.description.fontSize * this.description.lineHeight +
      this.textPadding.y
    );
  }

  fitToItemRect(width: number, height: number): { image: Rect; icon: Rect } {
    const xRatio = this.image.width / width;
    const yRatio = this.image.height / height;

    if (xRatio < yRatio) {
      const fitWidth = this.image.width;
      const fitHeight = height * xRatio;
      const x = 0;
      const y = (this.image.height - fitHeight) / 2;
      return {
        image: {
          x,
          y,
          width: fitWidth,
          height: fitHeight,
        },
        icon: {
          x: x + fitWidth - this.icon.width * 1.1,
          y: y + fitHeight - this.icon.height * 1.1,
          width: this.icon.width,
          height: this.icon.height,
        },
      };
    } else {
      const fitWidth = width * yRatio;
      const fitHeight = this.image.height;
      const x = (this.image.width - fitWidth) / 2;
      const y = 0;
      return {
        image: {
          x,
          y,
          width: fitWidth,
          height: fitHeight,
        },
        icon: {
          x: x + fitWidth - this.icon.width * 1.1,
          y: y + fitHeight - this.icon.height * 1.1,
          width: this.icon.width,
          height: this.icon.height,
        },
      };
    }
  }
}

const drawTradeItemList = async (
  items: TradeItemRenderProps[],
  options: {
    bannerTitle: string;
    bannerColor: string;
    emblemColor: string;
    backgroundColor: string;
  },
): Promise<Blob> => {
  const { bannerTitle, bannerColor, emblemColor, backgroundColor } = options;

  if (items.length > 30) {
    items = items.slice(0, 30);
  }

  const REQUIRED_SIZE = {
    // width: 960,
    // height: 1280,
    width: 1536,
    height: 2048,
  };

  const bannerWidth = REQUIRED_SIZE.width;
  const bannerHeight = REQUIRED_SIZE.width / 14;

  const paddingX = REQUIRED_SIZE.width * 0.03;
  const w = ((REQUIRED_SIZE.width - paddingX * 2) / 6) * 0.88;
  const gapX = (REQUIRED_SIZE.width - paddingX * 2 - w * 6) / (6 - 1);
  const gapY = gapX * 0.4;

  const itemRect = new ItemRect(w);
  const paddingY = (REQUIRED_SIZE.height - (bannerHeight + itemRect.height * 5 + gapY * 4)) / 2;

  const width = REQUIRED_SIZE.width;
  const rows = Math.floor((items.length - 1) / 6) + 1;
  const height = bannerHeight + paddingY + rows * itemRect.height + (rows - 1) * gapY + paddingY;

  const stage = new Konva.Stage({
    container: document.createElement("div"),
    width,
    height,
  });
  const layer = new Konva.Layer();
  stage.add(layer);
  layer.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: REQUIRED_SIZE.width,
      height: REQUIRED_SIZE.height,
      fill: backgroundColor,
    }),
  );

  const banner = new Konva.Group({
    x: 0,
    y: 0,
    width: bannerWidth,
    height: bannerHeight,
    clip: {
      x: 0,
      y: 0,
      width: bannerWidth,
      height: bannerHeight,
    },
  });
  layer.add(banner);

  banner.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: bannerWidth,
      height: bannerHeight,
      fill: bannerColor,
    }),
  );

  const emblemSize = bannerHeight * 1.2;
  const emblem = new Konva.Group();
  emblem.add(
    new Konva.Rect({
      x: 0,
      y: 0,
      width: emblemSize,
      height: emblemSize,
      fill: emblemColor,
    }),
  );

  const emblemElem = new Image();
  await loadImage(emblemElem, "/takaneko/emblem.png");
  const mask = new Konva.Image({
    image: emblemElem,
    x: 0,
    y: 0,
    width: emblemSize,
    height: emblemSize,
    globalCompositeOperation: "destination-in",
  });
  emblem.add(mask);
  emblem.x(emblemSize * 0.8);
  emblem.y(bannerHeight * 0.05);
  emblem.cache();

  banner.add(emblem);
  banner.add(
    new Konva.Text({
      text: bannerTitle,
      fontSize: bannerHeight * 0.6,
      fontStyle: "italic",
      fontFamily: "serif",
      fill: "white",
      align: "center",
      verticalAlign: "middle",
      width: bannerWidth,
      height: bannerHeight,
    }),
  );

  await Promise.all(
    items.map(async (item, i) => {
      const row = Math.floor(i / 6);
      const col = i % 6;
      const x = paddingX + itemRect.width * col + gapX * col;
      const y = bannerHeight + paddingY + itemRect.height * row + gapY * row;

      const img = new Image();
      await loadImage(img, item.path);
      const r = itemRect.fitToItemRect(img.naturalWidth, img.naturalHeight);

      // Shadow 1
      layer.add(
        new Konva.Rect({
          x: x + r.image.x,
          y: y + r.image.y,
          width: r.image.width,
          height: r.image.height,
          fill: "white",
          shadowColor: "black",
          shadowBlur: 6,
          shadowOffset: { x: 0, y: 4 },
          shadowOpacity: 0.1,
        }),
      );

      // Shadow 2 + Image
      layer.add(
        new Konva.Image({
          image: img,
          x: x + r.image.x,
          y: y + r.image.y,
          width: r.image.width,
          height: r.image.height,
          shadowColor: "black",
          shadowBlur: 4,
          shadowOffset: { x: 0, y: 2 },
          shadowOpacity: 0.1,
        }),
      );

      if (item.status != undefined) {
        const icon = new Image();
        await loadImage(icon, item.status);
        layer.add(
          new Konva.Image({
            image: icon,
            x: x + r.icon.x,
            y: y + r.icon.y,
            width: r.icon.width,
            height: r.icon.height,
          }),
        );
      }

      layer.add(
        new Konva.Text({
          text: `${item.name} ${item.id}`,
          fontSize: itemRect.title.fontSize,
          lineHeight: itemRect.title.lineHeight,
          fontFamily: "sans-serif",
          fill: "oklch(14.7% 0.004 49.25)",
          align: "center",
          wrap: "none",
          ellipsis: true,
          x: itemRect.title.x + x,
          y: itemRect.title.y + y,
          width: itemRect.width,
        }),
      );

      layer.add(
        new Konva.Text({
          text: item.series,
          fontSize: itemRect.description.fontSize,
          lineHeight: itemRect.description.lineHeight,
          fontFamily: "sans-serif",
          fill: "#ed4f81",
          align: "center",
          wrap: "none",
          ellipsis: true,
          x: itemRect.description.x + x,
          y: itemRect.description.y + y,
          width: itemRect.width,
        }),
      );
    }),
  );

  // toBlob の実装上は Promise<Blob> が返ってくるはずなのに、
  // 型が unknown になっているのでキャストしています。
  return (await layer.toBlob({ mimeType: "image/webp", quality: 0.95 })) as Blob;
};

export const drawWithList = async (
  items: TradeItemRenderProps[][],
  bannerTitle: string,
): Promise<ImageSource[]> => {
  return await Promise.all(
    items.map(async (chunk) => {
      const blob = await drawTradeItemList(chunk, {
        bannerTitle,
        bannerColor: "#fa9dbb",
        emblemColor: "#ed4f81",
        backgroundColor: "#fffcfd",
      });

      return {
        blob,
        objectURL: URL.createObjectURL(blob),
      };
    }),
  );
};

export const drawOfferList = async (
  items: TradeItemRenderProps[][],
  bannerTitle: string,
): Promise<ImageSource[]> => {
  return await Promise.all(
    items.map(async (chunk) => {
      const blob = await drawTradeItemList(chunk, {
        bannerTitle,
        bannerColor: "oklch(21% 0.006 285.885)",
        emblemColor: "#fa9dbb",
        backgroundColor: "oklch(96.7% 0.001 286.375)",
      });

      return {
        blob,
        objectURL: URL.createObjectURL(blob),
      };
    }),
  );
};
