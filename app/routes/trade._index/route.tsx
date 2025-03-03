import { Link, MetaFunction } from "react-router";
import {
  BsBan,
  BsBoxArrowUp,
  BsEraserFill,
  BsImage,
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";
import { SITE_TITLE } from "~/constants";
import { TAKANEKO_PHOTOS } from "~/features/products/productImages";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";
import { ProductItem } from "../trade/ProductItem";

export const meta: MetaFunction = () => {
  return [
    { title: `トレード画像つくるやつ - ${SITE_TITLE}` },
    {
      name: "description",
      content: "生写真やミニフォトカードのトレード用画像を作れるウェブアプリケーションです。",
    },
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
    <section className="px-4 py-8">
      <h1 className="my-4 text-3xl font-semibold text-gray-600">トレード画像をつくるやつ</h1>

      <p>ランダムグッズのトレード画像が作成できます。</p>

      <figure className="m-4 flex justify-center">
        <img src="/takaneko/sample.png" alt="サンプル" className="h-96 text-center shadow-md" />
      </figure>

      <section className="mt-12">
        <h2 className="my-4 text-center text-2xl font-semibold text-gray-600">ランダムグッズ</h2>
        <ul className="flex flex-wrap justify-center gap-4">
          {TAKANEKO_PHOTOS.map((photo) => (
            <li key={photo.slug}>
              <Link to={`/trade/${photo.slug}`}>
                <ProductItem
                  image={photo.url}
                  year={photo.year}
                  content={photo.series}
                  description={photo.category}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="my-4 text-center text-2xl font-semibold text-gray-600">使い方</h2>

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
