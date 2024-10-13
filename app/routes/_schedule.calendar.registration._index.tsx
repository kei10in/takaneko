import { Link, MetaFunction } from "@remix-run/react";
import { useState } from "react";
import { BsCalendar3, BsCheck2, BsCopy } from "react-icons/bs";
import { DOMAIN } from "~/constants";
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
    { name: "すべてのたかねこの予定", url: `${domain}/calendar.ics` },
    { name: "たかねこに会える予定", url: `${domain}/calendar-meets.ics` },
    { name: "たかねこの供給", url: `${domain}/calendar-updates.ics` },
  ];

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto">
      <section className="my-12 px-4">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">アプリに登録</h1>

        <div className="space-y-4">
          <p>たかねこの予定をカレンダー アプリに登録できます。</p>
          <p>3 種類の予定から選んで登録してください。</p>

          <ul className="list-disc pl-8 marker:text-gray-300">
            <li>
              <strong>すべてのたかねこの予定</strong> -
              すべての高嶺のなでしこの予定をひとつのカレンダーにまとめました。
            </li>
            <li>
              <strong>たかねこに会える予定</strong> -
              ライブやリリースイベントなど高嶺のなでしこに会えるイベントの予定です。
            </li>
            <li>
              <strong>たかねこの供給</strong> - テレビの出演や発売日などの予定です
            </li>
          </ul>
        </div>

        <section className="mt-12">
          <h2 className="mb-8 text-2xl text-gray-800">iPhone のカレンダーに登録する</h2>

          <div className="space-y-4">
            <p>次のボタンを押して登録します。カレンダー アプリが開きます。</p>

            {cals.map((cal, i) => (
              <Link
                key={i}
                className="block w-fit rounded-md border border-nadeshiko-500 bg-nadeshiko-100 px-3 py-1"
                to={`webcal://${cal.url}`}
                discover="none"
              >
                <div className="flex items-center gap-2 text-nadeshiko-800">
                  <span>
                    <BsCalendar3 className="h-5 w-5" />
                  </span>
                  <span>{cal.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-8 text-2xl text-gray-800">Google カレンダーに登録する</h2>

          <div className="space-y-4">
            <p>
              次のボタンを押して登録します。スマートフォンでも Google カレンダーの PC
              サイトを開いてカレンダー登録ができます。
            </p>

            {cals.map((cal, i) => (
              <Link
                key={i}
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
                  <span>{cal.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-8 text-2xl text-gray-800">URL でカレンダーに登録する</h2>

          <div className="space-y-4">
            <p>次の URL を使います。</p>

            {cals.map((cal, i) => (
              <div key={i} className="space-y-2">
                <p>{cal.name}:</p>
                <p className="flex items-center justify-between gap-2 bg-gray-100 px-4 py-2 font-mono text-gray-800">
                  <span className="flex-1 break-words break-all">{cal.url}</span>
                  <button className="h-9 w-9 flex-none" onClick={() => copyToClipboard(cal.url)}>
                    {copied ? (
                      <BsCheck2 className="inline text-green-700" />
                    ) : (
                      <BsCopy className="inline text-gray-500" />
                    )}
                  </button>
                </p>
              </div>
            ))}

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
