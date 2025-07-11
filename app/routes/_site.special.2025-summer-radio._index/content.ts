import { meta as meta0 } from "~/features/events/2025/07/2025-07-10_CBCラジオ「推シマシ」.mdx";
import { meta as meta1 } from "~/features/events/2025/07/2025-07-10_e-radio「キャッチ！」.mdx";
import { meta as meta2 } from "~/features/events/2025/07/2025-07-10_FM FUKUOKA「Hyper Night Program GOW!!」.mdx";
import { meta as meta3 } from "~/features/events/2025/07/2025-07-10_FM GIFU「TWILIGHT MAGIC」.mdx";
import { meta as meta4 } from "~/features/events/2025/07/2025-07-10_FM三重「つながるジカン」.mdx";
import { meta as meta5 } from "~/features/events/2025/07/2025-07-10_FM大阪「LOVE FLAP」.mdx";
import { meta as meta6 } from "~/features/events/2025/07/2025-07-10_KBC九州朝日放送「PAO～N」.mdx";
import { meta as meta7 } from "~/features/events/2025/07/2025-07-10_Kiss FM KOBE「Kiss Music Presenter」.mdx";
import { meta as meta8 } from "~/features/events/2025/07/2025-07-10_LOVE FM「music × serendipity」.mdx";
import { meta as meta9 } from "~/features/events/2025/07/2025-07-10_RKB毎日放送「さえのわっふる」.mdx";
import { meta as meta10 } from "~/features/events/2025/07/2025-07-10_TOKAI RADIO「OH! MY CHANNEL!」.mdx";
import { meta as meta11 } from "~/features/events/2025/07/2025-07-10_TOKYO FM「山崎怜奈の誰かに話したかったこと。」.mdx";
import { meta as meta12 } from "~/features/events/2025/07/2025-07-10_ZIP-FM「Neue Musik」.mdx";
import { meta as meta13 } from "~/features/events/2025/07/2025-07-11_CROSS FM「MISHMASH FRIDAY -金ズマ-」.mdx";
import { meta as meta14 } from "~/features/events/2025/07/2025-07-11_FM AICHI「FRIDAY MAGIC」.mdx";
import { meta as meta15 } from "~/features/events/2025/07/2025-07-11_FM北海道「IMAREAL」.mdx";
import { EventMeta, validateEventMeta } from "~/features/events/meta";

export const RadioAppearances: { meta: EventMeta; radiko: string }[] = [
  {
    meta: validateEventMeta(meta0),
    radiko: "https://radiko.jp/share/?sid=CBC&t=20250710233005",
  },
  {
    meta: validateEventMeta(meta1),
    radiko: "https://radiko.jp/share/?sid=E-RADIO&t=20250710142200",
  },
  {
    meta: validateEventMeta(meta2),
    radiko: "https://radiko.jp/share/?sid=FMFUKUOKA&t=20250710191140",
  },
  {
    meta: validateEventMeta(meta3),
    radiko: "https://radiko.jp/share/?sid=FMGIFU&t=20250710180830",
  },
  {
    meta: validateEventMeta(meta4),
    radiko: "https://radiko.jp/share/?sid=FMMIE&t=20250710183155",
  },
  {
    meta: validateEventMeta(meta5),
    radiko: "https://radiko.jp/share/?sid=FMO&t=20250710130000",
  },
  {
    meta: validateEventMeta(meta6),
    radiko: "https://radiko.jp/share/?sid=KBC&t=20250710140500",
  },
  {
    meta: validateEventMeta(meta7),
    radiko: "https://radiko.jp/share/?sid=KISSFMKOBE&t=20250710160010",
  },
  {
    meta: validateEventMeta(meta8),
    radiko: "https://radiko.jp/share/?sid=LOVEFM&t=20250710180000",
  },
  {
    meta: validateEventMeta(meta9),
    radiko: "https://radiko.jp/share/?sid=RKB&t=20250710160000",
  },
  {
    meta: validateEventMeta(meta10),
    radiko: "https://radiko.jp/share/?sid=TOKAIRADIO&t=20250710133530",
  },
  {
    meta: validateEventMeta(meta11),
    radiko: "https://radiko.jp/share/?sid=FMT&t=20250710140000",
  },
  {
    meta: validateEventMeta(meta12),
    radiko: "https://radiko.jp/share/?sid=ZIP-FM&t=20250710204900",
  },
  {
    meta: validateEventMeta(meta13),
    radiko: "https://radiko.jp/share/?sid=CROSSFM&t=20250711173045",
  },
  {
    meta: validateEventMeta(meta14),
    radiko: "https://radiko.jp/share/?sid=FMAICHI&t=20250711133620",
  },
  {
    meta: validateEventMeta(meta15),
    radiko: "https://radiko.jp/share/?sid=AIR-G&t=20250711202015",
  },
].filter((x): x is { meta: EventMeta; radiko: string } => x.meta != undefined);
