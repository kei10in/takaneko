import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { formatTitle } from "~/utils/htmlHeader";
import { SaaraHazuki } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`葉月 紗蘭 プロフィール`) },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 葉月 紗蘭 のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={SaaraHazuki} />
    </div>
  );
}
