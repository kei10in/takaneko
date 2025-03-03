import { Link, MetaFunction } from "react-router";
import { SITE_TITLE } from "~/constants";
import { PHOTOS } from "~/features/products/photos";
import { ProductCard } from "../../components/ProductCard";

export const meta: MetaFunction = () => {
  return [
    { title: `生写真 - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこの生写真の一覧です。" +
        "生写真はワンマンライブやツアー、公式ショップで販売されます。" +
        "メンバー直筆サイン入り生写真が当たる可能性があります。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto text-gray-600">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">生写真</h1>

        <ul className="grid grid-cols-2 place-content-center gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {PHOTOS.map((photo) => (
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
