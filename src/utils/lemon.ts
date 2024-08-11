import { LemonsqueezyClient } from "lemonsqueezy.ts";
import { env } from "~/env.mjs";

export const client = new LemonsqueezyClient(env.LEMONSQUEEZY_API_KEY);