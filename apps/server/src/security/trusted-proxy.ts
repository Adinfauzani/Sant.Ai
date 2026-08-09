import type { MiddlewareHandler } from "hono";

const TRUSTED_PROXY_ENABLED =
    process.env.TRUSTED_PROXY === "true";

const TRUSTED_PROXIES = new Set(
    (process.env.TRUSTED_PROXIES ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
);

export const trustedProxy: MiddlewareHandler = async (
    c,
    next,
) => {
    if (TRUSTED_PROXY_ENABLED) {
        const forwardedFor = c.req.header(
            "x-forwarded-for",
        );

        if (
            forwardedFor &&
            TRUSTED_PROXIES.size > 0
        ) {
            const proxyIp =
                forwardedFor.split(",").at(-1)?.trim();

            if (
                proxyIp &&
                TRUSTED_PROXIES.has(proxyIp)
            ) {
                c.header(
                    "X-Trusted-Proxy",
                    "true",
                );
            }
        }
    }

    await next();
};