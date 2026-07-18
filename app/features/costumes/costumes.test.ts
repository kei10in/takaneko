import { describe, expect, it } from "vitest";
import { assertValidSlug } from "~/utils/tests/slug";
import { AllCostumes } from "./costumes";

describe("costumes", () => {
  it("should have unique slugs", () => {
    const slugs = AllCostumes.map((costume) => costume.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("should have valid slugs", () => {
    AllCostumes.forEach((costume) => {
      assertValidSlug(costume.slug);
    });
  });

  it("should include the summer session costume images with their sources", () => {
    expect(AllCostumes.find(({ slug }) => slug === "サマーセッション衣装")).toEqual({
      kind: "stage",
      name: "サマーセッション衣装",
      slug: "サマーセッション衣装",
      photoType: "none",
      liveDebut: "2026-07-12",
      images: [
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装.jpg",
          ref: "https://x.com/takanenofficial/status/2076313369276039561",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_城月菜央.jpg",
          ref: "https://x.com/nao_kizuki/status/2076668150947655715",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_涼海すう.jpg",
          ref: "https://x.com/su_suzumi_/status/2076305251884470702",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_橋本桃呼.jpg",
          ref: "https://x.com/MomokoHashimoto/status/2077027598845251711",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_葉月紗蘭.jpg",
          ref: "https://x.com/saara_hazuki/status/2076305031809339822",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_東山恵里沙.jpg",
          ref: "https://x.com/erisahigasiyama/status/2077495531409199238",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_日向端ひな.jpg",
          ref: "https://x.com/hina_hinahata/status/2076311398431531281",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_星谷美来.jpg",
          ref: "https://x.com/Mikuru_hositani/status/2076641113910460430",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_松本ももな.jpg",
          ref: "https://x.com/momonamatsumoto/status/2076307260683481594",
        },
        {
          path: "/takaneko/costumes/stage/サマーセッション衣装/サマーセッション衣装_籾山ひめり.jpg",
          ref: "https://x.com/himeri_momiyama/status/2076303936521424998",
        },
      ],
    });
  });
});
