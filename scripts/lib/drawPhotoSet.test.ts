import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { createDrawPhotoSetCommand, drawPhotoSet } from "./drawPhotoSet.ts";

const temporaryDirectories: string[] = [];
const makeDirectory = async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "draw-photo-set-"));
  temporaryDirectories.push(directory);
  return directory;
};

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("draw photo set arguments", () => {
  it("defaults to the work directory and four photos per member", async () => {
    const inputs: { directory: string; photosPerMember: number }[] = [];
    await createDrawPhotoSetCommand(async (input) => {
      inputs.push(input);
    }).parseAsync([], { from: "user" });
    expect(inputs).toEqual([{ directory: "public/takaneko/goods/work", photosPerMember: 4 }]);
  });

  it("accepts a directory and three photos per member", async () => {
    const inputs: { directory: string; photosPerMember: number }[] = [];
    await createDrawPhotoSetCommand(async (input) => {
      inputs.push(input);
    }).parseAsync(["./photos", "--photos-per-member", "3"], { from: "user" });
    expect(inputs).toEqual([{ directory: "./photos", photosPerMember: 3 }]);
  });

  it.each(["0", "-1", "1.5", "abc", "3x", "9007199254740992"])(
    "rejects invalid count %s",
    async (count) => {
      const command = createDrawPhotoSetCommand(async () => {
        expect.unreachable();
      })
        .exitOverride()
        .configureOutput({ writeErr: () => {} });
      await expect(
        command.parseAsync(["--photos-per-member", count], { from: "user" }),
      ).rejects.toMatchObject({ code: "commander.invalidArgument" });
    },
  );
});

describe("drawPhotoSet", () => {
  it.each([154, 138])(
    "renders %ipx photos in numeric order with a white empty slot",
    async (width) => {
      const directory = await makeDirectory();
      const colors = ["red", "green", "blue"];
      await Promise.all(
        ["10.png", "02.png", "01.png"].map(async (name, index) => {
          await sharp({
            create: { width: 154, height: 220, channels: 3, background: colors[index] },
          })
            .png()
            .toFile(path.join(directory, name));
        }),
      );
      await writeFile(path.join(directory, "ignored.jpg"), "ignored");
      await mkdir(path.join(directory, "nested"));
      await writeFile(path.join(directory, "nested", "04.png"), "ignored");
      const input = { directory, photosPerMember: 4, size: { width, height: 220 } };
      const result = await drawPhotoSet(input);
      expect(result.ok).toBe(true);
      const output = path.join(directory, "out");
      expect((await readdir(output)).toSorted()).toEqual(["generated.webp", "positions.json"]);
      const positions = JSON.parse(await readFile(path.join(output, "positions.json"), "utf8"));
      expect(positions).toEqual(
        [0, 1, 2].map((index) => ({
          id: index + 1,
          x: 33 + index * 172 + (154 - width) / 2,
          y: 33,
          width,
          height: 220,
        })),
      );
      const image = sharp(await readFile(path.join(output, "generated.webp")));
      expect(await image.metadata()).toMatchObject({ width: 1424, height: 286, format: "webp" });
      const sample = async (left: number) =>
        Array.from(
          await image
            .clone()
            .extract({ left, top: 100, width: 1, height: 1 })
            .removeAlpha()
            .raw()
            .toBuffer(),
        );
      const first = await sample(100);
      const second = await sample(272);
      const third = await sample(444);
      expect(first[2]).toBeGreaterThan(240);
      expect(first[0]).toBeLessThan(10);
      expect(second[1]).toBeGreaterThan(100);
      expect(third[0]).toBeGreaterThan(240);
      expect(await sample(616)).toEqual([255, 255, 255]);
      await writeFile(path.join(output, "positions.json"), "stale");
      expect((await drawPhotoSet(input)).ok).toBe(true);
      expect(JSON.parse(await readFile(path.join(output, "positions.json"), "utf8"))).toEqual(
        positions,
      );
    },
  );

  it("reports an empty input without creating output", async () => {
    const directory = await makeDirectory();
    const result = await drawPhotoSet({
      directory,
      photosPerMember: 4,
      size: { width: 154, height: 220 },
    });
    expect(result).toMatchObject({ err: true, error: { kind: "no-images" } });
    expect(await readdir(directory)).toEqual([]);
  });

  it("reports a missing directory", async () => {
    const directory = path.join(await makeDirectory(), "missing");
    expect(
      await drawPhotoSet({ directory, photosPerMember: 4, size: { width: 154, height: 220 } }),
    ).toMatchObject({ err: true, error: { kind: "generation-failed" } });
  });

  it("reports an unreadable image", async () => {
    const directory = await makeDirectory();
    await writeFile(path.join(directory, "01.png"), "invalid");
    expect(
      await drawPhotoSet({ directory, photosPerMember: 4, size: { width: 154, height: 220 } }),
    ).toMatchObject({ err: true, error: { kind: "generation-failed" } });
  });

  it("reports an output failure", async () => {
    const directory = await makeDirectory();
    await sharp({ create: { width: 10, height: 10, channels: 3, background: "red" } })
      .png()
      .toFile(path.join(directory, "01.png"));
    await writeFile(path.join(directory, "out"), "blocked");
    expect(
      await drawPhotoSet({ directory, photosPerMember: 4, size: { width: 154, height: 220 } }),
    ).toMatchObject({ err: true, error: { kind: "generation-failed" } });
  });
});
