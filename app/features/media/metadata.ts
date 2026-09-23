import { metadata2022 } from "./2022/metadata.ts";
import { metadata2023 } from "./2023/metadata.ts";
import { metadata2024 } from "./2024/metadata.ts";
import { metadata2025 } from "./2025/metadata.ts";
import { metadata2026 } from "./2026/metadata.ts";

export const getAllMediaMetadata = () => {
  return [...metadata2026, ...metadata2025, ...metadata2024, ...metadata2023, ...metadata2022];
};
