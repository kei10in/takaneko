import { MetaFunction } from "react-router";
import { LinkCard } from "~/components/link-card/LinkCard.tsx";
import { MemberProfile } from "~/components/MemberProfile.tsx";
import { sectionHeading } from "~/components/styles.ts";
import { formatTitle } from "~/utils/htmlHeader.ts";
import { HinaHinahata } from "../../features/profile/members.ts";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`日向端 ひな プロフィール`) },
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
          <h2 className={sectionHeading("mb-4 text-center")}>Link</h2>
          <div>
            <LinkCard to="https://lit.link/hinahinahata" />
          </div>
        </section>
      </MemberProfile>
    </div>
  );
}
