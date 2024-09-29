import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { ErisaHigashiyama } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `東山 恵里沙 プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 東山 恵里沙 のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={ErisaHigashiyama} />
    </div>
  );
}
