import type { MiddlewareHandler } from "hono";

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
    windowMs: number;
    limit: number;
    message?: string;
}

export function rateLimit(
    options: RateLimitOptions,
): MiddlewareHandler {
    const {
        windowMs,
        limit,
        message = "Too many requests",
    } = options;

    return async (c, next) => {
        const forwarded = c.req.header("x-forwarded-for");
        const realIp = c.req.header("x-real-ip");

        const ip =
            forwarded?.split(",")[0]?.trim() ??
            realIp ??
            "unknown";

        const key = `${ip}:${c.req.path}`;

        const now = Date.now();
        const existing = store.get(key);

        if (!existing || existing.resetAt <= now) {
            store.set(key, {
                count: 1,
                resetAt: now + windowMs,
            });

            await next();
            return;
        }

        if (existing.count >= limit) {
            const retryAfter = Math.ceil(
                (existing.resetAt - now) / 1000,
            );

            c.header("Retry-After", String(retryAfter));

            return c.json(
                {
                    success: false,
                    error: {
                        code: "RATE_LIMIT_EXCEEDED",
                        message,
                    },
                },
                429,
            );
        }

        existing.count += 1;

        await next();
    };
}