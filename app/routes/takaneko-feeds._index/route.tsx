import { BsBoxArrowUp } from "react-icons/bs";
import { MetaFunction } from "react-router";
import { CopyButton } from "~/components/CopyButton";
import { SITE_TITLE } from "~/constants";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";

export const meta: MetaFunction = () => {
  return [
    { title: `RSS フィード - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこに関する RSS フィードを集めました。",
    },
  ];
};

export default function Index() {
  const showShareButton = shouldUseWebShareApi();

  const feeds = [
    {
      name: "たかねこ公式ニュース フィード",
      url: "https://takanenonadeshiko.jp/category/news/feed/",
    },
    {
      name: "たかねこ公式スケジュール フィード",
      url: "https://takanenonadeshiko.jp/events/event/feed/",
    },
  ];

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height))] lg:max-w-5xl">
      <section className="px-4 py-8">
        <section className="text-gray-700">
          <h2 className="center my-4 text-3xl font-semibold text-gray-600">
            たかねこの RSS フィード
          </h2>

          <p>
            高嶺のなでしこ公式サイトの RSS フィードです。ニュースとスケジュールの 2
            つのフィードがあります。
          </p>

          <div className="mt-4 space-y-4">
            {feeds.map((feed) => (
              <div key={feed.url} className="">
                <h3>{feed.name}</h3>
                <div className="mt-2 items-center gap-2 space-y-1 text-gray-600 lg:flex lg:space-y-0">
                  <div className="h-8 flex-1">
                    <input
                      className="h-full w-full rounded-md border px-2 font-mono text-sm"
                      readOnly
                      value={feed.url}
                    />
                  </div>
                  <div className="flex flex-none items-center justify-end">
                    {showShareButton && (
                      <button
                        className="group flex h-8 w-8 items-center justify-center overflow-hidden rounded-md p-2 hover:bg-gray-100"
                        onClick={async () => {
                          if (window?.navigator?.share == undefined) {
                            return;
                          }

                          await window.navigator.share({
                            title: "高嶺のなでしこ公式サイトの URL",
                            text: "",
                            url: feed.url,
                          });
                        }}
                      >
                        <BsBoxArrowUp className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                    <CopyButton className="flex-none" data={feed.url} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
