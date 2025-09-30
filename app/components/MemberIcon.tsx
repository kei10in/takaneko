import { findMemberDescription } from "~/features/profile/members";
import { TakanenoNadeshiko, TakanenoNadeshiko2 } from "~/features/profile/takaneno-nadeshiko";
import { MemberIdOrGroupId } from "~/features/profile/types";

interface Props {
  member: MemberIdOrGroupId;
  className?: string;
  size?: number | string;
}

export const MemberIcon = (props: Props) => {
  const { size, member, className } = props;

  // FIXME: "高嶺のなでしこ" や "高嶺のなでしこ2" ではなく "all" が来るべき。
  const md =
    member === "高嶺のなでしこ"
      ? TakanenoNadeshiko
      : member === "高嶺のなでしこ2"
        ? TakanenoNadeshiko2
        : findMemberDescription(member);

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
