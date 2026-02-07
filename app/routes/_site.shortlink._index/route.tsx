import {
  Form,
  Link,
  LoaderFunctionArgs,
  MetaFunction,
  useLoaderData,
  useSearchParams,
} from "react-router";
import { SharableUrl } from "~/components/SharableUrl";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";
import { shortlink, ShortLinkResult } from "~/utils/shortlink";

export const meta: MetaFunction = () => {
  return [
    { title: `短い URL を作るやつ - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこ公式サイトの URL を高嶺のなでしこ公式 X のポストにあるような短い URL に変換します。",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs): Promise<ShortLinkResult> {
  const requestUrl = new URL(request.url);
  const url = requestUrl.searchParams.get("url");
  if (url == undefined) {
    return {};
  }

  const result = await shortlink(url);

  return result;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const urlInQuery = searchParams.get("url");

  const showShareButton = shouldUseWebShareApi();

  let error: string | undefined = undefined;
  if (urlInQuery != undefined) {
    if (data.error == "Invalid URL") {
      error = "高嶺のなでしこ公式サイトの URL を入力してください。";
    } else if (data.error == "Page Not Found") {
      error = "高嶺のなでしこ公式サイトにページが見つかりませんでした。";
    } else if (data.error == "Shortlink Not Found") {
      error = "短くできないページです。";
    } else if (data.error == "Unknown Error") {
      error = "エラーが発生しました。";
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>短い URL を作るやつ</h1>
        <p className="mt-8">
          高嶺のなでしこ公式のツイートの https://takanenonadeshiko.jp/?p=55 のような短い URL
          を作ります。
        </p>
        <p className="mt-2">
          高嶺のなでしこ公式サイトの URL を X にポストしたいんだけどどうやったら公式 X みたいな URL
          になるの？という疑問にお応えします。
        </p>
        <Form className="mt-4 items-center space-y-2 md:flex md:gap-2 md:space-y-0" method="get">
          <input
            className="block h-8 w-full rounded-md border border-gray-200 px-2 font-mono text-sm outline-hidden md:flex-1"
            type="text"
            placeholder="高嶺のなでしこ公式サイト内のページの URL"
            name="url"
            defaultValue={urlInQuery ?? undefined}
          />
          <button
            className="ml-auto block h-8 rounded-md bg-nadeshiko-800 px-6 font-bold text-white md:ml-0 md:flex-none"
            type="submit"
          >
            短くする
          </button>
        </Form>
        {error != undefined && <p className="mx-2 my-2 text-nadeshiko-900">{error}</p>}

        {data.url != undefined && (
          <section className="mt-4">
            <h3 className="text-bold mb-2 text-xl text-gray-700">結果</h3>
            <SharableUrl
              url={data.url}
              title="高嶺のなでしこ公式サイトの URL"
              shareButton={showShareButton}
              className="mt-2"
            />
          </section>
        )}

        <section className="mt-16 space-y-4">
          <h2 className={sectionHeading()}>iPhone に追加する</h2>
          <p>
            Siri ショートカットを使って iPhone の共有メニューに、短い URL
            を作る機能を追加することができます。
          </p>

          <section className="space-y-2">
            <h3 className="text-bold text-lg">初期設定:</h3>

            <p>
              この Siri ショートカットを利用するには、スクリプトの実行を許可する必要があります。
              手順に従ってスクリプトの実行を許可してください。
            </p>

            <ol className="list-rounded-decimal space-y-4">
              <li>設定アプリを開きます。</li>
              <li>アプリ &gt; ショートカット &gt; 詳細 を開きます。</li>
              <li>
                <p>「スクリプトの実行を許可」をオンにします。</p>
                <p className="mt-2 mb-4 text-center">
                  <img
                    className="inline w-60 shadow-sm"
                    src="/shortlink/allow-exec-shortcut.webp"
                    alt="設定画面"
                  />
                </p>
              </li>
              <li>
                <p>👇のボタンをタップしてショートカットを追加します。</p>
                <Link
                  className="mx-auto mt-2 mb-4 flex h-8 w-fit items-center justify-center rounded-md bg-nadeshiko-800 px-6 font-bold text-white"
                  to="https://www.icloud.com/shortcuts/a69485f588084ac5841ef1c808bd2283"
                  target="_blank"
                  rel="noreferrer"
                >
                  ショートカットを追加
                </Link>
              </li>
            </ol>
          </section>

          <section className="space-y-2">
            <h3 className="text-bold text-lg">使い方:</h3>

            <ol className="list-rounded-decimal mt-4 space-y-4">
              <li>短縮 URL を作りたい、高嶺のなでしこ公式サイトのページをブラウザで開きます。</li>
              <li>
                <p>共有ボタンをタップしてメニューを開きます。</p>
                <p className="text-center">
                  <img
                    className="inline w-60 shadow-sm"
                    src="/shortlink/share-button.webp"
                    alt="共有ボタン"
                  />
                </p>
              </li>

              <li>共有メニューから「たかねこの短縮 URL」を選択します。</li>
              <li>短縮された URL がクリップボードにコピーされます。</li>
            </ol>
          </section>
        </section>
      </section>
    </div>
  );
}
