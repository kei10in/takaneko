import { Link, MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { SITE_TITLE } from "~/constants";
import { NaoKizuki } from "../../features/profile/members";

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
      <section className="mt-12 mb-20 px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-400">Link</h2>
        <div className="text-center">
          <Link to="https://kizukinao.my.canva.site/" target="_blank" rel="noopener noreferrer">
            城月菜央ウェブサイト
          </Link>
        </div>
      </section>
    </div>
  );
}
