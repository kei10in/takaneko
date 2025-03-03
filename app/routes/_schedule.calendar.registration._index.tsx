import { Link, MetaFunction } from "react-router";
import { BsBoxArrowUp, BsCalendar3 } from "react-icons/bs";
import { CopyButton } from "~/components/CopyButton";
import { DOMAIN } from "~/constants";
import { shouldUseWebShareApi } from "~/utils/browser/webShareApi";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("アプリに登録") },
    {
      name: "description",
      content: "高嶺のなでしこの出演予定やリリース情報をカレンダーに登録します。",
    },
  ];
};

export default function Index() {
  const domain = DOMAIN;
  const cals = [
    {
      name: "すべてのたかねこの予定",
      url: `${domain}/calendar.ics`,
      description: "すべての高嶺のなでしこの予定をひとつのカレンダーにまとめました。",
    },
    {
      name: "たかねこに会える予定",
      url: `${domain}/calendar-meets.ics`,
      description: "ライブやリリースイベントなど高嶺のなでしこに会えるイベントの予定です。",
    },
    {
      name: "たかねこの供給",
      url: `${domain}/calendar-updates.ics`,
      description: "テレビの出演や発売日などの予定です。",
    },
  ];

  const showShareButton = shouldUseWebShareApi();

  return (
    <div className="container mx-auto">
      <section className="my-12 px-4 text-gray-800">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">アプリに登録</h1>

        {cals.map((cal, i) => (
          <section key={i} className="my-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-500">{cal.name}</h2>

            <div className="space-y-4">
              <p>{cal.description}</p>

              <Link
                className="block w-fit rounded-md border border-nadeshiko-500 bg-nadeshiko-100 px-3 py-1"
                to={`webcal://${cal.url}`}
                discover="none"
              >
                <div className="flex items-center gap-2 text-nadeshiko-800">
                  <span>
                    <BsCalendar3 className="h-5 w-5" />
                  </span>
                  <span>iPhone のカレンダーに登録</span>
                </div>
              </Link>

              <Link
                className="block w-fit rounded-md border border-nadeshiko-500 bg-nadeshiko-100 px-3 py-1"
                to={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(`webcal://${cal.url}`)}`}
                discover="none"
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2 text-nadeshiko-800">
                  <span>
                    <BsCalendar3 className="h-5 w-5" />
                  </span>
                  <span>Google カレンダーに登録</span>
                </div>
              </Link>

              <div className="space-y-2">
                <p className="font-bold">カレンダーの URL:</p>
                <div className="mt-2 items-center gap-2 space-y-1 text-gray-600 lg:flex lg:space-y-0">
                  <div className="h-8 flex-1">
                    <input
                      className="h-full w-full rounded-md border px-2 font-mono text-sm"
                      readOnly
                      value={cal.url}
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
                            title: "すべてのたかねこの予定",
                            text: "",
                            url: cal.url,
                          });
                        }}
                      >
                        <BsBoxArrowUp className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                    <CopyButton className="flex-none" data={cal.url} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="mb-8 text-2xl font-bold text-gray-500">URL でカレンダーに登録する</h2>

          <div className="space-y-4">
            <p>カレンダーへの登録方法は、使っているカレンダーアプリの使い方を見てください。</p>
            <ul className="list-disc pl-8 marker:text-gray-300">
              <li>
                <Link
                  className="text-nadeshiko-800"
                  to="https://support.google.com/calendar/answer/37100"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google カレンダー
                </Link>{" "}
                - Google カレンダーのウェブサイトからカレンダーを追加します。
              </li>
              <li>
                <Link
                  className="text-nadeshiko-800"
                  to="https://support.timetreeapp.com/hc/ja/articles/360000639682-他のカレンダーを表示したい-Google-カレンダーなど"
                  target="_blank"
                  rel="noreferrer"
                >
                  TimeTree
                </Link>{" "}
                - iPhone のカレンダーや Google カレンダーに追加したあとで TimeTree
                アプリ上で操作します。
              </li>
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
}
