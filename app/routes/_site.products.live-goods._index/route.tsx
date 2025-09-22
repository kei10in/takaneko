import { clsx } from "clsx";
import { Link, MetaFunction } from "react-router";
import { SquareCard } from "~/components/SquareCard";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { LiveGoods } from "~/features/products/liveGoods";
import { thumbnailSrcSet } from "~/utils/fileConventions";

export const meta: MetaFunction = () => {
  return [
    { title: `ライブ・イベント グッズ - ${SITE_TITLE}` },
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
      <section className={pageBox()}>
        <h1 className={pageHeading("my-4 px-4")}>ライブ・イベント グッズ</h1>

        <section className="@container mt-8 px-4">
          <h2 className={sectionHeading()}>ライブ・イベント グッズ一覧</h2>

          <div
            className={clsx(
              "mt-6 grid grid-cols-2 gap-x-2 gap-y-8",
              "@md:grid-cols-3 @xl:grid-cols-4 @3xl:grid-cols-5 @5xl:grid-cols-6",
            )}
          >
            {LiveGoods.map((lg) => {
              const thumbs = thumbnailSrcSet(lg.images[0].path);

              return (
                <Link key={lg.slug} className="block" to={`/products/live-goods/${lg.slug}`}>
                  <SquareCard
                    image={thumbs.src}
                    imageSet={thumbs.srcset}
                    title={lg.name}
                    description={""}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </div>
  );
}
