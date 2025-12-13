import { CookieOptions } from "hono/utils/cookie";
import EnValidator from "../utils/env.js";

export const COOKIE_TOKE_NAME: string = "AUTH_TOKEN";
export const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: EnValidator.getValue("NODE_ENV") === "production",
    maxAge: 60 * 60,
    path: "/",
    sameSite: "Lax",
};
