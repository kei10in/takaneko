import { Link, MetaFunction } from "react-router";
import { SITE_TITLE } from "~/constants";
import { PUBLICATIONS } from "~/features/products/publications";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { thumbnailSrcSet } from "~/utils/fileConventions";
import { PublicationCard } from "./PublicationCard";

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
        <h1 className="my-4 text-3xl font-semibold text-gray-600">書籍・雑誌</h1>

        <ul className="grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {PUBLICATIONS.map((publication) => {
            const thumbs = thumbnailSrcSet(publication.coverImages[0].path);

            return (
              <li key={publication.slug}>
                <Link to={`/products/${publication.slug}`}>
                  <PublicationCard
                    name={publication.name}
                    date={NaiveDate.parseUnsafe(publication.date)}
                    image={thumbs.src}
                    imageSet={thumbs.srcset}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
