import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { BsCheck, BsChevronDown, BsGift } from "react-icons/bs";
import { MetaFunction, useSearchParams } from "react-router";
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
import { AllMembers, MemberDescription } from "../../features/profile/members";
import { TradingItemList } from "./TradingItemList";

export const meta: MetaFunction = () => {
  return [
    { title: `譲れるやつ -  ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "生写真やミニフォトカードなどのトレード用画像を作ったついでに譲れるやつをリストアップできます。",
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

  return (
    <div className="mx-auto w-full max-w-lg lg:max-w-3xl">
      <section className="px-4 py-8">
        <h1 className="my-4 flex items-center gap-3 text-3xl font-semibold text-gray-600">
          <BsGift className="text-nadeshiko-900 inline-block" />
          <span>譲れるやつ</span>
        </h1>
        <div className="flex justify-end">
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
          <h2 className="text-2xl font-semibold text-gray-600">
            <img className="mb-1 inline h-8" src="/譲.svg" alt="譲" /> 生写真
          </h2>
          {photoWants.map(({ productImage, tradingItemDetails }) => (
            <TradingItemList
              key={productImage.slug}
              productImage={productImage}
              tradingItemDetails={tradingItemDetails}
            />
          ))}
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            <img className="mb-1 inline h-8" src="/譲.svg" alt="譲" /> ミニフォトカード
          </h2>
          {miniPhotoCardWants.map(({ productImage, tradingItemDetails }) => (
            <TradingItemList
              key={productImage.slug}
              productImage={productImage}
              tradingItemDetails={tradingItemDetails}
            />
          ))}
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            <img className="mb-1 inline h-8" src="/譲.svg" alt="譲" /> その他
          </h2>
          {otherGoodsWants.map(({ productImage, tradingItemDetails }) => (
            <TradingItemList
              key={productImage.slug}
              productImage={productImage}
              tradingItemDetails={tradingItemDetails}
            />
          ))}
        </section>
      </section>
    </div>
  );
}

const matchMember = (x: TradingItemDetail, selected: MemberDescription | undefined) =>
  selected == undefined || x.item.name == selected.id || x.item.name == selected.nyadeshiko;
