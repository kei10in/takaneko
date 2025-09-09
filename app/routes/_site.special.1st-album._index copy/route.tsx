import { MetaFunction } from "react-router";
import { pageBox, pageHeading, sectionHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";
import { ECSites } from "./content";

export const meta: MetaFunction = () => {
  const title = `1st アルバム「見上げるたびに、恋をする。」特典まとめ - ${SITE_TITLE}`;
  const description =
    "2025年12月17日発売予定の高嶺のなでしこ (たかねこ) 1st アルバム「見上げるたびに、恋をする。」の特典情報をまとめました。";

  return [{ title }, { name: "description", content: description }];
};

export default function Index() {
  return (
    <div className="container mx-auto max-w-3xl">
      <section className={pageBox()}>
        <h1 className={pageHeading()}>1st アルバム「見上げるたびに、恋をする。」特典まとめ</h1>

        <section className="mt-8 space-y-8">
          {ECSites.map((site) => (
            <section key={site.shopName}>
              <h2 className={sectionHeading()}>{site.shopName}</h2>
            </section>
          ))}
        </section>
      </section>
    </div>
  );
}
