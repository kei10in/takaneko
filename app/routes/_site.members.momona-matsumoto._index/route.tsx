import { MetaFunction } from "react-router";
import { LinkCard } from "~/components/link-card/LinkCard";
import { MemberProfile } from "~/components/MemberProfile";
import { SITE_TITLE } from "~/constants";
import { MomonaMatsumoto } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: `松本 ももな プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 松本 ももな のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={MomonaMatsumoto}>
        <section className="mt-12 px-4">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-400">Web 記事</h2>
          <ul>
            <li>
              <LinkCard to="https://nonno.hpplus.jp/beauty/trendmakeup/173094/" />
            </li>
          </ul>
        </section>
      </MemberProfile>
    </div>
  );
}
