export interface SecureCookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "Strict" | "Lax" | "None";
    path: string;
}

const sameSiteValues = ["Strict", "Lax", "None"] as const;

const sameSite = (process.env.COOKIE_SAME_SITE ?? "lax").toLowerCase();
const sameSiteValue = sameSiteValues.find(
    (value) => value.toLowerCase() === sameSite,
);

export const secureCookieOptions: SecureCookieOptions = {
    httpOnly: process.env.COOKIE_HTTP_ONLY !== "false",
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: sameSiteValue ?? "Lax",
    path: "/",
};