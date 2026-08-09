export interface SecureCookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "Strict" | "Lax" | "None";
    path: string;
}

export const secureCookieOptions: SecureCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? "Lax"
            : "Lax",
    path: "/",
};