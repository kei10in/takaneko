import { Dialog, DialogPanel } from "@headlessui/react";
import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { TbMenu2, TbX } from "react-icons/tb";
import { MenuItem } from "~/components/MenuItem";
import { ReadMe } from "~/components/ReadMe";
import { TradeEditor } from "~/components/TradeEditor";
import { ProductImage, TAKANEKO_PHOTOS } from "~/features/productImages";
import { TradeDescription, TradeState } from "~/features/TradeState";

export const meta: MetaFunction = () => {
  return [
    { title: "トレード画像つくるやつ。- 高嶺のなでしこの" },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);

  const in2022 = TAKANEKO_PHOTOS.filter((p) => p.year == 2022).toReversed();
  const in2023 = TAKANEKO_PHOTOS.filter((p) => p.year == 2023).toReversed();
  const in2024 = TAKANEKO_PHOTOS.filter((p) => p.year == 2024).toReversed();

  const [selectedProduct, setSelectedProduct] = useState<ProductImage | undefined>(undefined);

  const [allTradeDescriptions, setAllTradeDescriptions] = useState<
    Record<string, TradeDescription[]>
  >({});

  const handleClickMenuItem = (product: ProductImage) => {
    const photos = product.photos;

    if (!(product.id in allTradeDescriptions)) {
      const noneState: TradeState = { tag: "none" };
      const newAllTradeDescriptions = {
        ...allTradeDescriptions,
        [product.id]: photos.map((p) => ({ id: p.id, state: noneState })),
      };
      setAllTradeDescriptions(newAllTradeDescriptions);
    }

    setSelectedProduct(product);
    setShowMenu(false);
  };

  return (
    <div>
      <div className="sticky top-0 z-40 h-20 w-full border-b border-gray-300 bg-white p-4">
        <div className="container mx-auto flex h-full items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-600">
            <button onClick={() => setSelectedProduct(undefined)}>
              トレード画像をつくるやつ。
            </button>
          </h1>
          <div className="flex-none">
            <button
              className="rounded-full p-2 text-2xl hover:bg-gray-200"
              onClick={() => setShowMenu(true)}
            >
              <TbMenu2 />
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        {selectedProduct == undefined ? (
          <ReadMe />
        ) : (
          <div className="mx-auto w-[22.5rem]">
            <TradeEditor
              productImage={selectedProduct}
              tradeDescriptions={allTradeDescriptions[selectedProduct.id]}
              onChangeTradeDescriptions={(v) => {
                setAllTradeDescriptions({
                  ...allTradeDescriptions,
                  [selectedProduct.id]: v,
                });
              }}
              width={360}
            />
          </div>
        )}
      </div>

      <Dialog open={showMenu} onClose={() => setShowMenu(false)}>
        <div className="items-top fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <DialogPanel className="relative w-80 overflow-y-auto border-l border-gray-200 bg-white">
            <div className="absolute right-4 top-5 flex-none">
              <button
                className="rounded-full p-2 text-2xl hover:bg-gray-200"
                onClick={() => setShowMenu(false)}
              >
                <TbX />
              </button>
            </div>
            <div className="mt-3">
              <h3 className="px-4 py-4 text-xl font-bold">2024 年</h3>
              <ul>
                {in2024.map((photo) => (
                  <li key={photo.id}>
                    <MenuItem
                      selected={selectedProduct?.id == photo.id}
                      disabled={photo.positions.length == 0}
                      onClick={() => handleClickMenuItem(photo)}
                    >
                      {photo.name}
                    </MenuItem>
                  </li>
                ))}
              </ul>
              <h3 className="px-4 py-4 text-xl font-bold">2023 年</h3>
              <ul>
                {in2023.map((photo) => (
                  <li key={photo.id}>
                    <MenuItem
                      selected={selectedProduct?.id == photo.id}
                      disabled={photo.positions.length == 0}
                      onClick={() => handleClickMenuItem(photo)}
                    >
                      {photo.name}
                    </MenuItem>
                  </li>
                ))}
              </ul>
              <h3 className="px-4 py-4 text-xl font-bold">2022 年</h3>
              <ul>
                {in2022.map((photo) => (
                  <li key={photo.id}>
                    <MenuItem
                      selected={selectedProduct?.id == photo.id}
                      disabled={photo.positions.length == 0}
                      onClick={() => handleClickMenuItem(photo)}
                    >
                      {photo.name}
                    </MenuItem>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 p-4 text-sm text-gray-800">
              <p>このサイトは非公式のファンコンテンツです。</p>
              <p>使用されている高嶺のなでしこの画像は INCS・TP の所有物です。©INCS・TP</p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
