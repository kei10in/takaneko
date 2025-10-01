import { ImageDescription } from "~/utils/types/ImageDescription";
import { findMemberDescription } from "./members";
import { AllMembersProfile, TakanenoNadeshiko, TakanenoNadeshiko2 } from "./takaneno-nadeshiko";
import {
  GroupDescription,
  GroupId,
  MemberCollectionId,
  MemberDescription,
  MemberId,
  MemberIdOrGroupId,
} from "./types";

export const findMemberOrGroupDescription = (
  id: MemberId | GroupId,
): MemberDescription | GroupDescription => {
  if (id == GroupId.高嶺のなでしこ) {
    return TakanenoNadeshiko;
  }

  if (id == GroupId.高嶺のなでしこ2) {
    return TakanenoNadeshiko2;
  }

  return findMemberDescription(id);
};

export const findIdPhoto = (
  id: MemberId | GroupId | MemberCollectionId,
): { idPhoto: ImageDescription; name: string } => {
  if (id == MemberCollectionId.all) {
    return AllMembersProfile;
  }

  if (id == GroupId.高嶺のなでしこ) {
    return TakanenoNadeshiko;
  }

  if (id == GroupId.高嶺のなでしこ2) {
    return TakanenoNadeshiko2;
  }

  return findMemberDescription(id);
};

/**
 * includesMember は指定されたメンバーが `memberList` に含まれているかどうかを判定します。
 */
export const includesMember = (member: MemberId, memberList: MemberIdOrGroupId[]): boolean => {
  return memberList.some((p) => {
    if (p == GroupId.高嶺のなでしこ) {
      return TakanenoNadeshiko.members.includes(member);
    }

    if (p == GroupId.高嶺のなでしこ2) {
      return TakanenoNadeshiko2.members.includes(member);
    }

    return p == member;
  });
};
