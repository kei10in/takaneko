import { Link, MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { sectionHeading } from "~/components/styles";
import { formatTitle } from "~/utils/htmlHeader";
import { NaoKizuki } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`城月 菜央 プロフィール`) },
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
        <h2 className={sectionHeading("mb-4 text-center")}>Link</h2>
        <div className="text-center">
          <Link to="https://kizukinao.my.canva.site/" target="_blank" rel="noopener noreferrer">
            城月菜央ウェブサイト
          </Link>
        </div>
      </section>
    </div>
  );
}
