// @vitest-environment node
import { Transformer } from "@napi-rs/image";
import { once } from "node:events";
import { createServer, type Server } from "node:http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDevThumbnailMiddleware } from "./devThumbnail";
import { loadDevThumbnail } from "./loadDevThumbnail";

const makeImage = (width: number, height: number) =>
  Transformer.fromRgbaPixels(Buffer.alloc(width * height * 4, 255), width, height).png();

const defaultOptions = "width=240,height=240,fit=contain,format=webp,quality=80";

describe("開発用サムネイル配信", () => {
  let server: Server;
  let origin: string;
  let images: Map<string, Buffer>;
  let sourceRequests: string[];

  beforeEach(async () => {
    images = new Map();
    sourceRequests = [];
    const middleware = createDevThumbnailMiddleware();
    server = createServer((req, res) => {
      middleware(req, res, () => {
        const url = req.url ?? "/";
        sourceRequests.push(url);
        const image = images.get(url);
        if (image) {
          res.setHeader("Content-Type", "image/png");
          res.end(image);
        } else if (url === "/redirect") {
          res.writeHead(302, { Location: "/image.png" }).end();
        } else if (url === "/external-redirect") {
          res.writeHead(302, { Location: "https://example.com/image.png" }).end();
        } else if (url === "/unavailable") {
          res.writeHead(503).end();
        } else if (url === "/disconnect") {
          req.socket.destroy();
        } else {
          res.writeHead(404).end("next middleware");
        }
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
  });

  const request = (src = "image.png", options = defaultOptions) =>
    fetch(`${origin}/cdn-cgi/image/${options}/${src}`);

  it.each([
    [800, 400, 240, 240, 240, 120],
    [400, 800, 480, 480, 240, 480],
    [800, 400, 720, 720, 720, 360],
    [40, 20, 240, 240, 240, 120],
    [800, 400, 300, 100, 200, 100],
  ])(
    "%i×%i の画像を %i×%i の枠に収める",
    async (width, height, targetWidth, targetHeight, expectedWidth, expectedHeight) => {
      images.set("/image.png", await makeImage(width, height));
      const response = await request(
        "image.png",
        `width=${targetWidth},height=${targetHeight},fit=contain,format=webp,quality=80`,
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("image/webp");
      expect(response.headers.get("cache-control")).toBe("no-store");
      const output = Buffer.from(await response.arrayBuffer());
      expect(output.subarray(8, 12).toString()).toBe("WEBP");
      expect(await new Transformer(output).metadata()).toMatchObject({
        width: expectedWidth,
        height: expectedHeight,
      });
      expect(sourceRequests).toEqual(["/image.png"]);
    },
  );

  it("オプションの順番に依存しない", async () => {
    images.set("/image.png", await makeImage(800, 400));
    expect(
      (await request("image.png", "quality=80,format=webp,height=240,fit=contain,width=240"))
        .status,
    ).toBe(200);
  });

  it.each(["image.png", "/image.png", "absolute"])(
    "元画像 %s を自身の HTTP サーバーから取得する",
    async (source) => {
      images.set("/image.png", await makeImage(100, 100));
      const response = await request(source === "absolute" ? `${origin}/image.png` : source);
      expect(response.status).toBe(200);
      expect(sourceRequests).toEqual(["/image.png"]);
    },
  );

  it("quality の指定を WebP 出力に反映する", async () => {
    const pixels = Buffer.from(
      Array.from({ length: 256 * 256 * 4 }, (_, index) =>
        index % 4 === 3 ? 255 : (index * 17 + Math.floor(index / 1024)) % 256,
      ),
    );
    images.set("/image.png", await Transformer.fromRgbaPixels(pixels, 256, 256).png());
    const low = await request("image.png", defaultOptions.replace("quality=80", "quality=1"));
    const high = await request("image.png", defaultOptions.replace("quality=80", "quality=100"));
    expect(low.status).toBe(200);
    expect(high.status).toBe(200);
    expect(Buffer.from(await low.arrayBuffer())).not.toEqual(Buffer.from(await high.arrayBuffer()));
  });

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
    images.set("/rotated.jpg", Buffer.concat([jpeg.subarray(0, 2), exif, jpeg.subarray(2)]));
    const response = await request("rotated.jpg");
    expect(response.status).toBe(200);
    expect(
      await new Transformer(Buffer.from(await response.arrayBuffer())).metadata(),
    ).toMatchObject({ width: 120, height: 240 });
  });

  it.each([false, true])(
    "日本語・予約文字とクエリを保持して取得する（絶対 URL: %s）",
    async (absolute) => {
      const source = `${encodeURIComponent("写真 1&2#3+?,%.png")}?version=2&name=a%3Fb`;
      images.set(`/${source}`, await makeImage(100, 100));
      expect((await request(absolute ? `${origin}/${source}` : source)).status).toBe(200);
      expect(sourceRequests).toEqual([`/${source}`]);
    },
  );

  it("元画像の更新を次のリクエストに反映する", async () => {
    images.set("/image.png", await makeImage(800, 400));
    const before = Buffer.from(await (await request()).arrayBuffer());
    images.set("/image.png", await makeImage(400, 800));
    const after = Buffer.from(await (await request()).arrayBuffer());
    expect(await new Transformer(before).metadata()).toMatchObject({ width: 240, height: 120 });
    expect(await new Transformer(after).metadata()).toMatchObject({ width: 120, height: 240 });
    expect(sourceRequests).toEqual(["/image.png", "/image.png"]);
  });

  it.each([
    "",
    "width=240",
    defaultOptions.replace("width=240", "width=0"),
    defaultOptions.replace("height=240", "height=-1"),
    defaultOptions.replace("width=240", "width=1.5"),
    defaultOptions.replace("width=240", "width=abc"),
    defaultOptions.replace("quality=80", "quality=0"),
    defaultOptions.replace("quality=80", "quality=101"),
    defaultOptions.replace("quality=80", "quality=1.5"),
    defaultOptions.replace("fit=contain", "fit=cover"),
    defaultOptions.replace("format=webp", "format=jpeg"),
    defaultOptions.replace("width=240", "w=240"),
    `${defaultOptions},blur=2`,
    `${defaultOptions},width=480`,
    `${defaultOptions},`,
  ])("不正・未対応のオプション %s は取得前に拒否する", async (options) => {
    expect((await request("image.png", options)).status).toBe(400);
    expect(sourceRequests).toEqual([]);
  });

  it.each([
    "",
    "https://example.com/image.png",
    "//example.com/image.png",
    "ftp://localhost/image.png",
    "%ZZ.png",
  ])("不正な元画像 %s を取得前に拒否する", async (source) => {
    expect((await request(source)).status).toBe(400);
    expect(sourceRequests).toEqual([]);
  });

  it("異なるポートの元画像は取得しない", async () => {
    const source = new URL("/image.png", origin);
    source.port = source.port === "80" ? "81" : "80";
    expect((await request(source.href)).status).toBe(400);
    expect(sourceRequests).toEqual([]);
  });

  it.each([false, true])(
    "画像変換への再帰リクエストを拒否する（絶対 URL: %s）",
    async (absolute) => {
      const source = `/cdn-cgi/image/${defaultOptions}/image.png`;
      expect((await request(absolute ? `${origin}${source}` : source)).status).toBe(400);
      expect(sourceRequests).toEqual([]);
    },
  );

  it.each(["redirect", "external-redirect", "unavailable", "disconnect"])(
    "元画像の取得失敗 %s は 502 を返す",
    async (source) => {
      expect((await request(source)).status).toBe(502);
      expect(sourceRequests).toEqual([`/${source}`]);
    },
  );

  it("存在しない画像は 404 を返す", async () => {
    expect((await request("missing.png")).status).toBe(404);
  });

  it("変換できない画像は 500 を返す", async () => {
    images.set("/broken.png", Buffer.from("not an image"));
    expect((await request("broken.png")).status).toBe(500);
  });

  it.each(["/__thumbnail?src=image.png&size=240", "/cdn-cgi/other", "/other"])(
    "対象外の URL %s は後続に渡す",
    async (url) => {
      expect(await (await fetch(`${origin}${url}`)).text()).toBe("next middleware");
      expect(sourceRequests).toEqual([url]);
    },
  );
});

describe("開発用サムネイルの画像取得先", () => {
  const options = { width: 240, height: 240, quality: 80 };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    "http://localhost:5173/image.png",
    "http://127.0.0.1:5174/image.png",
    "https://127.0.0.1:5173/image.png",
    "http://user:password@127.0.0.1:5173/image.png",
  ])("許可した origin と異なる取得先 %s は通信せず拒否する", async (source) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("fetch must not be called"));

    const result = await loadDevThumbnail(
      new URL(source),
      options,
      new URL("http://127.0.0.1:5173"),
    );

    expect(result).toMatchObject({ err: true, error: "invalid-source" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("IPv6 の許可した origin から画像を取得する", async () => {
    const image = await makeImage(100, 100);
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(Uint8Array.from(image), { status: 200 }));
    const origin = new URL("http://[::1]:5173");

    const result = await loadDevThumbnail(new URL("/image.png", origin), options, origin);

    expect(result.ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });
});
