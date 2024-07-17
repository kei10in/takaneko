import type { MetaFunction } from "@remix-run/node";
import { TradeEditor } from "~/components/TradeEditor";
import { TradeEditor2 } from "~/components/TradeEditor2";
import { TAKANEKO_PHOTOS } from "~/features/productImages";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  return (
    <div>
      <div className="sticky top-0 z-40 w-full border-b border-gray-300 bg-white p-4">
        <h1 className="text-xl">トレード用の画像をつくるやつ。</h1>
      </div>
      <div className="container mx-auto">
        <TradeEditor2 productImage={TAKANEKO_PHOTOS[29]} />
        <TradeEditor productImage={TAKANEKO_PHOTOS[29]} />
      </div>
    </div>
  );
}
