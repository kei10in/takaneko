import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { formatTitle } from "~/utils/htmlHeader";
import { ErisaHigashiyama } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`東山 恵里沙 プロフィール`) },
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
