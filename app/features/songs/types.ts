import { MemberName } from "~/features/profile/members";
import { ImageDescription } from "~/utils/types/ImageDescription";

export interface SongMetaDescriptor {
  slug: string;
  name: string;

  lyricsBy: string;
  composedBy: string;
  arrangedBy: string;

  choreographedBy?: string | undefined;

  tags?: SongTag[] | undefined;

  image?: ImageDescription | undefined;
  featuredMembers?: MemberName[] | undefined;
  officialSite?: string | undefined;
  youtube?: { text: string; videoId: string }[] | undefined;
  linkcore?: string;
  linkfire?: string;
}

export interface SongTag {
  key: string;
  name: string;
  description: string;
}
