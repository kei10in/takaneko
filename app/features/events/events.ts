import type { EventModuleExports } from "./eventModule.ts";
import { EventRepository } from "./EventRepository.ts";

const modules = import.meta.glob<EventModuleExports>("./*/*/*.{mdx,tsx,ts}");

export const Events = new EventRepository(modules);
