import {
  BsBan,
  BsBoxArrowUp,
  BsCardChecklist,
  BsEraserFill,
  BsGift,
  BsImage,
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";
import { Link } from "react-router";
import { pageHeading, sectionHeading } from "~/components/styles";
import { DOMAIN, SITE_TITLE } from "~/constants";
import { TAKANEKO_PHOTOS, TAKANEKO_PHOTOS_FEATURED } from "~/features/products/productImages";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";
import { formatTitle } from "~/utils/htmlHeader";
import { RandomGoodsList } from "../_app.trade/RandomGoodsList";
import { Route } from "./+types/route";

export const meta: Route.MetaFunction = ({ location }) => {
  const title = formatTitle("トレード画像つくるやつ");
  const description =
    "高嶺のなでしこ (たかねこ) の生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。";
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

const showShareButton = shouldUseWebShareApi();

const tools = [
  {
    component: () => <img className="h-6 w-6" src="/求.svg" alt="求" />,
    description: () => "スタンプを押します。",
  },
  {
    component: () => <img className="h-6 w-6" src="/increment.svg" alt="+1" />,
    description: () => "数字スタンプの数を増やします。",
  },
  {
    component: () => <img className="h-6 w-6" src="/decrement.svg" alt="-1" />,
    description: () => "数字スタンプの数を減らします。",
  },
  {
    component: () => (
      <span className="flex h-6 w-6 items-center justify-center">
        <BsEraserFill className="inline-block h-5 w-5 text-gray-600" />
      </span>
    ),
    description: () => "スタンプを消します。",
  },
  {
    component: () => (
      <span className="flex h-6 w-6 items-center justify-center">
        <BsPencilSquare className="inline-block h-5 w-5 text-gray-600" />
      </span>
    ),
    description: () => "選択したアイテムの詳細を開きます。",
  },
  showShareButton
    ? {
        component: () => (
          <span className="flex h-6 w-6 items-center justify-center">
            <BsBoxArrowUp className="inline-block h-5 w-5 text-gray-600" />
          </span>
        ),
        description: () => "作成した画像の共有メニューを開きます。",
      }
    : {
        component: () => (
          <span className="flex h-6 w-6 items-center justify-center">
            <BsImage className="inline-block h-5 w-5 text-gray-600" />
          </span>
        ),
        description: () => "作成した画像を表示します。",
      },
  {
    component: () => (
      <span className="flex h-6 w-6 items-center justify-center">
        <BsTrash className="inline-block h-5 w-5 text-gray-600" />
      </span>
    ),
    description: () => "スタンプをクリアします。",
  },
];

export default function Index() {
  return (
    <section className="mx-auto py-12 lg:max-w-4xl">
      <h1 className={pageHeading("px-4")}>トレード画像をつくるやつ</h1>

      <div className="my-4 flex justify-between px-4">
        <p>ランダムグッズのトレード画像が作成できます。</p>
        <figure className="mx-4 flex flex-none justify-center">
          <img
            src="/takaneko/sample.png"
            alt="トレード画像のサンプル"
            className="h-36 text-center shadow-md lg:h-64"
          />
        </figure>
      </div>

      <section className="mt-12">
        <h2 className={sectionHeading("mb-2 px-4")}>サマリー</h2>

        <ul className="space-y-4 px-4">
          <li>
            <Link className="group block" to="/trade/wishlist">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <BsCardChecklist className="text-nadeshiko-900 group-hover:text-nadeshiko-950 inline-block" />
                <span className="text-gray-600 group-hover:text-gray-800">欲しいやつ</span>
              </h3>
              <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-800">
                トレード用画像を作ったついでに欲しいやつをリストアップできます。
              </p>
            </Link>
          </li>
          <li>
            <Link className="group block" to="/trade/tradelist">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <BsGift className="text-nadeshiko-900 group-hover:text-nadeshiko-950 inline-block" />
                <span className="text-gray-600 group-hover:text-gray-800">譲れるやつ</span>
              </h3>
              <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-800">
                トレード用画像を作ったついでに譲れるやつをリストアップできます。
              </p>
            </Link>
          </li>
        </ul>
      </section>

      {TAKANEKO_PHOTOS_FEATURED.length > 0 && (
        <section className="mt-12">
          <h2 className={sectionHeading("my-4 px-4")}>ホットなやつ</h2>
          <RandomGoodsList items={TAKANEKO_PHOTOS_FEATURED} />
        </section>
      )}

      <section className="mt-12">
        <h2 className={sectionHeading("my-4 px-4")}>ランダムグッズ</h2>
        <RandomGoodsList items={TAKANEKO_PHOTOS} />
      </section>

      <section className="mt-12 px-4">
        <h2 className={sectionHeading("my-4")}>使い方</h2>

        <p>ツールを選んで、アイテムをタップします。</p>
        <ul className="my-4 list-disc space-y-1 pl-6 marker:text-gray-300">
          {tools.map((tool, i) => (
            <li key={i} className="items-top flex gap-2">
              {tool.component()}
              <span> - </span>
              <span>{tool.description()}</span>
            </li>
          ))}
        </ul>

        <section className="my-8">
          <h3 className="my-2 text-lg font-semibold text-gray-600">アイテムの詳細</h3>
          <p>大きめの画像で確認しながらスタンプを押せます。</p>
          <p>
            スタンプは <img className="inline h-6" src="/求.svg" alt="求" /> /{" "}
            <img className="inline h-6" src="/譲.svg" alt="譲" /> /{" "}
            <img className="inline h-6" src="/1.svg" alt="1" /> /{" "}
            <img className="inline h-6" src="/2.svg" alt="2" /> /{" "}
            <img className="inline h-6" src="/3.svg" alt="3" /> /{" "}
            <img className="inline h-6" src="/4.svg" alt="4" /> /{" "}
            <img className="inline h-6" src="/5.svg" alt="5" /> /{" "}
            <img className="inline h-6" src="/6.svg" alt="6" /> から選択します。
          </p>
          <p>
            スタンプを消すときは <BsBan className="inline-block text-gray-600" /> を選択します。
          </p>
        </section>
      </section>
    </section>
  );
}
