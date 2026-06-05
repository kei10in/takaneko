import { MetaFunction } from "react-router";
import { pageBox } from "~/components/styles";
import { formatTitle } from "~/utils/htmlHeader";
import { CurrentMembers, FormerMembers } from "../../features/profile/members";
import { MemberIdCard } from "./MemberIdCard";

export const meta: MetaFunction = () => {
  return [
    { title: formatTitle(`メンバー`) },
    {
      name: "description",
      content: "高嶺のなでしこ メンバー一覧",
    },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto my-8 lg:max-w-5xl">
      <section className={pageBox("space-y-16 px-4")}>
        <h1 className="text-5xl">メンバー</h1>

        <ul className="flex flex-wrap justify-center gap-4">
          {CurrentMembers.map((member) => (
            <li key={member.name} className="flex-none">
              <MemberIdCard member={member} />
            </li>
          ))}
        </ul>

        <section className="mt-24 space-y-8">
          <h2 className="text-3xl">元メンバー</h2>

          <ul className="flex flex-wrap justify-center gap-4">
            {FormerMembers.map((member) => (
              <li key={member.name} className="flex-none">
                <MemberIdCard member={member} />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}
