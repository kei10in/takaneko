import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { SITE_TITLE } from "~/constants";
import { MomokoHashimoto } from "../../features/members/members";

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
