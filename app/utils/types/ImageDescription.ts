import { z } from "zod/v4";

export const ImageDescription = z.object({
  path: z.string(),
  ref: z.string(),
});

export type ImageDescription = z.infer<typeof ImageDescription>;

export const ImageDescriptionWithOffset = ImageDescription.extend({
  /** 正方形表示時の画像位置。0 は左端・上端、50 は中央、100 は右端・下端。 */
  square: z
    .object({
      offsetX: z.number().min(0).max(100).optional(),
      offsetY: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

export type ImageDescriptionWithOffset = z.infer<typeof ImageDescriptionWithOffset>;
