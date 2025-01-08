import { Dialog, DialogPanel } from "@headlessui/react";
import { Link, MetaFunction, useLocation, useNavigate, useParams } from "@remix-run/react";
import clsx from "clsx";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_TITLE } from "~/constants";
import { LiveGoods } from "~/features/products/liveGoods";
import { LiveGoodsCollection } from "~/features/products/product";

export const meta: MetaFunction = ({ params }) => {
  const slug = params.slug;
  const live = findLive(slug);

  return [
    { title: `${live.name} ライブグッズ - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのグッズの詳細を紹介します。",
    },
  ];
};

const findLive = (slug: string | undefined): LiveGoodsCollection => {
  const v = LiveGoods.find((p) => p.slug === slug);
  if (v == undefined) {
    throw new Response("", { status: 404 });
  }

  return v;
};

export default function Index() {
  const params = useParams<"slug">();
  const live = findLive(params.slug);
  const images = live.images;

  const location = useLocation();
  const navigate = useNavigate();
  const close = () => navigate(".", { replace: true, preventScrollReset: true });

  return (
    <div className="container mx-auto min-h-[calc(100svh-var(--header-height))]">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">{live.name}</h1>

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
                    alt={live.name}
                    className="aspect-[3/4] w-72 object-contain lg:w-96"
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
                        alt={live.name}
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

        <div className="mt-12">
          {live.goods.map((goods) => (
            <section key={goods.type} className="my-4">
              <h2 className="text-xl font-semibold leading-tight text-gray-500">{goods.type}</h2>

              <ul className="mt-4 list-outside list-disc pl-6 marker:text-gray-300">
                {goods.lineup.map((item) => (
                  <li key={typeof item === "string" ? item : item.slug}>
                    {typeof item === "string" ? (
                      item
                    ) : (
                      <Link className="text-nadeshiko-800" to={`/products/${item.slug}`}>
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
