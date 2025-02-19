import { Link, MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { NaoKizuki } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `城月 菜央 プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 城月 菜央 のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={NaoKizuki} />
      <section className="mb-20 mt-12 px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-400">Link</h2>
        <div className="text-center">
          <Link to="https://kizukinao.my.canva.site/" target="_blank" rel="noopener noreferrer">
            城月菜央ウェブサイト
          </Link>
        </div>
      </section>
    </div>
  );
}
