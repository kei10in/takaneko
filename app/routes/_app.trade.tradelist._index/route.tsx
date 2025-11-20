import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { BsCheck, BsChevronDown, BsGift } from "react-icons/bs";
import { useSearchParams } from "react-router";
import { OrganizedTradeImages } from "~/components/TradeListImage/OrganizedTradeImages";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { DOMAIN, SITE_TITLE } from "~/constants";
import {
  otherTakanekoRandomGoods,
  regularTakanekoMiniPhotoCards,
  regularTakanekoPhotos,
} from "~/features/products/productImages";
import { MemberDescription } from "~/features/profile/types";
import { useTradeStore } from "~/features/trade/store";
import {
  mapProductToTradingItemDetails,
  TradingItemDetail,
} from "~/features/tradeSummaries/tradingItemDetails";
import { formatTitle } from "~/utils/htmlHeader";
import {
  useMiniPhotoCardOfferListImages,
  useOtherGoodsOfferListImages,
  usePhotoOfferListImages,
} from "../../components/TradeListImage/offerListImages";
import { AllMembers } from "../../features/profile/members";
import { Route } from "./+types/route";
import { TradingItemList } from "./TradingItemList";

export const meta: Route.MetaFunction = ({ location }) => {
  const title = formatTitle("譲れるやつ");
  const description =
    "高嶺のなでしこ (たかねこ) の生写真やミニフォトカードなどのトレード用画像を作ったついでに譲れるやつをリストアップできます。";
  const image = `https://${DOMAIN}/takanekono-card-trading-image-generator.png`;
  const url = `https://${DOMAIN}${location.pathname}`;

  return [
    { title: title },
    { name: "description", content: description },

    { property: "og:site_name", content: SITE_TITLE },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = AllMembers.find((x) => x.id == searchParams.get("m"));

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
      .filter((i) => i.status.tag === "have")
      .filter((x) => matchMember(x, selected));
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
      .filter((i) => i.status.tag === "have")
      .filter((x) => matchMember(x, selected));
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
      .filter((i) => i.status.tag === "have")
      .filter((x) => matchMember(x, selected));
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  const imagesForPhoto = usePhotoOfferListImages(photoWants);
  const imagesForMiniPhoto = useMiniPhotoCardOfferListImages(miniPhotoCardWants);
  const imagesForOtherGoods = useOtherGoodsOfferListImages(otherGoodsWants);

  return (
    <div className="mx-auto w-full max-w-lg lg:max-w-3xl">
      <section className={pageBox()}>
        <h1 className={pageHeading("flex items-center gap-3 px-4")}>
          <BsGift className="inline-block" />
          <span>譲れるやつ</span>
        </h1>
        <div className="flex justify-end px-4">
          <Popover className="w-28">
            <PopoverButton className="flex w-full items-center justify-between text-sm text-gray-600">
              <div className="mx-auto flex-1 pl-2">メンバー</div>
              <div className="flex-none px-1">
                <BsChevronDown className="text-xs" />
              </div>
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: "bottom end", gap: "0.5rem" }}
              className="border-nadeshiko-100 bg-nadeshiko-50 overflow-hidden rounded-sm border py-2 shadow-md"
            >
              <ul className="min-w-60">
                <li>
                  <CloseButton
                    className={clsx(
                      "flex items-center gap-2",
                      "hover:bg-nadeshiko-300 w-full px-6 py-1 text-base text-gray-600",
                      "data-current:bg-nadeshiko-700 data-current:text-white",
                    )}
                    onClick={() => setSearchParams(undefined, { preventScrollReset: true })}
                  >
                    <div className="text-nadeshiko-800 h-6 w-6">
                      {AllMembers.every((x) => x.id != selected?.id) ? (
                        <BsCheck className="h-full w-full" />
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src="/takaneko/tennya.png"
                        alt="全員"
                        className="h-8 w-8 rounded-full bg-white object-cover object-top"
                      />
                      <p>全員</p>
                    </div>
                  </CloseButton>
                </li>
                {AllMembers.map((c) => (
                  <li key={c.id}>
                    <CloseButton
                      className={clsx(
                        "flex items-center gap-2",
                        "hover:bg-nadeshiko-300 w-full px-6 py-1 text-base text-gray-600",
                        "data-current:bg-nadeshiko-700 data-current:text-white",
                      )}
                      onClick={() => setSearchParams({ m: c.id }, { preventScrollReset: true })}
                    >
                      <div className="text-nadeshiko-800 h-6 w-6">
                        {c.id == selected?.id ? <BsCheck className="h-full w-full" /> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <img
                          src={c.idPhoto.path}
                          alt={c.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <p>{c.name}</p>
                      </div>
                    </CloseButton>
                  </li>
                ))}
              </ul>
            </PopoverPanel>
          </Popover>
        </div>
        <section className="my-12">
          <h2 className={sectionHeading("px-4")}>
            <img className="mb-1 inline h-8" src="/譲.svg" alt="譲" /> 生写真セット
          </h2>

          {photoWants.length != 0 && (
            <div className="px-4">
              {photoWants.map(({ productImage, tradingItemDetails }) => (
                <TradingItemList
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
              <p className="mx-auto mt-2 w-fit text-4xl">🌸</p>
              <p className="mx-auto mt-2 w-fit text-sm">譲れるやつがありません</p>
            </div>
          )}
        </section>

        <section className="my-12">
          <h2 className={sectionHeading("px-4")}>
            <img className="mb-1 inline h-8" src="/譲.svg" alt="譲" /> ミニフォトカードセット
          </h2>

          {miniPhotoCardWants.length != 0 && (
            <div className="px-4">
              {miniPhotoCardWants.map(({ productImage, tradingItemDetails }) => (
                <TradingItemList
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
              <p className="mx-auto mt-2 w-fit text-4xl">🌸</p>
              <p className="mx-auto mt-2 w-fit text-sm">譲れるやつがありません</p>
            </div>
          )}
        </section>

        <section className="my-12">
          <h2 className={sectionHeading("px-4")}>
            <img className="mb-1 inline h-8" src="/譲.svg" alt="譲" /> その他
          </h2>

          {otherGoodsWants.length != 0 && (
            <div className="px-4">
              {otherGoodsWants.map(({ productImage, tradingItemDetails }) => (
                <TradingItemList
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
              <p className="mx-auto mt-2 w-fit text-4xl">🌸</p>
              <p className="mx-auto mt-2 w-fit text-sm">譲れるやつがありません</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

const matchMember = (x: TradingItemDetail, selected: MemberDescription | undefined) =>
  selected == undefined || x.item.name == selected.id || x.item.name == selected.nyadeshiko;
