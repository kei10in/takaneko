import {
  unstable_defineClientLoader as defineClientLoader,
  Link,
  MetaFunction,
} from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { loadEventsInDay } from "~/features/events/events";
import { LiveGoods } from "~/features/products/liveGoods";
import { MINI_PHOTO_CARDS, PHOTOS } from "~/features/products/photos";
import { getActiveDateInJapan } from "~/utils/japanTime";
import Content from "./memo.mdx";

export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_TITLE} - 高嶺のなでしこのファンサイト` },
    {
      name: "description",
      content:
        "高嶺のなでしこの非公式ファンサイト。トレード画像をつくるやつでは、これまで発売された生写真やミニフォトカードなどのランダムグッズのトレード用の画像を作成できます。スケジュールでは、高嶺のなでしこのライブやイベント、テレビ出演などのスケジュールを確認することができます。",
    },
  ];
};

export const clientLoader = defineClientLoader(async (_args) => {
  const date = getActiveDateInJapan(new Date());
  const events = loadEventsInDay(date);
  return { date, events };
});

export default function Index() {
  return (
    <div className="container mx-auto text-gray-600">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">グッズ</h1>
        <div className="rounded-lg border border-yellow-500 bg-yellow-50 p-4">
          <p className="mb-2 font-bold">🚧工事中🚧</p>
          <p>たかねこのグッズのページは現在作成中です。</p>
          <p>
            「
            <Link className="text-nadeshiko-800" to="#organizing">
              整理中
            </Link>
            」のところに記載のないグッズをご存じの場合は{" "}
            <Link className="text-nadeshiko-800" to="https://x.com/takanekofan">
              @takanekofan
            </Link>{" "}
            までご連絡いただけると助かります。
          </p>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl">ライブグッズ</h2>
          {LiveGoods.map((live) => {
            return (
              <section key={live.id}>
                <h3 className="text-xl">{live.name}</h3>
                <div className="py-4 md:grid md:grid-cols-2 md:gap-4">
                  <figure>
                    <img src={live.image.path} alt={live.name} />
                  </figure>
                  <div className="pt-4">
                    {live.goods.map((goods) => (
                      <section key={goods.type}>
                        <h4>{goods.type}</h4>
                        <ul className="list-inside list-disc pl-2 marker:text-gray-300">
                          {goods.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl">生写真</h2>
          <ul className="grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {PHOTOS.map((photo) => (
              <li key={photo.id} className="overflow-hidden">
                <Link className="overflow-hidden bg-white" to={`/products/${photo.id}`}>
                  <div className="flex-0 aspect-square w-full bg-gray-50">
                    <img
                      src={photo.url}
                      alt={photo.series ?? photo.id}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <div className="space-y-1 px-1 py-2">
                    <div className="w-fit border border-nadeshiko-800 px-2 py-px text-sm leading-none text-nadeshiko-800">
                      {photo.year}
                    </div>
                    <p className="text-sm">{photo.name}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-2xl">ミニフォトカード</h2>
          <ul className="grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {MINI_PHOTO_CARDS.map((photo) => (
              <li key={photo.id} className="overflow-hidden">
                <Link className="overflow-hidden bg-white" to={`/products/${photo.id}`}>
                  <div className="flex-0 aspect-square w-full bg-gray-50">
                    <img
                      src={photo.url}
                      alt={photo.series ?? photo.id}
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                  <div className="space-y-1 px-1 py-2">
                    <div className="w-fit border border-nadeshiko-800 px-2 py-px text-sm leading-none text-nadeshiko-800">
                      {photo.year}
                    </div>
                    <p className="text-sm">{photo.name}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 id="organizing" className="text-2xl">
            整理中
          </h2>
          <article className="markdown">
            <Content />
          </article>
        </section>
      </section>
    </div>
  );
}
