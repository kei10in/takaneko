import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile.tsx";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { RiriHaruno } from "../../features/profile/members.ts";

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
