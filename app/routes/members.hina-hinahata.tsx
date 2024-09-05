import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { HinaHinahata } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `日向端 ひな プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 日向端 ひな のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={HinaHinahata} />
    </div>
  );
}
