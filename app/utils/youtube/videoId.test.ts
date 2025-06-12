import { describe, expect, it } from "vitest";
import { extractYouTubeVideoId } from "./videoId";

describe("extractYouTubeVideoId", () => {
  it.each([
    ["https://www.youtube.com/watch?v=ABCDEFGHIJK", "ABCDEFGHIJK"],
    ["https://www.youtube.com/watch?v=ABCDEFGHIJK&t=10s", "ABCDEFGHIJK"],
    ["https://www.youtube.com/watch?v=ABCDEFGHIJK&list=PL1234567890", "ABCDEFGHIJK"],
    ["https://www.youtube.com/watch?t=10s&v=ABCDEFGHIJK", "ABCDEFGHIJK"],
    ["https://www.youtube.com/watch?list=PL1234567890&v=ABCDEFGHIJK", "ABCDEFGHIJK"],
    ["https://www.youtube.com/watch?foo=bar&v=ABCDEFGHIJK&baz=qux", "ABCDEFGHIJK"],
    ["https://www.youtube.com/watch?foo=bar&baz=qux&v=ABCDEFGHIJK", "ABCDEFGHIJK"],
    ["https://youtu.be/ABCDEFGHIJK", "ABCDEFGHIJK"],
    ["https://youtu.be/ABCDEFGHIJK?t=10", "ABCDEFGHIJK"],
    ["https://www.youtube.com/embed/ABCDEFGHIJK", "ABCDEFGHIJK"],
    ["https://www.youtube.com/shorts/ABCDEFGHIJK", "ABCDEFGHIJK"],
    ["ABCDEFGHIJK", "ABCDEFGHIJK"],
  ])('should extract videoId from "%s"', (input, expected) => {
    expect(extractYouTubeVideoId(input)).toBe(expected);
  });

  it.each([
    ["https://www.google.com/"],
    ["not_a_video_id"],
    [""],
    ["ABCDEFGHIJ"], // 10 chars
    ["ABCDEFGHIJKL"], // 12 chars
  ])('should return undefined for invalid input "%s"', (input) => {
    expect(extractYouTubeVideoId(input)).toBeUndefined();
  });
});
