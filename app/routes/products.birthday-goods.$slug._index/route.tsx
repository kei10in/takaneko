import { Dialog, DialogPanel } from "@headlessui/react";
import { Link, MetaFunction, useLocation, useNavigate, useParams } from "@remix-run/react";
import clsx from "clsx";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";
import { BirthdayGoodsCollection } from "~/features/products/product";

export const meta: MetaFunction = ({ params }) => {
  const slug = params.slug;
  const collection = findBirthdayGoods(slug);

  return [
    { title: `${collection.name} - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのグッズの詳細を紹介します。",
    },
  ];
};

const findBirthdayGoods = (slug: string | undefined): BirthdayGoodsCollection => {
  const v = BirthdayGoods.find((p) => p.slug === slug);
  if (v == undefined) {
    throw new Response("", { status: 404 });
  }

  return v;
};

export default function Index() {
  const params = useParams<"slug">();
  const collection = findBirthdayGoods(params.slug);

  const images = [...collection.images, ...collection.lineup.flatMap((item) => item.images ?? [])];

  const location = useLocation();
  const navigate = useNavigate();

  const close = () => navigate(".", { replace: true, preventScrollReset: true });

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height))]">
      <section className="pb-12 pt-8">
        <h1 className="my-4 px-4 text-3xl font-semibold text-gray-600">{collection.name}</h1>

        <div className="mt-8">
          <Swiper
            className={clsx(
              "[&_.swiper-button-next]:text-nadeshiko-800",
              "[&_.swiper-button-prev]:text-nadeshiko-800",
            )}
            loop={true}
            navigation={true}
            modules={[Navigation]}
          >
            {images.map((image, i) => (
              <SwiperSlide className="w-full bg-gray-50" key={image.path}>
                <Link
                  className="mx-auto block w-fit outline-none"
                  to={`#photo-${i}`}
                  replace={true}
                  preventScrollReset={true}
                >
                  <img
                    src={image.path}
                    alt={collection.name}
                    className="aspect-square w-72 object-contain lg:w-96"
                  />
                </Link>

                <Dialog
                  open={location.hash == `#photo-${i}`}
                  onClose={close}
                  className="relative z-50"
                >
                  <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4">
                    <DialogPanel className="max-w-lg">
                      <img
                        src={image.path}
                        alt={collection.name}
                        className="block w-full object-contain"
                      />
                      <p className="text-right text-xs font-semibold text-white/80">
                        <Link
                          to={image.ref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1"
                        >
                          <span>画像の引用元</span>
                          <BsBoxArrowUpRight />
                        </Link>
                      </p>
                    </DialogPanel>
                  </div>
                </Dialog>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <section className="mt-12 px-4">
          <h2 className="text-2xl font-semibold text-gray-500">ラインナップ</h2>
          <ul className="mt-8 space-y-8">
            {collection.lineup.map((item, i) => {
              return (
                <li key={i} className="w-full">
                  <p className="text-lg font-semibold text-gray-400">{item.name}</p>
                  <p className="mt-1 text-sm">{item.description}</p>
                </li>
              );
            })}
          </ul>
        </section>
      </section>
    </div>
  );
}
