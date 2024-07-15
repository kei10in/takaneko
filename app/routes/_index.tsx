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
  return <TradeEditor productImage={TAKANEKO_PHOTOS[29]} />;
}
