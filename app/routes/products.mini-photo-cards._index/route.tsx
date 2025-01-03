import { Link, MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MINI_PHOTO_CARDS } from "~/features/products/photos";
import { ProductCard } from "../../components/ProductCard";

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
        <h1 className="my-4 text-3xl font-semibold text-gray-600">ミニフォトカード</h1>

        <ul className="grid grid-cols-2 place-content-center gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {MINI_PHOTO_CARDS.map((photo) => (
            <li key={photo.slug}>
              <Link to={`/products/${photo.slug}`}>
                <ProductCard {...photo} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
