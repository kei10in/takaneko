import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile.tsx";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { SuSuzumi } from "../../features/profile/members.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`涼海 すう プロフィール`) },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 涼海 すう のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={SuSuzumi} />
    </div>
  );
}
