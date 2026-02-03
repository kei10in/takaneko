import { describe, expect, it } from "vitest";
import { allAssetFiles } from "~/utils/tests/asset";
import { croppedImagePath } from "./croppedProductImage";
import { TAKANEKO_PHOTOS } from "./productImages";

describe("TAKANEKO_PHOTOS", () => {
  const AllAssets = allAssetFiles();

  it("should have unique ids for all photos", () => {
    const EXCEPTIONS = ["FAVE IDOLS オンラインくじ"];

    const ids = TAKANEKO_PHOTOS.map((x) => x.id)
      .toSorted()
      .filter((id) => !EXCEPTIONS.includes(id));

    const uniqueIds = Array.from(new Set(ids)).toSorted();
    expect(ids).toEqual(uniqueIds);
  });

  it("should have unique slugs for all photos", () => {
    const slugs = TAKANEKO_PHOTOS.map((x) => x.slug).toSorted();
    const uniqueSlugs = Array.from(new Set(slugs)).toSorted();
    expect(slugs).toEqual(uniqueSlugs);
  });

  it("should have cropped images for all photos", () => {
    const croppedImages = TAKANEKO_PHOTOS.flatMap((photo) =>
      photo.positions.map((p) => croppedImagePath(photo.url, p.id)),
    );
    const notFoundImages = croppedImages.filter((imagePath) => !AllAssets.includes(imagePath));
    expect(notFoundImages).toEqual([]);
  });
});
