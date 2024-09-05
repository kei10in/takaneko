import { MetaFunction } from "@remix-run/react";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { MikuruHoshitani } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `星谷 美来 プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 星谷 美来 のプロフィールです。",
    },
  ];
};

export default function Index() {
  // インスタのアカウントが複数あるので両方載せる。
  // https://www.instagram.com/min.0o6/

  return (
    <div className="container mx-auto">
      <MemberProfile profile={MikuruHoshitani} />
    </div>
  );
}
