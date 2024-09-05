import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { HimeriMomiyama } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `籾山 ひめり プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 籾山 ひめり のプロフィールです。",
    },
  ];
};

export default function Index() {
  // Twitter アカウントがもう一個ある。
  // https://x.com/momichan_hime

  return (
    <div className="container mx-auto">
      <MemberProfile profile={HimeriMomiyama} />
    </div>
  );
}
