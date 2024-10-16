import { Link } from "@remix-run/react";
import { ImageSlide } from "~/components/ImageSlide";
import { PublicationDescription } from "~/features/products/product";
import { findMemberDescription } from "../members/members";

interface Props {
  product: PublicationDescription;
}

export default function PublicationProduct(props: Props) {
  const { product } = props;

  return (
    <div className="mx-auto pb-12 lg:grid lg:max-w-5xl lg:grid-cols-2 lg:gap-4 lg:py-12">
      <ImageSlide
        images={product.cover_images.map((img) => ({ src: img.path, alt: product.name }))}
      />

      <section className="p-4">
        <h1 className="my-4 text-3xl font-semibold text-nadeshiko-800">{product.name}</h1>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-500">掲載メンバー</h2>
          <ul>
            {product.featured_members.map((member) => {
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
