import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { SITE_TITLE } from "~/constants";
import { ErisaHigashiyama } from "../../features/profile/members";

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
