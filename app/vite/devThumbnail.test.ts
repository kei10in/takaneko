// @vitest-environment node
import { Transformer } from "@napi-rs/image";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createDevThumbnailMiddleware } from "./devThumbnail";

const makeImage = (width: number, height: number) =>
  Transformer.fromRgbaPixels(Buffer.alloc(width * height * 4, 255), width, height).png();

describe("開発用サムネイル配信", () => {
  let directory: string;
  let publicDir: string;
  let server: Server;
  let origin: string;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(os.tmpdir(), "dev-thumbnail-"));
    publicDir = path.join(directory, "public");
    await mkdir(publicDir);
    const middleware = createDevThumbnailMiddleware(publicDir);
    server = createServer((req, res) => {
      middleware(req, res, () => {
        res.end("next middleware");
      });
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (address === null || typeof address === "string") {
      throw new Error("HTTP server did not start");
    }
    origin = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    if (server?.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      });
    }
    await rm(directory, { recursive: true, force: true });
  });

  const request = (src: string, size = "240") =>
    fetch(`${origin}/__thumbnail?${new URLSearchParams({ src, size })}`);

  it.each([
    [800, 400, 240, 240, 120],
    [400, 800, 480, 240, 480],
    [800, 400, 720, 720, 360],
    [40, 20, 240, 240, 120],
  ])(
    "%i×%i の画像を %ipx の枠に収める",
    async (width, height, size, expectedWidth, expectedHeight) => {
      await writeFile(path.join(publicDir, "image.png"), await makeImage(width, height));
      const response = await request("/image.png", String(size));
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("image/webp");
      expect(response.headers.get("cache-control")).toBe("no-store");
      const output = Buffer.from(await response.arrayBuffer());
      expect(output.subarray(8, 12).toString()).toBe("WEBP");
      expect(await new Transformer(output).metadata()).toMatchObject({
        width: expectedWidth,
        height: expectedHeight,
      });
    },
  );

  it("EXIF の向きを補正してから指定サイズに収める", async () => {
    const jpeg = await Transformer.fromRgbaPixels(
      Buffer.alloc(800 * 400 * 4, 255),
      800,
      400,
    ).jpeg();
    // APP1: little-endian TIFF に Orientation=6（時計回り90度）のタグを付ける。
    const exif = Buffer.from(
      "ffe1002245786966000049492a0008000000010012010300010000000600000000000000",
      "hex",
    );
    await writeFile(
      path.join(publicDir, "rotated.jpg"),
      Buffer.concat([jpeg.subarray(0, 2), exif, jpeg.subarray(2)]),
    );
    const response = await request("/rotated.jpg");
    expect(response.status).toBe(200);
    expect(
      await new Transformer(Buffer.from(await response.arrayBuffer())).metadata(),
    ).toMatchObject({ width: 120, height: 240 });
  });

  it("日本語・空白・区切り文字を含むパスを読み込める", async () => {
    const name = "写真 1&2#3+.png";
    await writeFile(path.join(publicDir, name), await makeImage(100, 100));
    expect((await request(`/${name}`)).status).toBe(200);
  });

  it("元画像の更新を次のリクエストに反映する", async () => {
    const filepath = path.join(publicDir, "image.png");
    await writeFile(filepath, await makeImage(800, 400));
    const before = Buffer.from(await (await request("/image.png")).arrayBuffer());
    await writeFile(filepath, await makeImage(400, 800));
    const after = Buffer.from(await (await request("/image.png")).arrayBuffer());
    expect(await new Transformer(before).metadata()).toMatchObject({ width: 240, height: 120 });
    expect(await new Transformer(after).metadata()).toMatchObject({ width: 120, height: 240 });
    expect(await readFile(filepath)).toEqual(await makeImage(400, 800));
  });

  it.each(["", "241", "0", "-240", "abc"])("未対応のサイズ %s は 400 を返す", async (size) => {
    expect((await request("/image.png", size)).status).toBe(400);
  });

  it.each(["", "/__thumbnail", "/__thumbnail?src=%2Fimage.png", "/__thumbnail?size=240"])(
    "%s を他のルートと区別する",
    async (url) => {
      const response = await fetch(`${origin}${url}`);
      if (url === "") {
        expect(await response.text()).toBe("next middleware");
      } else {
        expect(response.status).toBe(400);
      }
    },
  );

  it.each([
    "/../outside.png",
    "/../public-other/outside.png",
    "https://example.com/image.png",
    "image.png",
    "/bad\u0000.png",
  ])("不正な元画像パス %s を拒否する", async (src) => {
    expect((await request(src)).status).toBe(400);
  });

  it("public 外を指すシンボリックリンクを拒否する", async () => {
    const outside = path.join(directory, "outside.png");
    await writeFile(outside, await makeImage(100, 100));
    await symlink(outside, path.join(publicDir, "link.png"));
    expect((await request("/link.png")).status).toBe(400);
  });

  it("存在しない画像は 404 を返す", async () => {
    expect((await request("/missing.png")).status).toBe(404);
  });

  it("変換できない画像は 500 を返す", async () => {
    await writeFile(path.join(publicDir, "broken.png"), "not an image");
    expect((await request("/broken.png")).status).toBe(500);
  });

  it("対象外の URL は後続の middleware に渡す", async () => {
    const response = await fetch(`${origin}/__thumbnail-other`);
    expect(await response.text()).toBe("next middleware");
  });
});
