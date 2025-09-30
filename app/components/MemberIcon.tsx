import { findMemberDescription } from "~/features/profile/members";
import { TakanenoNadeshiko } from "~/features/profile/takaneno-nadeshiko";
import { MemberIdOrGroupId } from "~/features/profile/types";

interface Props {
  member: MemberIdOrGroupId;
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
