import { media2022 } from "~/features/media/2022/media";
import { media2023 } from "~/features/media/2023/media";
import { media2024 } from "~/features/media/2024/media";
import { media2025 } from "~/features/media/2025/media";
import { media2026 } from "~/features/media/2026/media";

export const getAllMedia = () => [
  ...media2026(),
  ...media2025(),
  ...media2024(),
  ...media2023(),
  ...media2022(),
];
