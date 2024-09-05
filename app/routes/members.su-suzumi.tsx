import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { SuSuzumi } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `涼海 すう プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 涼海 すう のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={SuSuzumi} />
    </div>
  );
}
