import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { BsBroadcastPin, BsStopwatch } from "react-icons/bs";
import { Link, MetaFunction } from "react-router";
import { DOMAIN, SITE_TITLE } from "~/constants";
import { RadioAppearances } from "./content";

export const meta: MetaFunction = () => {
  const title = `「この夏、好きになっちゃえばいいのに。」ラジオ出演 - ${SITE_TITLE}`;
  const description =
    "高嶺のなでしこ (たかねこ) が 7/10, 7/11 に出演する「この夏、好きになっちゃえばいいのに。」に関するラジオ番組をまとめたページです。出演時間や radiko へのリンクをまとめています。";
  const url = `https://${DOMAIN}/`;

  return [
    { title },
    { name: "description", content: description },

    { property: "og:site_name", content: SITE_TITLE },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: `${url}takaneko/site-image.webp` },
    { property: "og:url", content: `${url}special/2025-summer-radio` },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "ja_JP" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@takanekofan" },
    { name: "twitter:creator", content: "@takanekofan" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${url}icon-512.png` },
  ];
};

export default function Index() {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const days = [
    {
      key: "day1",
      name: "2025 年 7 月 10 日 (木)",
      items: RadioAppearances.filter((e) => e.meta.date.toString() === "2025-07-10").toSorted(
        (a, b) => a.meta.start?.localeCompare(b.meta.start ?? "00:00") ?? 0,
      ),
    },
    {
      key: "day2",
      name: "2025 年 7 月 11 日 (金)",
      items: RadioAppearances.filter((e) => e.meta.date.toString() === "2025-07-11").toSorted(
        (a, b) => a.meta.start?.localeCompare(b.meta.start ?? "00:00") ?? 0,
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <section className="mt-12">
        <h2 id="organizing" className="text-nadeshiko-800 my-8 text-4xl leading-tight">
          7/10、7/11 ラジオ出演 まとめ
        </h2>
        <div className="my-8 space-y-2">
          <p>7/10、7/11 に高嶺のなでしこが全国のテレビやラジオに生出演します。</p>
          <p>
            <Link
              to="https://x.com/takanenofficial/status/1942871358289195370"
              target="_blank"
              rel="noreferrer"
              className="text-nadeshiko-800 font-semibold"
            >
              高嶺のなでしこ公式 X
            </Link>{" "}
            のポストを元に、タイムテーブルと radiko の番組を直接開くリンクをまとめました。
          </p>
          <p>タップすると radiko が開きます。</p>
          <p>時間は出演時間の目安です。</p>
        </div>
        {days.map((day) => {
          return (
            <section key={day.key} className="mb-8">
              <h3 className="my-2 text-lg font-semibold text-gray-500">{day.name}</h3>
              <ul className="space-y-2">
                {day.items.map((e) => {
                  const [startHour, startMinute] = (e.meta.start ?? "00:00").split(":");
                  const startTime = Date.UTC(
                    e.meta.date.year,
                    e.meta.date.month - 1,
                    e.meta.date.day,
                    startHour ? parseInt(startHour) - 9 : 0,
                    startMinute ? parseInt(startMinute) : 0,
                  );

                  const withIn30Minutes =
                    currentTime <= startTime && startTime <= currentTime + 30 * 60 * 1000;
                  const nowPlaying =
                    startTime <= currentTime && currentTime < startTime + 30 * 60 * 1000;
                  const isPast = startTime < currentTime && !nowPlaying;

                  return (
                    <li key={e.meta.summary}>
                      <Link
                        className={clsx(
                          "block rounded-lg bg-gray-50 px-3 py-2",
                          isPast && "opacity-50",
                          nowPlaying && "bg-nadeshiko-200",
                          withIn30Minutes && "bg-gray-100",
                        )}
                        to={e.radiko}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="flex items-stretch gap-3">
                          <div className="w-11 flex-none">
                            <p className={clsx(nowPlaying && "font-semibold")}>{e.meta.start}</p>
                            {nowPlaying && (
                              <div>
                                <BsBroadcastPin className="mx-auto" />
                              </div>
                            )}
                            {withIn30Minutes && (
                              <div>
                                <BsStopwatch className="mx-auto" />
                              </div>
                            )}
                          </div>
                          <div
                            className={clsx(
                              "w-1 flex-none rounded-full",
                              nowPlaying && "bg-nadeshiko-900",
                              isPast && "bg-gray-300",
                              !isPast && !nowPlaying && "bg-nadeshiko-400",
                              withIn30Minutes && "bg-nadeshiko-700",
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p className={clsx("line-clamp-2", nowPlaying && "font-semibold")}>
                              {e.meta.summary}
                            </p>
                            <p
                              className={clsx(
                                "text-sm",
                                isPast && "text-gray-500",
                                !isPast && "text-nadeshiko-800",
                              )}
                            >
                              {e.meta.present?.join("、")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </section>
    </div>
  );
}
