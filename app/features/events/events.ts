import { EventRepository } from "./EventRepository.ts";

const modules = import.meta.glob("./*/*/*.{mdx,tsx,ts}");

export const Events = new EventRepository(modules);
