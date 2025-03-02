import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { ItemDescription } from "~/features/products/product";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { useTradeStore } from "~/features/trade/store";
import { AllMembers } from "../members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `トレードしたいやつのサマリー - ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
  ];
};

export default function Index() {
  const allTradeDescriptions = useTradeStore((state) => state.allTradeDescriptions);
  const photos = TAKANEKO_PHOTOS.filter((x) => x.category === "生写真");
  const miniPhotoCards = TAKANEKO_PHOTOS.filter((x) => x.category === "ミニフォト");

  return (
    <section className="px-4 py-8">
      <h1 className="my-4 text-3xl font-semibold text-gray-600">トレードしたいやつのサマリー</h1>

      <h2 className="text-2xl font-semibold text-gray-600">生写真</h2>
      {photos.map((productImage) => {
        const tradeDescriptions = allTradeDescriptions[productImage.id];
        if (tradeDescriptions == undefined) {
          return null;
        }

        const members: { name: string; items: ItemDescription[] }[] = [];
        productImage.lineup.forEach((item) => {
          const member = members.find((m) => m.name === item.name);
          if (member) {
            member.items.push(item);
          } else {
            members.push({ name: item.name, items: [item] });
          }
        });

        const wants = members.flatMap((member) => {
          const wants = member.items
            .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
            .map((i) => i.id);
          if (wants.length === 0) {
            return [];
          }
          const memberDesc = AllMembers.find((m) => m.id == member.name);
          if (memberDesc == undefined) {
            return [];
          }
          return [{ member: memberDesc, wants }];
        });
        if (wants.length === 0) {
          return null;
        }

        return (
          <div key={productImage.id} className="my-4">
            <h3 className="text-sm text-gray-600">{productImage.name}</h3>
            <ul className="text-sm">
              {wants.map((item) => (
                <li key={item.member.id}>
                  {item.member.name} - {item.wants.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <h2 className="text-2xl font-semibold text-gray-600">ミニフォトカード</h2>
      {miniPhotoCards.map((productImage) => {
        const tradeDescriptions = allTradeDescriptions[productImage.id];
        if (tradeDescriptions == undefined) {
          return null;
        }

        const members: { name: string; items: ItemDescription[] }[] = [];
        productImage.lineup.forEach((item) => {
          const member = members.find((m) => m.name === item.name);
          if (member) {
            member.items.push(item);
          } else {
            members.push({ name: item.name, items: [item] });
          }
        });

        const wants = members.flatMap((member) => {
          const wants = member.items
            .filter((i) => tradeDescriptions[i.id]?.status.tag === "want")
            .map((i) => i.id);
          if (wants.length === 0) {
            return [];
          }
          const memberDesc = AllMembers.find((m) => m.id == member.name);
          if (memberDesc == undefined) {
            return [];
          }
          return [{ member: memberDesc, wants }];
        });
        if (wants.length === 0) {
          return null;
        }

        return (
          <div key={productImage.id} className="my-4">
            <h3 className="text-sm text-gray-600">{productImage.name}</h3>
            <ul className="text-sm">
              {wants.map((item) => (
                <li key={item.member.id}>
                  {item.member.name} - {item.wants.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
