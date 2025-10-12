import { ClassValue, clsx } from "clsx";
import { BsDownload, BsExclamationTriangleFill } from "react-icons/bs";
import { Link, MetaFunction } from "react-router";
import { LinkCard } from "~/components/link-card/LinkCard";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: `ユーザー スクリプト - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこに関するユーザー スクリプトを紹介します。iPhone で「たかねこナイト」をバックグランド再生する方法を紹介しています。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto max-w-3xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>ユーザー スクリプト</h1>

        <p className="mt-8">高嶺のなでしこに関係するユーザー スクリプトを紹介しています。</p>

        <div className="border-nadeshiko-800 bg-nadeshiko-200 mt-4 flex items-center gap-3 rounded-lg border px-3 py-2 text-xs">
          <BsExclamationTriangleFill className="text-nadeshiko-900 size-6 flex-none" />
          <p className="min-w-0 flex-1">
            ユーザー スクリプトの利用は自己責任でお願いします。
            このページの内容によって生じた不利益について、当サイトは一切の責任を負いません。
          </p>
        </div>

        <section className="mt-12">
          <h2 className={sectionHeading()}>「たかねこナイト」をバックグランドで再生する</h2>

          <p className="mt-4">
            iPhone で「たかねこナイト」をバックラウンド再生する方法です。この手順はページを Safari
            で開いて実施してください。
          </p>

          <ol className={orderedList("mt-4 space-y-6 pl-8")}>
            <li className={orderedListItem("space-y-2")}>
              <p>
                App Store から
                <Link
                  className="text-nadeshiko-800 hover:underline"
                  to="https://apps.apple.com/jp/app/userscripts/id1463298887"
                  target="_blank"
                  rel="noreferrer"
                >
                  Userscripts
                </Link>
                をインストールします。
              </p>
              <LinkCard to="https://apps.apple.com/jp/app/userscripts/id1463298887" />
            </li>
            <li className={orderedListItem("space-y-2")}>
              次のリンクからスクリプト ファイル
              <span className="rounded-sm bg-zinc-100 px-1 font-mono">
                allow-background-play.user.js
              </span>
              をダウンロードします。
              <a
                className="bg-nadeshiko-800 mt-2 mb-4 flex h-8 w-fit items-center justify-center rounded-md px-6 font-bold text-white"
                href="/user-scripts/allow-background-play.user.js"
                download
              >
                <BsDownload className="mr-2 inline-block" />
                <span>ダウンロード</span>
              </a>
            </li>
            <li className={orderedListItem("space-y-2")}>
              ダウンロードしたファイルを「この iPhone内」にある
              <span className="rounded-sm bg-zinc-100 px-1 font-mono">Userscripts</span>
              フォルダに移動します。フォルダがない場合は作成します。ファイルの移動には「ファイル」アプリを利用します。
            </li>
            <li className={orderedListItem("space-y-2")}>
              <p>Safari を開き、アドレスバーの左にあるボタンから表示メニューを開きます。</p>
              <img
                className="mt-2 max-w-60 rounded bg-zinc-50 shadow"
                src="/user-scripts/enable-userscripts-01.webp"
                alt="ステップ 1: 表示メニューを開く"
              />
            </li>
            <li className={orderedListItem("space-y-2")}>
              <p>
                <span>表示メニューの中から「機能拡張を管理」を選択します。</span>
                <br />
                <img
                  className="mt-2 max-w-60 rounded bg-zinc-50 shadow"
                  src="/user-scripts/enable-userscripts-02.webp"
                  alt="ステップ 2: 機能拡張を管理を選択"
                />
              </p>
            </li>
            <li className={orderedListItem("space-y-2")}>
              <p>
                <span>機能拡張の一覧から「Userscripts」をオンにします。</span>
                <br />
                <img
                  className="mt-2 max-w-60 rounded bg-zinc-50 shadow"
                  src="/user-scripts/enable-userscripts-03.webp"
                  alt="ステップ 3: Userscripts をオンにする"
                />
              </p>
            </li>
            <li className={orderedListItem("space-y-2")}>
              <p>
                <Link
                  className="text-nadeshiko-800 hover:underline"
                  to="https://audee-membership.jp/takanenonadeshiko"
                  target="_blank"
                  rel="noreferrer"
                >
                  たかねこナイト
                </Link>
                がバックグランド再生できることを確認します。
              </p>
            </li>
          </ol>
        </section>
      </section>
    </div>
  );
}

export const orderedList = (...args: ClassValue[]) => {
  return clsx("[counter-reset:list]", ...args);
};

export const orderedListItem = (...args: ClassValue[]) => {
  return clsx(
    "before:float-left before:mr-2 before:-ml-8 before:rounded-full",
    "before:text-center",
    "before:bg-nadeshiko-800 before:size-6 before:font-bold before:text-white",
    "before:content-[counter(list)] before:[counter-increment:list]",
    ...args,
  );
};
