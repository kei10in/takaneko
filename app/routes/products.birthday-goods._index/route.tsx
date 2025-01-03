import { Link, MetaFunction } from "@remix-run/react";
import { ImageSlide } from "~/components/ImageSlide";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";

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

export default function Index() {
  return (
    <div className="container mx-auto text-gray-600">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">誕生日記念グッズ</h1>
        <div className="my-12 rounded-lg border border-yellow-500 bg-yellow-50 p-4">
          <p>
            このページに記載のないものは「
            <Link className="text-nadeshiko-800" to="/memo">
              メモ
            </Link>
            」ページに記載されているかもしれません。
          </p>
        </div>

        <div className="space-y-8">
          {BirthdayGoods.map((bg) => {
            return (
              <section key={bg.slug}>
                <h3 className="text-xl">{bg.name}</h3>
                <div className="py-4 md:grid md:grid-cols-2 md:gap-4">
                  <ImageSlide images={bg.images.map((img) => ({ src: img.path, alt: bg.name }))} />
                  <div className="space-y-4 pt-4 md:pt-0">
                    <ul className="list-outside list-disc pl-6 marker:text-gray-300">
                      {bg.lineup.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
