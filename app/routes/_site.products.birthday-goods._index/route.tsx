import { MetaFunction } from "react-router";
import { ImageSlide } from "~/components/ImageSlide";
import { SITE_TITLE } from "~/constants";
import { BirthdayGoods } from "~/features/products/birthdayGoods";

export const meta: MetaFunction = () => {
  return [
    { title: `誕生日記念グッズ - ${SITE_TITLE}` },
    {
      name: "description",
      content:
        "高嶺のなでしこのメンバーの誕生部記念グッズの一覧です。" +
        "高嶺のなでしこ 2 周年以降、各メンバーの誕生日にそれぞれのメンバーが企画した誕生日記念グッズが販売されています。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto text-gray-600">
      <section className="px-4 py-8">
        <h1 className="my-4 text-3xl font-semibold text-gray-600">誕生日記念グッズ</h1>

        <div className="space-y-8">
          {BirthdayGoods.map((bg) => {
            return (
              <section key={bg.slug}>
                <h3 className="text-xl">{bg.name}</h3>
                <div className="py-4 md:grid md:grid-cols-2 md:gap-4">
                  <ImageSlide images={bg.images.map((img) => ({ src: img.path, alt: bg.name }))} />
                  <div className="space-y-4 pt-4 md:pt-0">
                    <ul className="list-outside list-disc pl-6 marker:text-gray-300">
                      {bg.lineup.map((item) => (
                        <li key={item.name}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
