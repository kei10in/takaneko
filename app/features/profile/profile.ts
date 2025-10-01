import { ImageDescription } from "~/utils/types/ImageDescription";
import { findMemberDescription } from "./members";
import { AllMembersProfile, TakanenoNadeshiko, TakanenoNadeshiko2 } from "./takaneno-nadeshiko";
import { GroupId, MemberCollectionId, MemberId } from "./types";

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
