import { minimatch } from "minimatch";
import { ChildProcessByStdio, execFileSync, spawn } from "node:child_process";
import path from "node:path";
import { Readable, Writable } from "node:stream";
import { Plugin, ViteDevServer } from "vite";

export const takanekono = (): Plugin => {
  let worker: ChildProcessByStdio<Writable, Readable, null> | undefined;
  let server: ViteDevServer | undefined;

  type ImageCroppingResult = { ok: boolean } & Record<string, unknown>;

  const pending = new Map<
    string,
    {
      resolve: (res: ImageCroppingResult) => void;
      reject: (err: unknown) => void;
    }
  >();

  // ランダムグッズの画像を切り抜くためのワーカーを起動する関数です。
  const startCroppingWorker = (server: ViteDevServer) => {
    // Windows の場合は pnpm ではなく pnpm.cmd です。
    const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    const cropWorkerScriptPath = path.resolve(
      __dirname,
      "..",
      "..",
      "scripts",
      "crop-product-image-worker.ts",
    );

    worker = spawn(cmd, ["tsx", cropWorkerScriptPath], {
      stdio: ["pipe", "pipe", "inherit"],
    });

    // 受信データのハンドリング
    let buffer = "";
    worker.stdout.setEncoding("utf-8");
    worker.stdout.on("data", (chunk) => {
      buffer += chunk;
      let index;

      while ((index = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);

        try {
          const response = JSON.parse(line);
          const { file } = response;
          if (file && pending.has(file)) {
            const entry = pending.get(file);
            pending.delete(file);
            entry?.resolve(response);
          }
        } catch (e) {
          server.config.logger.error(`invalid JSON: ${line}`);
        }
      }
    });

    server.httpServer?.on("close", () => {
      worker?.kill();
      worker = undefined;
    });
  };

  return {
    name: "takanekono",

    configureServer: async (s) => {
      server = s;
      startCroppingWorker(server);
    },

    buildEnd: () => {
      const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
      const buildCroppedImagesScript = path.resolve(
        __dirname,
        "..",
        "..",
        "scripts",
        "crop-items.ts",
      );

      execFileSync(cmd, ["tsx", buildCroppedImagesScript]).toString();
    },

    async load(id) {
      if (
        minimatch(id, "**/features/products/*/*.ts") &&
        id.match(/features\/products\/\d\d\d\d\//)
      ) {
        // 画像の切り抜きは、Dev Server / Worker 起動中のときだけ実行します。
        if (server == undefined || worker == undefined) {
          return;
        }

        if (pending.has(id)) {
          return;
        }

        const result = await new Promise<ImageCroppingResult>((resolve, reject) => {
          pending.set(id, { resolve, reject });

          try {
            worker?.stdin.write(JSON.stringify({ file: id }) + "\n");
          } catch (err) {
            pending.delete(id);
            reject(err);
          }
        });

        if (!result.ok) {
          this.error(`error on ${id}: ${result.error}`);
        }

        return;
      }
    },
  };
};
