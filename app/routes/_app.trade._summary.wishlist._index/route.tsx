import { OrganizedTradeImages } from "~/components/TradeListImage/OrganizedTradeImages.tsx";
import { DomainName, OgpSiteName } from "~/constants.ts";
import {
  otherTakanekoRandomGoods,
  regularTakanekoMiniPhotoCards,
  regularTakanekoPhotos,
} from "~/features/products/productImages.ts";
import { MemberDescription } from "~/features/profile/types.ts";
import { useTradeStore } from "~/features/trade/store.ts";
import {
  mapProductToTradingItemDetails,
  TradingItemDetail,
} from "~/features/tradeSummaries/tradingItemDetails.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import {
  useMiniPhotoCardWishListImages,
  useOtherGoodsWishListImages,
  usePhotoWishListImages,
} from "../../components/TradeListImage/wishListImages.ts";
import { useTradeSummaryOutletContext } from "../_app.trade._summary/useTradeSummaryOutletContext.ts";
import { Route } from "./+types/route.ts";
import { WishItemList } from "./WishItemList.tsx";

export const meta: Route.MetaFunction = ({ location }) => {
  const title = formatTitle("欲しいやつ");
  const description =
    "高嶺のなでしこ (たかねこ) の生写真やミニフォトカードなどのトレード用画像を作ったついでに欲しいやつをリストアップできます。";
  const image = `https://${DomainName}/takanekono-card-trading-image-generator.png`;
  const url = `https://${DomainName}${location.pathname}`;

  return [
    { title: title },
    { name: "description", content: description },

    { property: "og:site_name", content: OgpSiteName },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "ja_JP" },

    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@takanekofan" },
    { name: "twitter:creator", content: "@takanekofan" },
    { name: "twitter:title", content: title },
    { name: "twitter:image", content: image },
  ];
};

export default function Index() {
  const { selectedMember } = useTradeSummaryOutletContext();

  const allTradeDescriptions = useTradeStore((state) => state.allTradeDescriptions);
  const photos = regularTakanekoPhotos();
  const miniPhotoCards = regularTakanekoMiniPhotoCards();
  const otherGoods = otherTakanekoRandomGoods();

  const photoWants = photos.flatMap((productImage) => {
    const tradeDescriptions = allTradeDescriptions[productImage.id];
    if (tradeDescriptions == undefined) {
      return [];
    }

    const details = mapProductToTradingItemDetails(productImage, tradeDescriptions);
    const wants = details
      .filter((i) => i.status.tag === "want")
      .filter((x) => matchMember(x, selectedMember));
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  const miniPhotoCardWants = miniPhotoCards.flatMap((productImage) => {
    const tradeDescriptions = allTradeDescriptions[productImage.id];
    if (tradeDescriptions == undefined) {
      return [];
    }

    const details = mapProductToTradingItemDetails(productImage, tradeDescriptions);
    const wants = details
      .filter((i) => i.status.tag === "want")
      .filter((x) => matchMember(x, selectedMember));
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  const otherGoodsWants = otherGoods.flatMap((productImage) => {
    const tradeDescriptions = allTradeDescriptions[productImage.id];
    if (tradeDescriptions == undefined) {
      return [];
    }

    const details = mapProductToTradingItemDetails(productImage, tradeDescriptions);
    const wants = details
      .filter((i) => i.status.tag === "want")
      .filter((x) => matchMember(x, selectedMember));
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  const imagesForPhoto = usePhotoWishListImages(photoWants);
  const imagesForMiniPhoto = useMiniPhotoCardWishListImages(miniPhotoCardWants);
  const imagesForOtherGoods = useOtherGoodsWishListImages(otherGoodsWants);

  return (
    <>
      <section className="my-12">
        <h2 className="section-heading px-4">
          <img className="mb-1 inline h-8" src="/求.svg" alt="求" /> 生写真セット
        </h2>

        {photoWants.length != 0 && (
          <div className="px-4">
            {photoWants.map(({ productImage, tradingItemDetails }) => (
              <WishItemList
                key={productImage.slug}
                productImage={productImage}
                tradingItemDetails={tradingItemDetails}
              />
            ))}
          </div>
        )}

        {photoWants.length != 0 && (
          <OrganizedTradeImages title="生写真セットのまとめ" images={imagesForPhoto} />
        )}

        {photoWants.length == 0 && (
          <div className="mt-2 px-4 text-gray-600">
            <p className="mx-auto mt-2 w-fit text-4xl">🐈‍⬛</p>
            <p className="mx-auto mt-2 w-fit text-sm">欲しいやつがありません</p>
          </div>
        )}
      </section>

      <section className="my-12">
        <h2 className="section-heading px-4">
          <img className="mb-1 inline h-8" src="/求.svg" alt="求" /> ミニフォトカードセット
        </h2>

        {miniPhotoCardWants.length != 0 && (
          <div className="px-4">
            {miniPhotoCardWants.map(({ productImage, tradingItemDetails }) => (
              <WishItemList
                key={productImage.slug}
                productImage={productImage}
                tradingItemDetails={tradingItemDetails}
              />
            ))}
          </div>
        )}

        {miniPhotoCardWants.length != 0 && (
          <OrganizedTradeImages
            title="ミニフォトカードセットのまとめ"
            images={imagesForMiniPhoto}
          />
        )}

        {miniPhotoCardWants.length == 0 && (
          <div className="mt-2 px-4 text-gray-600">
            <p className="mx-auto mt-2 w-fit text-4xl">🐈‍⬛</p>
            <p className="mx-auto mt-2 w-fit text-sm">欲しいやつがありません</p>
          </div>
        )}
      </section>

      <section className="my-12">
        <h2 className="section-heading px-4">
          <img className="mb-1 inline h-8" src="/求.svg" alt="求" /> その他
        </h2>

        {otherGoodsWants.length != 0 && (
          <div className="px-4">
            {otherGoodsWants.map(({ productImage, tradingItemDetails }) => (
              <WishItemList
                key={productImage.slug}
                productImage={productImage}
                tradingItemDetails={tradingItemDetails}
              />
            ))}
          </div>
        )}

        {otherGoodsWants.length != 0 && (
          <OrganizedTradeImages
            title="その他のランダムグッズのまとめ"
            images={imagesForOtherGoods}
          />
        )}

        {otherGoodsWants.length == 0 && (
          <div className="mt-2 px-4 text-gray-600">
            <p className="mx-auto mt-2 w-fit text-4xl">🐈‍⬛</p>
            <p className="mx-auto mt-2 w-fit text-sm">欲しいやつがありません</p>
          </div>
        )}
      </section>
    </>
  );
}

const matchMember = (x: TradingItemDetail, selected: MemberDescription | undefined) =>
  selected == undefined || x.item.name == selected.id || x.item.name == selected.nyadeshiko;
