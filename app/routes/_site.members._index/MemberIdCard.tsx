import { Link } from "react-router";
import { MemberDescription } from "~/features/profile/types";

interface Props {
  member: MemberDescription;
}

export const MemberIdCard: React.FC<Props> = (props: Props) => {
  const { member } = props;

  return (
    <Link
      className="flex h-44 w-80 flex-none flex-col overflow-hidden rounded-xl bg-white shadow-md"
      to={`/members/${member.slug}`}
    >
      <div
        className="flex h-6 flex-none items-center justify-center font-serif text-white"
        style={{ backgroundColor: member.color }}
      >
        高嶺のなでしこ
      </div>
      <div className="flex flex-1 items-stretch justify-stretch gap-3 p-3">
        <div className="h-32 w-24 flex-none">
          <img className="block h-32 w-24" src={member.idPhoto.path} alt="証明写真" />
        </div>
        <div className="flex-1 bg-white/95 bg-[url('/takaneko/emblem.png')] bg-contain bg-center bg-no-repeat bg-blend-lighten">
          <dl className="grid grid-cols-3 items-end gap-2 py-1">
            <dt className="col-span-1 text-xs leading-none">学籍番号</dt>
            <dd className="col-span-2 text-xs leading-none">
              20220807{member.number.toString().padStart(2, "0")}
            </dd>
            <dt className="col-span-1 text-xs leading-none">学科</dt>
            <dd className="col-span-2 text-xs leading-none">{member.fanName}</dd>
            <dt className="col-span-1 text-xs leading-none">氏名</dt>
            <dd className="col-span-2 text-lg leading-none font-semibold">{member.name}</dd>
            <dt className="col-span-1 text-xs leading-none"></dt>
            <dd className="col-span-2 text-xs leading-none">{member.nickname}</dd>
            <dt className="col-span-1 text-xs leading-none">生年月日</dt>
            <dd className="col-span-2 text-xs leading-none">{member.birthday}</dd>
            <dt className="col-span-1 text-xs leading-none">血液型</dt>
            <dd className="col-span-2 text-xs leading-none">{member.bloodType}</dd>
          </dl>
        </div>
      </div>
    </Link>
  );
};
