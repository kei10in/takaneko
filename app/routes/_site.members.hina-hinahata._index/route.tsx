import { MetaFunction } from "react-router";
import { LinkCard } from "~/components/link-card/LinkCard";
import { MemberProfile } from "~/components/MemberProfile";
import { SITE_TITLE } from "~/constants";
import { HinaHinahata } from "../../features/profile/members";

export const meta: MetaFunction = () => {
  return [
    { title: `日向端 ひな プロフィール - ${SITE_TITLE}` },
    {
      name: "description",
      content: "高嶺のなでしこのメンバー 日向端 ひな のプロフィールです。",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <MemberProfile profile={HinaHinahata}>
        <section className="mt-12 px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-400">Link</h2>
          <div>
            <LinkCard to="https://lit.link/hinahinahata" />
          </div>
        </section>
      </MemberProfile>
    </div>
  );
}
