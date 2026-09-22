import type { Connect, Plugin } from "vite";
import { loadDevThumbnail } from "./loadDevThumbnail";

export const createDevThumbnailMiddleware =
  (publicDir: string): Connect.NextHandleFunction =>
  async (req, res, next) => {
    // URL のパス部分だけで判定し、他のリクエストには関与しない。
    const [pathname, query] = (req.url ?? "").split("?");
    if (pathname !== "/__thumbnail") {
      next();
      return;
    }

    res.setHeader("Cache-Control", "no-store");
    const params = new URLSearchParams(query);
    const src = params.get("src");
    const size = Number(params.get("size"));
    if (!src || (size !== 240 && size !== 480 && size !== 720)) {
      res.statusCode = 400;
      res.end("Invalid thumbnail parameters");
      return;
    }

    const result = await loadDevThumbnail(publicDir, src, size);
    if (result.err) {
      const errors = {
        "invalid-path": { status: 400, message: "Invalid image path" },
        "not-found": { status: 404, message: "Image not found" },
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
    server.middlewares.use(createDevThumbnailMiddleware(server.config.publicDir));
  },
});
