import { Link } from "@remix-run/react";
import React from "react";
import { ImageSlide } from "~/components/ImageSlide";
import { Publication } from "~/features/products/product";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { findMemberDescription } from "../members/members";

interface Props {
  product: Publication;
}

export default function PublicationProduct(props: Props) {
  const { product } = props;

  const keyValues = [
    { key: "発売日", value: displayDate(NaiveDate.parseUnsafe(product.date)) },
    { key: "出版社", value: product.publisher },
    { key: "定価", value: `${product.listPrice?.toLocaleString()} 円` },
  ];

  return (
    <div className="mx-auto pb-12 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-4 lg:py-12">
      <ImageSlide
        images={product.coverImages.map((img) => ({ src: img.path, alt: product.name }))}
      />

      <section className="mt-4 space-y-8 p-4">
        <h1 className="text-3xl font-semibold text-nadeshiko-800">{product.name}</h1>

        <dl className="mt-8 grid grid-cols-3 gap-2">
          {keyValues.map(({ key, value }) => (
            <React.Fragment key={key}>
              <dt className="text-gray-400">{key}</dt>
              <dd className="col-span-2">{value}</dd>
            </React.Fragment>
          ))}
        </dl>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-500">掲載メンバー</h2>
          <ul>
            {product.featuredMembers.map((member) => {
              const m = findMemberDescription(member);

              return (
                <li key={m.slug}>
                  <Link className="block" to={`/members/${m.slug}`}>
                    <div className="flex items-center gap-2 p-1">
                      <img
                        src={m.idPhoto.path}
                        alt={m.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <p className="text-gray-600">{m.name}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </section>
    </div>
  );
}
