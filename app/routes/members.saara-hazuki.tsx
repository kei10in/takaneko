import { MetaFunction } from "react-router";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { SaaraHazuki } from "./members/members";

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
