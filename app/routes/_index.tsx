import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { TradeCounter } from "~/components/TradeCounter";
import { TradeImage } from "~/components/TradeImage.client";
import { TAKANEKO_PHOTOS } from "~/features/productImages";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  const [state, setState] = useState({
    items: [
      { id: 1, name: "城月菜央", count: 0 },
      { id: 2, name: "城月菜央", count: 0 },
      { id: 3, name: "城月菜央", count: 0 },
      { id: 4, name: "涼海すう", count: 0 },
      { id: 5, name: "涼海すう", count: 0 },
      { id: 6, name: "涼海すう", count: 0 },
      { id: 7, name: "橋本桃呼", count: 0 },
      { id: 8, name: "橋本桃呼", count: 0 },
      { id: 9, name: "橋本桃呼", count: 0 },
      { id: 10, name: "葉月紗蘭", count: 0 },
      { id: 11, name: "葉月紗蘭", count: 0 },
      { id: 12, name: "葉月紗蘭", count: 0 },
      { id: 13, name: "春野莉々", count: 0 },
      { id: 14, name: "春野莉々", count: 0 },
      { id: 15, name: "春野莉々", count: 0 },
      { id: 16, name: "東山恵里沙", count: 0 },
      { id: 17, name: "東山恵里沙", count: 0 },
      { id: 18, name: "東山恵里沙", count: 0 },
      { id: 19, name: "日向端ひな", count: 0 },
      { id: 20, name: "日向端ひな", count: 0 },
      { id: 21, name: "日向端ひな", count: 0 },
      { id: 22, name: "星谷美来", count: 0 },
      { id: 23, name: "星谷美来", count: 0 },
      { id: 24, name: "星谷美来", count: 0 },
      { id: 25, name: "松本ももな", count: 0 },
      { id: 26, name: "松本ももな", count: 0 },
      { id: 27, name: "松本ももな", count: 0 },
      { id: 28, name: "籾山ひめり", count: 0 },
      { id: 29, name: "籾山ひめり", count: 0 },
      { id: 30, name: "籾山ひめり", count: 0 },
    ],
  });

  return (
    <div>
      <ol className="p-4">
        {state.items.map((item) => (
          <li key={item.id}>
            <div className="flex items-center gap-2 p-1">
              <p className="flex-1">
                {item.id}. {item.name}: {item.count}
              </p>

              <TradeCounter
                onChange={(i) => {
                  setState((state) => {
                    const items = [...state.items];
                    items[item.id - 1].count = i - 1;
                    return { ...state, items };
                  });
                }}
              />
            </div>
          </li>
        ))}
      </ol>

      <div>
        {TAKANEKO_PHOTOS.map((productImage) =>
          productImage.positions.length != 0 ? (
            <TradeImage
              key={productImage.name}
              productImage={productImage}
              showRect
            />
          ) : null
        )}
      </div>
    </div>
  );
}
