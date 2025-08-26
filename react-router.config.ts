import type { Config } from "@react-router/dev/config";

export const config: Config = {
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
};

export default config;
