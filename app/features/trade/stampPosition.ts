import { ImagePosition } from "../products/product";

export interface Xywh {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * スタンプの位置を計算する関数です。
 */
export const stampPositions = (positions: ImagePosition[]): ImagePosition[] => {
  return stampPositions2(positions);
};

/**
 * 画像の位置からスタンプの位置を計算する関数です。
 * スタンプは他の画像のサイズに影響を受けます。
 */
export const stampPositions1 = (positions: ImagePosition[]): ImagePosition[] => {
  const minWidth = Math.min(...positions.map((p) => p.width));

  return positions.map((selPosition) => {
    const x = selPosition.x;
    const y = selPosition.y;
    const width = selPosition.width;
    const height = selPosition.height;

    const stampPos = stampPosition(minWidth, { x, y, width, height });

    return { id: selPosition.id, ...stampPos };
  });
};

export const stampPosition = (baseSize: number, target: Xywh): Xywh => {
  const width = baseSize / 1.5;
  const height = baseSize / 1.5;
  const x = target.x + target.width / 2 - width / 2;
  const y = target.y + target.height - height;

  if (target.height < height * 1.75) {
    return stampPositionForSquare(baseSize, target);
  }

  return { x, y, width, height };
};

const stampPositionForSquare = (baseSize: number, target: Xywh): Xywh => {
  const width = baseSize / 2.25;
  const height = width;
  const x = target.x + target.width - width;
  const y = target.y + target.height - height;

  return { x, y, width, height };
};

/**
 * 画像の位置からスタンプの位置を計算する関数です。
 * スタンプの位置は各画像の矩形だけで決定します。
 */
export const stampPositions2 = (positions: ImagePosition[]): ImagePosition[] => {
  return positions.map((selPosition) => {
    const x = selPosition.x;
    const y = selPosition.y;
    const width = selPosition.width;
    const height = selPosition.height;

    const stampPos = calcStampPosition(width, height);

    return {
      id: selPosition.id,
      x: x + stampPos.x,
      y: y + stampPos.y,
      width: stampPos.width,
      height: stampPos.height,
    };
  });
};

/**
 * スタンプの位置を計算する関数です。
 *
 * 以下この関数の生成に利用できるプロンプトです。
 * ---
 * TypeScript で、画像にスタンプを押す位置とサイズを計算する関数
 * `calcStampPosition(width:  number, height: number): Xywh` を作成してください。
 *
 * ### 仕様
 *
 * - **入力:** 画像の `width` (幅) と `height` (高さ)
 * - **出力:** `Xywh` 型のオブジェクト (`x`, `y`, `width`, `height` を含む)
 * - **スタンプは正方形**
 *
 * ### ルール
 *
 * 1. **スタンプのサイズ**
 *    - **短辺 × `1/1.5` (4:3 または 3:4 の場合)**
 *    - **短辺 × `1/2.25` (正方形の場合)**
 *    - **3:4 ~ 4:3 の範囲では `1/1.5` から `1/2.25` へスムーズに変化**
 *    - **補間は指数関数 (`exp`) を使用し、正方形に近づくと急速に `1/2.25` に寄る**
 *
 * 2. **スタンプの位置**
 *    - **`3:4` よりも縦長または横長の画像** → **短辺の `1/1.5` を適用**
 *      - `width < height` (縦長) → **下端中央 (`x = (width - size) / 2`)**
 *      - `width > height` (横長) → **右下 (`x = width - size`)**
 *    - **3:4 ~ 4:3 の間の画像**
 *      - **指数関数 (`exp`) で `1/1.5` → `1/2.25` へスムーズに補間**
 *      - **`width / height < 1/1.2` のとき `x = (width - size) / 2` (下端中央)**
 *      - **`width / height >= 1/1.2` のとき `x = width - size` (右下)**
 */
const calcStampPosition = (width: number, height: number): Xywh => {
  const SIZE_RATIO_3_4 = 1 / 1.5; // 4:3 または 3:4 の場合
  const SIZE_RATIO_SQUARE = 1 / 2.25; // 正方形の場合
  const POSITION_THRESHOLD = 1 / 1.2; // 4:3 と正方形の間の位置切り替え閾値

  const aspectRatio = Math.min(width, height) / Math.max(width, height); // アスペクト比

  // サイズの計算: サイズは短辺と長編の比によって決定します。向きには依存しません。
  let size;
  if (aspectRatio < 3 / 4) {
    // 3 : 4 よりも長辺が長い場合: スタンプのサイズは短辺によって決定します。
    size = Math.min(width, height) * SIZE_RATIO_3_4;
  } else {
    // 3 / 4 ~ 4 / 3 の間の矩形の場合

    // 線形補完。使ってない。
    // const weight = Math.min(1, Math.max(0, (aspectRatio - 0.75) / (1.0 - 0.75)));

    // Exponential に補完する。すこしでも正方形に近づくと急激に変化する。
    const normalizedRatio = (aspectRatio - 0.75) / (1.0 - 0.75);
    const t = 1 - Math.exp(-5 * normalizedRatio);

    const sizeRatio = SIZE_RATIO_3_4 * (1 - t) + SIZE_RATIO_SQUARE * t;
    size = Math.min(width, height) * sizeRatio;
  }

  // 位置の計算: 位置はサイズと向きによって決定します。
  // 縦長であっても横長と同じ位置にスタンプが配置される場合があります。
  const x = width / height < POSITION_THRESHOLD ? (width - size) / 2 : width - size;
  const y = height - size;

  return { x, y, width: size, height: size };
};
