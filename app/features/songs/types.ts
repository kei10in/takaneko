import { z } from "zod/v4";
import { LiveTypeEnum } from "../events/EventType";
import { MemberId } from "../profile/types";

export interface SongVideo {
  text: string;
  videoId: string;
}

export interface SongMetaDescriptor {
  slug: string;
  name: string;

  lyricsBy: string;
  composedBy: string;
  arrangedBy: string;

  choreographedBy?: string | undefined;

  videoRelease?: string | undefined;
  digitalRelease?: string | undefined;
  liveDebut?: string | undefined;

  tags?: SongTag[] | undefined;

  coverArt?: string;

  featuredMembers?: MemberId[] | undefined;
  officialSite?: string | undefined;
  youtube?: SongVideo[] | undefined;
  linkcore?: string;
  linkfire?: string;
}

export interface SongTag {
  key: string;
  name: string;
  description: string;
}

/**
 * 特定の楽曲が披露された公演の概要情報を表します。
 */
export const SimpleSongActivity = z.object({
  event: z.object({
    slug: z.string(),
    title: z.string(),
    liveType: LiveTypeEnum.optional(),
    date: z.string(),
    region: z.string().optional(),
    location: z.string().optional(),
  }),
  segments: z.array(
    z.object({
      actTitle: z.string().optional(),
      section: z.enum(["main", "encore"]),
      costumeName: z.string().optional(),
      index: z.number(),
    }),
  ),
});

export type SimpleSongActivity = z.output<typeof SimpleSongActivity>;

export const LivesForSong = z.object({
  slug: z.string(),
  name: z.string(),
  count: z.int(),
  lives: z.array(SimpleSongActivity),
});

export type LivesForSong = z.output<typeof LivesForSong>;
