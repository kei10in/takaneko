import { Dialog, DialogPanel } from "@headlessui/react";
import { Link, MetaFunction, useLocation, useNavigate } from "react-router";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { NaoKizuki, SaaraHazuki } from "~/features/profile/members";
import { formatTitle } from "~/utils/htmlHeader";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle("ねこ撮写ルンです - 2024年") },
    {
      name: "description",
      content:
        "高嶺のなでしこ (たかねこ) の各メンバーが 2024年5月のキャンペーンにおいて「写ルンです」で撮影した写真のうち、城月菜央と葉月紗蘭のカメラを現像したものです。",
    },
  ];
};

const PICTURES = [
  {
    member: NaoKizuki,
    pictures: [
      "/takaneko/nekosatsu/nao-kizuki_001.webp",
      "/takaneko/nekosatsu/nao-kizuki_002.webp",
      "/takaneko/nekosatsu/nao-kizuki_003.webp",
      "/takaneko/nekosatsu/nao-kizuki_004.webp",
      "/takaneko/nekosatsu/nao-kizuki_005.webp",
      "/takaneko/nekosatsu/nao-kizuki_006.webp",
      "/takaneko/nekosatsu/nao-kizuki_007.webp",
      "/takaneko/nekosatsu/nao-kizuki_008.webp",
      "/takaneko/nekosatsu/nao-kizuki_009.webp",
      "/takaneko/nekosatsu/nao-kizuki_010.webp",
      "/takaneko/nekosatsu/nao-kizuki_011.webp",
      "/takaneko/nekosatsu/nao-kizuki_012.webp",
      "/takaneko/nekosatsu/nao-kizuki_013.webp",
      "/takaneko/nekosatsu/nao-kizuki_014.webp",
      "/takaneko/nekosatsu/nao-kizuki_015.webp",
      "/takaneko/nekosatsu/nao-kizuki_016.webp",
      "/takaneko/nekosatsu/nao-kizuki_017.webp",
      "/takaneko/nekosatsu/nao-kizuki_018.webp",
      "/takaneko/nekosatsu/nao-kizuki_019.webp",
      "/takaneko/nekosatsu/nao-kizuki_020.webp",
      "/takaneko/nekosatsu/nao-kizuki_021.webp",
      "/takaneko/nekosatsu/nao-kizuki_022.webp",
      "/takaneko/nekosatsu/nao-kizuki_023.webp",
      "/takaneko/nekosatsu/nao-kizuki_024.webp",
      "/takaneko/nekosatsu/nao-kizuki_025.webp",
      "/takaneko/nekosatsu/nao-kizuki_026.webp",
      "/takaneko/nekosatsu/nao-kizuki_027.webp",
    ],
  },
  {
    member: SaaraHazuki,
    pictures: [
      "/takaneko/nekosatsu/saara-hazuki_001.webp",
      "/takaneko/nekosatsu/saara-hazuki_002.webp",
      "/takaneko/nekosatsu/saara-hazuki_003.webp",
      "/takaneko/nekosatsu/saara-hazuki_004.webp",
      "/takaneko/nekosatsu/saara-hazuki_005.webp",
      "/takaneko/nekosatsu/saara-hazuki_006.webp",
      "/takaneko/nekosatsu/saara-hazuki_007.webp",
      "/takaneko/nekosatsu/saara-hazuki_008.webp",
      "/takaneko/nekosatsu/saara-hazuki_009.webp",
      "/takaneko/nekosatsu/saara-hazuki_010.webp",
      "/takaneko/nekosatsu/saara-hazuki_011.webp",
      "/takaneko/nekosatsu/saara-hazuki_012.webp",
      "/takaneko/nekosatsu/saara-hazuki_013.webp",
      "/takaneko/nekosatsu/saara-hazuki_014.webp",
      "/takaneko/nekosatsu/saara-hazuki_015.webp",
      "/takaneko/nekosatsu/saara-hazuki_016.webp",
      "/takaneko/nekosatsu/saara-hazuki_017.webp",
      "/takaneko/nekosatsu/saara-hazuki_018.webp",
      "/takaneko/nekosatsu/saara-hazuki_019.webp",
      "/takaneko/nekosatsu/saara-hazuki_020.webp",
      "/takaneko/nekosatsu/saara-hazuki_021.webp",
      "/takaneko/nekosatsu/saara-hazuki_022.webp",
      "/takaneko/nekosatsu/saara-hazuki_023.webp",
      "/takaneko/nekosatsu/saara-hazuki_024.webp",
      "/takaneko/nekosatsu/saara-hazuki_025.webp",
      "/takaneko/nekosatsu/saara-hazuki_026.webp",
      "/takaneko/nekosatsu/saara-hazuki_027.webp",
    ],
  },
];

export default function Component() {
  const location = useLocation();
  const navigate = useNavigate();
  const close = () => navigate(".", { replace: true, preventScrollReset: true });

  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox("px-4")}>
        <h1 className={pageHeading()}>ねこ撮写ルンです - 2024年</h1>

        <div className="mt-8 space-y-8">
          {PICTURES.map((pics) => (
            <section key={pics.member.slug}>
              <h2 className={sectionHeading()}>{pics.member.name}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8">
                {pics.pictures.map((pic, i) => (
                  <li key={pic} className="max-w-80 overflow-hidden rounded-lg shadow">
                    <Link to={`#${pics.member.slug}-${i}`} preventScrollReset={true}>
                      <img src={pic} alt={`${pics.member.name} ${i}`} />
                    </Link>

                    <Dialog
                      open={location.hash == `#${pics.member.slug}-${i}`}
                      onClose={close}
                      className="relative z-50"
                    >
                      <div className="fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4">
                        <DialogPanel className="w-full lg:max-w-[66%]">
                          <img
                            src={pic}
                            alt={`${pics.member.name} (${i})`}
                            className="block w-full object-contain"
                          />
                        </DialogPanel>
                      </div>
                    </Dialog>
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
