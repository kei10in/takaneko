import { EventRepository } from "./EventRepository";

const modules = import.meta.glob("./*/*/*.{mdx,tsx,ts}");

export const Events = new EventRepository(modules);
