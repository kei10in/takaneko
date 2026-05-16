import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { formatTitle } from "~/utils/htmlHeader";
import { HimeriMomiyama } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`籾山 ひめり プロフィール`) },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 籾山 ひめり のプロフィールです。",
    },
  ];
};

export default function Index() {
  // Twitter アカウントがもう一個ある。
  // https://x.com/momichan_hime

  return (
    <div className="container mx-auto">
      <MemberProfile profile={HimeriMomiyama} />
    </div>
  );
}
