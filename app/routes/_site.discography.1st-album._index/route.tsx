import { Link, MetaFunction } from "react-router";
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
              <div className="mt-2 space-y-2">
                {site.merchandises.map((m) => (
                  <section key={m.name} className="bg-white px-4 py-2 shadow">
                    <h3 className="text-md font-semibold">{m.name}</h3>
                    <div className="text-sm">
                      <p>{m.edition}</p>
                      <p>価格: {m.price} 円</p>
                      <p>商品番号: {m.sku}</p>
                      <p>特典:</p>
                      <ul className="list-inside list-disc">
                        {m.bonuses.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                      <p>
                        商品ページ:{" "}
                        <Link
                          to={m.url}
                          className="text-nadeshiko-800 visited:text-nadeshiko-950"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {m.url}
                        </Link>
                      </p>
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </section>
      </section>
    </div>
  );
}
