import React from "react";
import { Link } from "react-router";
import { ImageSlide } from "~/components/ImageSlide";
import { pageColumnBox, pageHeading } from "~/components/styles";
import { Publication } from "~/features/products/product";
import { displayDate } from "~/utils/dateDisplay";
import { NaiveDate } from "~/utils/datetime/NaiveDate";
import { findMemberDescription } from "../../features/profile/members";

interface Props {
  product: Publication;
}

const price = (product: Publication) => {
  const TAX_RATE = 0.1;

  const p = (() => {
    if (product.listPrice != undefined && product.priceWithTax != undefined) {
      return [product.listPrice, product.priceWithTax];
    } else if (product.listPrice != undefined) {
      return [product.listPrice, Math.round(product.listPrice * (1 + TAX_RATE))];
    } else if (product.priceWithTax != undefined) {
      return [Math.round(product.priceWithTax / (1 + TAX_RATE)), product.priceWithTax];
    } else {
      return undefined;
    }
  })();

  if (p == undefined) {
    return "不明";
  }

  return `税込 ${p[1].toLocaleString()} 円 (本体 ${p[0].toLocaleString()} 円)`;
};

export default function PublicationProduct(props: Props) {
  const { product } = props;

  const keyValues = [
    { key: "発売日", value: displayDate(NaiveDate.parseUnsafe(product.date)) },
    { key: "出版社", value: product.publisher },
    { key: "価格", value: price(product) },
  ];

  return (
    <div className="mx-auto pb-12 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-4 lg:py-12">
      <ImageSlide
        images={product.coverImages.map((img) => ({ src: img.path, alt: product.name }))}
      />

      <section className={pageColumnBox("space-y-8 px-4")}>
        <h1 className={pageHeading()}>
          {product.url == undefined ? (
            product.name
          ) : (
            <Link to={product.url} target="_blank" rel="noreferrer">
              {product.name}
            </Link>
          )}
        </h1>

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
          <ul className="flex flex-wrap gap-2">
            {product.featuredMembers.map((member) => {
              const m = findMemberDescription(member);

              return (
                <li key={m.slug} className="w-40 flex-none">
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

        {product.links != undefined && product.links.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-500">リンク</h2>
            <ul className="list-disc pl-6">
              {product.links?.map((link, i) => {
                return (
                  <li key={i} className="flex-none marker:text-gray-400">
                    <Link
                      className="text-nadeshiko-800 block"
                      to={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </section>
    </div>
  );
}
