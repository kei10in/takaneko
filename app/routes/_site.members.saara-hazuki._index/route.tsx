import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { SITE_TITLE } from "~/constants";
import { SaaraHazuki } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: `葉月 紗蘭 プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 葉月 紗蘭 のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={SaaraHazuki} />
    </div>
  );
}
