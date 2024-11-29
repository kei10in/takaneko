import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, MetaFunction, useLoaderData, useSearchParams } from "@remix-run/react";
import { BsBoxArrowUp } from "react-icons/bs";
import { CopyButton } from "~/components/CopyButton";
import { SITE_TITLE } from "~/constants";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";
import { shortlink } from "~/utils/shortlink";

export const meta: MetaFunction = () => {
  return [
    { title: `ツールだよ - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこ 関係のツールだよ",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs): Promise<{ url?: string }> {
  const requestUrl = new URL(request.url);
  const url = requestUrl.searchParams.get("url");
  if (url == undefined) {
    return {};
  }

  if (!url.startsWith("https://takanenonadeshiko.jp")) {
    return {};
  }

  const result = await shortlink(url);

  return { url: result };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const urlInQuery = searchParams.get("url");

  const showShareButton = shouldUseWebShareApi();

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height))] lg:max-w-5xl">
      <section className="px-4 py-8">
        <section className="text-gray-700">
          <h2 className="center my-4 text-3xl font-semibold text-gray-600">
            <code>?p=XXXX</code> みたいな URL を作るやつ
          </h2>
          <p className="mt-8">
            高嶺のなでしこ公式のツイートの https://takanenonadeshiko.jp/?p=55 のような短い URL
            を作ります。
          </p>
          <Form className="mt-8 flex items-center space-x-2" method="get">
            <input
              className="flex-1 text-wrap rounded-md border px-2 py-2 outline-none"
              type="text"
              placeholder="URL"
              name="url"
              defaultValue={urlInQuery ?? undefined}
            />
            <button
              className="rounded-md bg-nadeshiko-800 px-6 py-2 font-bold text-white"
              type="submit"
            >
              短くする
            </button>
          </Form>
          {urlInQuery != "" && urlInQuery != undefined && data.url == undefined && (
            <p className="mx-2 my-2 text-nadeshiko-900">
              高嶺のなでしこ公式サイトの URL を入力してください。
            </p>
          )}

          {data.url != undefined && (
            <section className="mt-12">
              <h3 className="text-bold mb-2 mt-12 text-xl text-gray-700">結果</h3>
              <div className="rounded-md border p-4">
                <p className="flex items-center gap-2 text-lg text-gray-600">
                  <span className="flex-1">{data.url}</span>
                  {showShareButton && (
                    <button
                      className="group flex h-9 w-9 items-center justify-center overflow-hidden rounded-md p-2 hover:bg-gray-100"
                      onClick={async () => {
                        if (window?.navigator?.share == undefined) {
                          return;
                        }

                        await window.navigator.share({
                          title: "高嶺のなでしこ公式サイトの URL",
                          text: "",
                          url: data.url,
                        });
                      }}
                    >
                      <BsBoxArrowUp className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  <CopyButton className="flex-none" data={data.url} />
                </p>
              </div>
            </section>
          )}
        </section>
      </section>
    </div>
  );
}
