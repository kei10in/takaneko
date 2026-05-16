import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { formatTitle } from "~/utils/htmlHeader";
import { RiriHaruno } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`春野 莉々 プロフィール`) },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 春野 莉々 のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={RiriHaruno} />
    </div>
  );
}
