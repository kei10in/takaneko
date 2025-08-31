import { MetaFunction } from "react-router";
import { SharableUrl } from "~/components/SharableUrl";
import { pageBox, pageHeading } from "~/components/styles";
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
    <div className="container mx-auto max-w-3xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>たかねこの RSS フィード</h1>

        <p className="mt-8">
          高嶺のなでしこ公式サイトの RSS フィードです。ニュースとスケジュールの 2
          つのフィードがあります。
        </p>

        <div className="mt-4 space-y-4">
          {feeds.map((feed) => (
            <div key={feed.url} className="">
              <h3>{feed.name}</h3>
              <SharableUrl
                className="mt-2"
                url={feed.url}
                shareButton={showShareButton}
                title={feed.name}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
