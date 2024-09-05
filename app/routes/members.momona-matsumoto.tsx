import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { MomonaMatsumoto } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `松本 ももな プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 松本 ももな のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={MomonaMatsumoto} />
    </div>
  );
}
