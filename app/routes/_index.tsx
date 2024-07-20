import type { MetaFunction } from "@remix-run/node";
import { TradeEditor } from "~/components/TradeEditor";
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
      <div className="sticky top-0 z-40 h-20 w-full border-b border-gray-300 bg-white p-4">
        <div className="container mx-auto flex h-full items-center">
          <h1 className="text-2xl font-bold text-gray-600">トレード画像をつくるやつ。</h1>
        </div>
      </div>
      <div className="container mx-auto mt-4">
        <div className="mx-auto w-[22.5rem]">
          <TradeEditor productImage={TAKANEKO_PHOTOS[29]} width={360} />
        </div>
      </div>
    </div>
  );
}
