import { MetaFunction } from "@remix-run/react";
import { useState } from "react";
import { BsCheck2, BsCopy } from "react-icons/bs";
import { DOMAIN } from "~/constants";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("カレンダーの登録方法") },
    {
      name: "description",
      content: "高嶺のなでしこの出演予定やリリース情報をカレンダーに登録する方法を説明します。",
    },
  ];
};

export default function Index() {
  const url = `https://${DOMAIN}/calendar.ics`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto">
      <section className="my-12 px-4">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">カレンダーの登録方法</h1>

        <div className="space-y-4">
          <p>カレンダーの登録には次の URL を使用します。</p>

          <p className="flex items-center justify-between gap-2 bg-gray-100 px-4 py-2 font-mono text-gray-800">
            <span className="flex-1 break-words break-all">{url}</span>
            <button className="h-9 w-9 flex-none" onClick={copyToClipboard}>
              {copied ? (
                <BsCheck2 className="inline text-green-700" />
              ) : (
                <BsCopy className="inline text-gray-500" />
              )}
            </button>
          </p>
        </div>

        <section className="mt-12">
          <h2 className="mb-8 text-2xl text-gray-800">iPhone で登録する方法</h2>

          <div className="space-y-4">
            <p>下記のリンク先を参考に「照会カレンダー」として追加してください。</p>
            <p>
              <a
                className="text-nadeshiko-800"
                href="https://support.apple.com/ja-jp/guide/iphone/iph3d1110d4/ios"
                target="_blank"
                rel="noreferrer"
              >
                iPhoneで複数のカレンダーを設定する - Apple サポート (日本)
              </a>
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-8 text-2xl text-gray-800">Google カレンダーで登録する方法</h2>

          <div className="space-y-4">
            <p>
              下記のリンク先の「リンクを使用して一般公開カレンダーを追加する」を参考に登録してください。
            </p>
            <p>
              <a
                className="text-nadeshiko-800"
                href="https://support.google.com/calendar/answer/37100"
                target="_blank"
                rel="noreferrer"
              >
                他のユーザーの Google カレンダーに登録する - パソコン - Google カレンダー ヘルプ
              </a>
            </p>
          </div>
        </section>
      </section>
    </div>
  );
}
