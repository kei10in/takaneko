import { z } from "zod/v4";
import { ImageDescription } from "~/utils/types/ImageDescription.ts";
import { LiveTypeEnum } from "../events/EventType.ts";
import { MemberId } from "../profile/types.ts";

export type SongVideoType =
  | "mv"
  | "mv-making"
  | "dance-performance"
  | "dance-performance-making"
  | "pv"
  | "singing"
  | "dancing"
  | "dance-practice"
  | "live"
  | "original";

export interface SongVideo {
  type?: SongVideoType;
  text: string;
  videoId: string;
  publishedAt: string;
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

  isrcs?: string[] | undefined;

  // URL for Music Streaming Services
  appleMusic?: string | undefined;
  spotify?: string | undefined;
  youtubeMusic?: string | undefined;

  // URL Music Distributors
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
    image: ImageDescription.optional(),
  }),
  segments: z.array(
    z.object({
      index: z.number(),
      actTitle: z.string().optional(),
      section: z.enum(["main", "encore"]),
      costumeNames: z.array(z.string()).optional(),
      members: z.array(z.string()).optional(),
    }),
  ),
});

export type SimpleSongActivity = z.output<typeof SimpleSongActivity>;

export const LivesForSong = z.object({
  slug: z.string(),
  name: z.string(),
  count: z.int(),
  costumeStats: z.array(
    z.object({
      costumeName: z.string(),
      count: z.int(),
    }),
  ),
  lives: z.array(SimpleSongActivity),
  // キャッシュ済みの旧 JSON も読み込めるよう、追加の集計値は任意にします。
  performanceRanking: z
    .object({
      rank: z.int().min(1),
      songCount: z.int().min(1),
    })
    .optional(),
  recentPerformanceRate: z
    .object({
      performedCount: z.int().min(0).max(20),
      eventCount: z.int().min(0).max(20),
    })
    .optional(),
});

export type LivesForSong = z.output<typeof LivesForSong>;
