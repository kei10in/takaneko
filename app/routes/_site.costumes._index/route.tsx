import { MetaFunction } from "react-router";
import { pageBox, pageHeading } from "~/components/styles";
import { SITE_TITLE } from "~/constants";

export const meta: MetaFunction = () => {
  return [
    { title: `衣装 - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこの衣装一覧",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto lg:max-w-5xl">
      <section className={pageBox()}>
        <h1 className={pageHeading()}>衣装</h1>
      </section>
    </div>
  );
}
