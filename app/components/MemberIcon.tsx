import { findMemberDescription, MemberNameOrGroup } from "~/features/members/members";
import { TakanenoNadeshiko } from "~/features/members/takaneno-nadeshiko";

interface Props {
  member: MemberNameOrGroup;
  className?: string;
  size?: number | string;
}

export const MemberIcon = (props: Props) => {
  const { size, member, className } = props;

  const md = member === "高嶺のなでしこ" ? TakanenoNadeshiko : findMemberDescription(member);

  return (
    <span className={className}>
      <img
        src={md.idPhoto.path}
        alt={md.name}
        width={size}
        height={size}
        className="inline aspect-square rounded-full object-cover"
      />
    </span>
  );
};
