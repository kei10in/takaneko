import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile.tsx";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { MomokoHashimoto } from "../../features/profile/members.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`橋本 桃呼 プロフィール`) },
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
