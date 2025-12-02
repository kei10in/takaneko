import { EventRepository } from "./EventRepository";

const modules = import.meta.glob("./*/*/*.{mdx,tsx}");

export const Events = new EventRepository(modules);
