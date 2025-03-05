import { Dialog, DialogPanel } from "@headlessui/react";
import { clsx } from "clsx";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  images: { path: string; ref: string; alt: string }[];
}

export const ImageSlide2: React.FC<Props> = (props: Props) => {
  const { images } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const close = () => navigate(".", { replace: true, preventScrollReset: true });

  return (
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
              alt={image.alt}
              className="aspect-square w-72 object-contain lg:w-96"
            />
          </Link>

          <Dialog open={location.hash == `#photo-${i}`} onClose={close} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4">
              <DialogPanel className="max-w-lg">
                <img src={image.path} alt={image.alt} className="block w-full object-contain" />
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
  );
};
