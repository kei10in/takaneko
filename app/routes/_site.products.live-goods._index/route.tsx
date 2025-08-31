import { Link, MetaFunction } from "react-router";
import { ImageSlide } from "~/components/ImageSlide";
import { pageHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { LiveGoods } from "~/features/products/liveGoods";

export const meta: MetaFunction = () => {
  return [
    { title: `ライブ グッズ - ${SITE_TITLE}` },
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
      <section className="px-4 py-12">
        <h1 className={pageHeading()}>ライブ グッズ</h1>

        <div className="mt-8 space-y-8">
          {LiveGoods.map((live) => {
            return (
              <section key={live.slug}>
                <h3 className="text-xl">{live.name}</h3>
                <div className="py-4 md:grid md:grid-cols-2 md:gap-4">
                  <ImageSlide
                    images={live.images.map((img) => ({ src: img.path, alt: live.name }))}
                  />
                  <div className="space-y-4 pt-4 md:pt-0">
                    {live.goods.map((goods) => (
                      <section key={goods.type}>
                        <h4>{goods.type}</h4>
                        <ul className="list-outside list-disc pl-6 marker:text-gray-300">
                          {goods.lineup.map((item) => (
                            <li key={typeof item === "string" ? item : item.slug}>
                              {typeof item === "string" ? (
                                item
                              ) : (
                                <Link className="text-nadeshiko-800" to={`/products/${item.slug}`}>
                                  {item.name}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
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
