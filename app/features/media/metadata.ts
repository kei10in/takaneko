import { metadata2022 } from "./2022/metadata";
import { metadata2023 } from "./2023/metadata";
import { metadata2024 } from "./2024/metadata";
import { metadata2025 } from "./2025/metadata";

export const getAllMediaMetadata = () => {
  return [...metadata2025, ...metadata2024, ...metadata2023, ...metadata2022];
};
