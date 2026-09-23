import { media2022 } from "~/features/media/2022/media.ts";
import { media2023 } from "~/features/media/2023/media.ts";
import { media2024 } from "~/features/media/2024/media.ts";
import { media2025 } from "~/features/media/2025/media.ts";
import { media2026 } from "~/features/media/2026/media.ts";

export const getAllMedia = () => [
  ...media2026(),
  ...media2025(),
  ...media2024(),
  ...media2023(),
  ...media2022(),
];
