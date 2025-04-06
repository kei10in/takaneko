import { MetaFunction } from "react-router";
import { MemberProfile } from "~/components/MemberProfile";
import { SITE_TITLE } from "~/constants";
import { RiriHaruno } from "../../features/members/members";

export const meta: MetaFunction = () => {
  return [
    { title: `春野 莉々 プロフィール - ${SITE_TITLE}` },
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
