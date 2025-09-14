import { RandomGoods } from "./product";
import {
  isRegularTakanekoMiniPhotoCard,
  isRegularTakanekoPhoto,
  TAKANEKO_PHOTOS,
} from "./productImages";

export const relativeProductImages = (item: RandomGoods): RandomGoods[] => {
  const sameSeriesItems = TAKANEKO_PHOTOS.filter((x) => x.series === item.series).filter(
    (x) => x.id != item.id,
  );

  if (!isRegularTakanekoPhoto(item) && !isRegularTakanekoMiniPhotoCard(item)) {
    return sameSeriesItems;
  }

  const i = TAKANEKO_PHOTOS.findIndex((goods) => goods.id === item.id);

  const nextItems = TAKANEKO_PHOTOS.slice(0, i).toReversed();
  const prevItems = TAKANEKO_PHOTOS.slice(i + 1);

  const nearMiniPhoto0 = nextItems
    .filter((x) => isRegularTakanekoMiniPhotoCard(x))
    .filter((x) => x.series != item.series)
    .slice(0, 2)
    .toReversed();
  const nearMiniPhoto1 = prevItems
    .filter((x) => isRegularTakanekoMiniPhotoCard(x))
    .filter((x) => x.series != item.series)
    .slice(0, 2);

  const nearPhoto0 = nextItems
    .filter((x) => isRegularTakanekoPhoto(x))
    .filter((x) => x.series != item.series)
    .slice(0, 2)
    .toReversed();
  const nearPhoto1 = prevItems
    .filter((x) => isRegularTakanekoPhoto(x))
    .filter((x) => x.series != item.series)
    .slice(0, 2);

  if (isRegularTakanekoMiniPhotoCard(item)) {
    return [...sameSeriesItems, ...nearMiniPhoto0, ...nearMiniPhoto1, ...nearPhoto0, ...nearPhoto1];
  }

  return [...sameSeriesItems, ...nearPhoto0, ...nearPhoto1, ...nearMiniPhoto0, ...nearMiniPhoto1];
};
