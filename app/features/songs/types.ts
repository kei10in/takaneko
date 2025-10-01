import { MemberId } from "../profile/types";

export interface SongMetaDescriptor {
  slug: string;
  name: string;

  lyricsBy: string;
  composedBy: string;
  arrangedBy: string;

  choreographedBy?: string | undefined;

  tags?: SongTag[] | undefined;

  coverArt?: string;

  featuredMembers?: MemberId[] | undefined;
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
