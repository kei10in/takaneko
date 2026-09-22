import { TLSSocket } from "node:tls";
import type { Connect, Plugin } from "vite";
import { loadDevThumbnail } from "./loadDevThumbnail";
import { devThumbnailPrefix, parseDevThumbnailRequest } from "./parseDevThumbnailRequest";

export const createDevThumbnailMiddleware =
  (): Connect.NextHandleFunction => async (req, res, next) => {
    const requestUrl = req.url ?? "";
    if (!requestUrl.startsWith(devThumbnailPrefix)) {
      next();
      return;
    }

    res.setHeader("Cache-Control", "no-store");
    const protocol = req.socket instanceof TLSSocket ? "https:" : "http:";
    const origin = URL.parse(`${protocol}//${req.headers.host ?? ""}`);
    const { localAddress, localPort } = req.socket;
    if (!origin || !localAddress || !localPort) {
      res.statusCode = 400;
      res.end("Invalid request origin");
      return;
    }
    const parsed = parseDevThumbnailRequest(requestUrl, origin);
    if (parsed.err) {
      res.statusCode = 400;
      res.end("Invalid thumbnail parameters");
      return;
    }

    // Host ヘッダーによらず、この開発サーバーの接続先から画像を取得する。
    const source = new URL(parsed.value.source);
    source.hostname = localAddress.includes(":") ? `[${localAddress}]` : localAddress;
    source.port = String(localPort);
    const result = await loadDevThumbnail(source, parsed.value.options);
    if (result.err) {
      const errors = {
        "not-found": { status: 404, message: "Image not found" },
        "fetch-failed": { status: 502, message: "Image fetch failed" },
        "conversion-failed": { status: 500, message: "Thumbnail conversion failed" },
      };
      const error = errors[result.error];
      res.statusCode = error.status;
      res.end(error.message);
      return;
    }

    res.setHeader("Content-Type", "image/webp");
    res.end(result.value);
  };

export const devThumbnail = (): Plugin => ({
  name: "takanekono/dev-thumbnail",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use(createDevThumbnailMiddleware());
  },
});
