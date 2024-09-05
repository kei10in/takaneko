import { MetaFunction } from "@remix-run/react";
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
    </div>
  );
}
