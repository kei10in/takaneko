import { describe, expect, it } from "vitest";
import { mediaKey } from "~/features/media/mediaDescriptor";
import type { MediaDescriptor, MediaDetails } from "~/features/media/types";
import {
  collectMissingOgpFields,
  mergeMediaMetadata,
  shouldLogMetadataBuildError,
} from "./cache-media-metadata";

const makeStaticMedia = (mediaUrl: string): Extract<MediaDescriptor, { kind: "static" }> => ({
  kind: "static",
  title: "title",
  authorName: "author",
  publishedAt: "2026-01-01",
  mediaUrl,
  image: { path: "https://example.com/image.jpg", ref: "example" },
  category: "article",
  presents: [],
});

const makeDetails = (key: string, mediaUrl: string, deleted?: boolean): MediaDetails => ({
  kind: "static",
  key,
  title: "title",
  authorName: "author",
  publishedAt: "2026-01-01",
  mediaUrl,
  imageUrl: "https://example.com/image.jpg",
  category: "article",
  presents: [],
  deleted,
});

describe("collectMissingOgpFields", () => {
  it("returns missing OgpMediaDescriptor field names", () => {
    const missing = collectMissingOgpFields({
      title: undefined,
      siteName: "",
      image: "https://example.com/image.jpg",
      mediaUrl: undefined,
    });

    expect(missing).toEqual([
      "title",
      "siteName",
      "mediaUrl",
    ]);
  });
});

describe("mergeMediaMetadata", () => {
  it("emits marked-deleted only on first miss", () => {
    const media = makeStaticMedia("https://example.com/a");
    const key = mediaKey(media);
    const existing = { [key]: makeDetails(key, media.mediaUrl) };

    const result = mergeMediaMetadata([media], existing, {});

    expect(result.transitions).toEqual([
      { type: "marked-deleted", key, mediaUrl: media.mediaUrl },
    ]);
    expect(result.merged[0].deleted).toBe(true);
  });

  it("does not emit marked-deleted repeatedly", () => {
    const media = makeStaticMedia("https://example.com/a");
    const key = mediaKey(media);
    const existing = { [key]: makeDetails(key, media.mediaUrl, true) };

    const result = mergeMediaMetadata([media], existing, {});

    expect(result.transitions).toEqual([]);
    expect(result.merged[0].deleted).toBe(true);
  });

  it("emits restored when deleted item appears again", () => {
    const media = makeStaticMedia("https://example.com/a");
    const key = mediaKey(media);
    const existing = { [key]: makeDetails(key, media.mediaUrl, true) };
    const newItem = makeDetails(key, media.mediaUrl, false);

    const result = mergeMediaMetadata([media], existing, { [key]: newItem });

    expect(result.transitions).toEqual([{ type: "restored", key, mediaUrl: media.mediaUrl }]);
    expect(result.merged[0].deleted).toBeFalsy();
  });
});

describe("shouldLogMetadataBuildError", () => {
  it("suppresses error logs when existing metadata is already deleted", () => {
    const existing = makeDetails("k", "https://example.com/a", true);
    expect(shouldLogMetadataBuildError(existing)).toBe(false);
  });

  it("allows error logs for active or missing existing metadata", () => {
    const active = makeDetails("k", "https://example.com/a", false);
    expect(shouldLogMetadataBuildError(active)).toBe(true);
    expect(shouldLogMetadataBuildError(undefined)).toBe(true);
  });
});
