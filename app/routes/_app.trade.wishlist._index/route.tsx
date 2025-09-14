import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { useMemo } from "react";
import { BsCardChecklist, BsCheck, BsChevronDown } from "react-icons/bs";
import { MetaFunction, useSearchParams } from "react-router";
import { OrganizedTradeImages } from "~/components/TradeListImage/OrganizedTradeImages";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import {
  otherTakanekoRandomGoods,
  regularTakanekoMiniPhotoCards,
  regularTakanekoPhotos,
} from "~/features/products/productImages";
import { useTradeStore } from "~/features/trade/store";
import {
  mapProductToTradingItemDetails,
  TradingItemDetail,
} from "~/features/tradeSummaries/tradingItemDetails";
import {
  useMiniPhotoCardWishListImages,
  useOtherGoodsWishListImages,
  usePhotoWishListImages,
} from "../../components/TradeListImage/wishListImages";
import { AllMembers, MemberDescription } from "../../features/profile/members";
import { WishItemList } from "./WishItemList";

export const meta: MetaFunction = () => {
  return [
    { title: `欲しいやつ -  ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "生写真やミニフォトカードなどのトレード用画像を作ったついでに欲しいやつをリストアップできます。",
    },
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
      .filter((i) => i.status.tag === "want")
      .filter((x) => matchMember(x, selected));
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  const miniPhotoCardWants = useMemo(
    () =>
      miniPhotoCards.flatMap((productImage) => {
        const tradeDescriptions = allTradeDescriptions[productImage.id];
        if (tradeDescriptions == undefined) {
          return [];
        }

        const details = mapProductToTradingItemDetails(productImage, tradeDescriptions);
        const wants = details
          .filter((i) => i.status.tag === "want")
          .filter((x) => matchMember(x, selected));
        if (wants.length === 0) {
          return [];
        }

        return [{ productImage, tradingItemDetails: wants }];
      }),
    [allTradeDescriptions, miniPhotoCards, selected],
  );

  const otherGoodsWants = otherGoods.flatMap((productImage) => {
    const tradeDescriptions = allTradeDescriptions[productImage.id];
    if (tradeDescriptions == undefined) {
      return [];
    }

    const details = mapProductToTradingItemDetails(productImage, tradeDescriptions);
    const wants = details
      .filter((i) => i.status.tag === "want")
      .filter((x) => matchMember(x, selected));
    if (wants.length === 0) {
      return [];
    }

    return [{ productImage, tradingItemDetails: wants }];
  });

  const imagesForPhoto = usePhotoWishListImages(photoWants);
  const imagesForMiniPhoto = useMiniPhotoCardWishListImages(miniPhotoCardWants);
  const imagesForOtherGoods = useOtherGoodsWishListImages(otherGoodsWants);

  return (
    <div className="mx-auto w-full max-w-lg lg:max-w-3xl">
      <section className={pageBox()}>
        <h1 className={pageHeading("flex items-center gap-3 px-4")}>
          <BsCardChecklist className="inline-block" />
          <span>欲しいやつ</span>
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
            <OrganizedTradeImages title="生写真のまとめ" images={imagesForPhoto} />
          )}

          {photoWants.length == 0 && (
            <div className="mt-2 px-4 text-gray-600">
              <p className="mx-auto mt-2 w-fit text-4xl">🐈‍⬛</p>
              <p className="mx-auto mt-2 w-fit text-sm">欲しいやつがありません</p>
            </div>
          )}
        </section>

        <section className="my-12">
          <h2 className={sectionHeading("px-4")}>
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
            <OrganizedTradeImages title="ミニフォトカードのまとめ" images={imagesForMiniPhoto} />
          )}

          {miniPhotoCardWants.length == 0 && (
            <div className="mt-2 px-4 text-gray-600">
              <p className="mx-auto mt-2 w-fit text-4xl">🐈‍⬛</p>
              <p className="mx-auto mt-2 w-fit text-sm">欲しいやつがありません</p>
            </div>
          )}
        </section>

        <section className="my-12">
          <h2 className={sectionHeading("px-4")}>
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
      </section>
    </div>
  );
}

const matchMember = (x: TradingItemDetail, selected: MemberDescription | undefined) =>
  selected == undefined || x.item.name == selected.id || x.item.name == selected.nyadeshiko;
