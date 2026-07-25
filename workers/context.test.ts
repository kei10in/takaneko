import { RouterContextProvider, type AppLoadContext } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { createCloudflareLoadContext } from "./context";

describe("createCloudflareLoadContext", () => {
  it("creates an AppLoadContext-compatible RouterContextProvider with Cloudflare bindings", () => {
    const env = {
      PNPM_VERSION: "10.7.0",
      ASSETS: {
        fetch: vi.fn<Fetcher["fetch"]>(),
        connect: vi.fn<Fetcher["connect"]>(),
      },
    } satisfies Env;
    const executionContext = {
      waitUntil: vi.fn<ExecutionContext["waitUntil"]>(),
      passThroughOnException: vi.fn<ExecutionContext["passThroughOnException"]>(),
      props: {},
    } satisfies ExecutionContext;

    const context = createCloudflareLoadContext(env, executionContext);
    const appLoadContext: AppLoadContext = context;

    expect(context).toBeInstanceOf(RouterContextProvider);
    expect(appLoadContext.cloudflare).toEqual({ env, ctx: executionContext });
  });
});
