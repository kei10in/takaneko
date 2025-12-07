import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Link, MetaFunction } from "react-router";
import { pageBox, pageHeading } from "~/components/styles";
import { ALL_SONGS } from "~/features/songs/songs";
import { Limited, Original, Repertoire, TakanekoVersion, Unperformed } from "~/features/songs/tags";
import { formatTitle } from "~/utils/htmlHeader";
import { Thumbnail } from "./thumbnail";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("楽曲") },
    {
      name: "description",
      content:
        "HoneyWorks サウンドプロデュース 高嶺のなでしこの全楽曲一覧です。オリジナル曲 / ハニワ曲のたかねこ ver. / 特定ライブ限定曲 / 未披露曲まで完全掲載。各楽曲の詳細とライブ披露履歴をチェック！",
    },
  ];
};

export default function Component() {
  const selectableTags = [Original, TakanekoVersion, Repertoire, Limited, Unperformed];

  const tabs = [
    { key: "all", link: "./", name: "すべて", content: ALL_SONGS },
    ...selectableTags.map((tag) => ({
      key: tag.key,
      name: tag.name,
      content: ALL_SONGS.filter((track) => track.tags?.some((t) => t.key === tag.key)),
    })),
  ];

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox()}>
        <h1 className={pageHeading("px-4")}>楽曲</h1>

        <p className="mt-8 px-4">楽曲の詳細と各楽曲がどのライブで披露されたのかを確認できます。</p>

        <TabGroup className="mt-2">
          <TabList as="ul" className="flex items-center gap-2 overflow-x-scroll px-4 py-4">
            {tabs.map((tab) => (
              <li key={tab.key} className="flex-none">
                <Tab
                  as="button"
                  className="data-selected:bg-nadeshiko-800 rounded-lg bg-gray-100 px-4 py-2 outline-none data-selected:text-white"
                >
                  <span className="text-center text-sm select-none">{tab.name}</span>
                </Tab>
              </li>
            ))}
          </TabList>

          <TabPanels>
            {tabs.map((tab) => (
              <TabPanel key={tab.key} tabIndex={-1}>
                <ul className="mt-2 grid grid-cols-2 justify-center gap-x-4 gap-y-8 px-4 sm:grid-cols-3 lg:grid-cols-5">
                  {tab.content.map((track) => (
                    <li key={track.slug}>
                      <div className="w-full">
                        <Link
                          to={`/songs/${track.slug}`}
                          className="block w-full overflow-hidden rounded-lg shadow-lg"
                        >
                          <Thumbnail track={track} />
                        </Link>
                        <div className="mt-2 text-sm">
                          <Link to={`/songs/${track.slug}`}>{track.name}</Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </section>
    </div>
  );
}
