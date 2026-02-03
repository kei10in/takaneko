import { z } from "zod/v4";

export const SongPerformed = z.object({
  title: z.string(),
  slug: z.string(),
  coverArt: z.string().optional(),
  lives: z.array(z.string()),
});

export type SongPerformed = z.output<typeof SongPerformed>;

export const SongPerformanceStats = z.object({
  songs: z.array(SongPerformed),
});

export type SongPerformanceStats = z.output<typeof SongPerformanceStats>;
