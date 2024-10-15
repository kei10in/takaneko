import { ImageSlide } from "~/components/ImageSlide";
import { PublicationDescription } from "~/features/products/product";

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
        <h1 className="my-2 text-3xl font-semibold text-nadeshiko-800 lg:mt-12">{product.name}</h1>
        <div>掲載メンバー</div>
        <ul className="list-disc pl-6 marker:text-gray-300">
          {product.featured_members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
