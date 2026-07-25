import { createRequestHandler } from "react-router";
import { createCloudflareLoadContext } from "./context";

const requestHandler = createRequestHandler(
  // ビルド後にしか存在しないモジュールであるため、request handler から動的に import します。
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, createCloudflareLoadContext(env, ctx));
  },
} satisfies ExportedHandler<Env>;
