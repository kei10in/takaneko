import { MetaFunction } from "react-router";
import { SITE_TITLE } from "~/constants";
import { MemberProfile } from "~/routes/members/MemberProfile";
import { MomokoHashimoto } from "./members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `橋本 桃呼 プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 橋本 桃呼 のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={MomokoHashimoto} />
    </div>
  );
}
