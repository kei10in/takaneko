import {
  BsBan,
  BsBoxArrowUp,
  BsEraserFill,
  BsImage,
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";
import { sectionHeading } from "~/components/styles.ts";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi.ts";

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

export function TradeInstructions() {
  return (
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
          <img className="inline h-6" src="/1.svg" alt="1" /> 〜{" "}
          <img className="inline h-6" src="/12.svg" alt="12" /> / 絵文字スタンプから選択します。
        </p>
        <p>
          スタンプを消すときは <BsBan className="inline-block text-gray-600" /> を選択します。
        </p>
      </section>
    </section>
  );
}
