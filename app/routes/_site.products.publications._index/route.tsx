import { Link, MetaFunction } from "react-router";
import { pageBox, pageHeading } from "~/components/styles.ts";
import { PUBLICATIONS } from "~/features/publications/publications.ts";
import { NaiveDate } from "~/utils/datetime/NaiveDate.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { PublicationCard } from "./PublicationCard.tsx";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("書籍・雑誌") },
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
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>書籍・雑誌</h1>

        <ul className="mt-8 grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {PUBLICATIONS.map((publication) => (
            <li key={publication.slug}>
              <Link to={`/products/${publication.slug}`}>
                <PublicationCard
                  name={publication.name}
                  date={NaiveDate.parseUnsafe(publication.date)}
                  image={publication.coverImages[0]?.path}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
