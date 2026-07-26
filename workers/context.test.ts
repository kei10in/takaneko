import { RouterContextProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { cloudflareContext } from "../app/cloudflare-context";
import { createCloudflareLoadContext } from "./context";

describe("createCloudflareLoadContext", () => {
  it("creates a RouterContextProvider with Cloudflare bindings", () => {
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

    expect(context).toBeInstanceOf(RouterContextProvider);
    expect(context.get(cloudflareContext)).toEqual({ env, ctx: executionContext });
  });
});
