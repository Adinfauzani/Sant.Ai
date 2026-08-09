import { Hono } from "hono";
import { cors } from "hono/cors";
import { createAuth } from "@santai/shared";

import {
    securityHeaders,
    rateLimit,
    trustedProxy,
} from "./security";

const port = Number(process.env.SERVER_PORT ?? 3001);

const serverURL =
    process.env.BETTER_AUTH_URL ?? `http://localhost:${port}`;

const webOrigin =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not set");
}

const rateLimitWindowMs = Number(
    process.env.RATE_LIMIT_WINDOW_MS ?? 60_000,
);
const rateLimitMax = Number(
    process.env.RATE_LIMIT_MAX_REQUESTS ?? 100,
);

const auth = createAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: serverURL,
    siteURL: webOrigin,
});

const app = new Hono();

/**
 * Security Headers
 */
app.use("*", securityHeaders);

/**
 * Trusted Proxy
 */
app.use("*", trustedProxy);

const allowedOrigins = [webOrigin];

if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push(
        "http://localhost:3000",
        "http://localhost:3001",
    );
}

/**
 * CORS
 */
app.use(
    "/api/*",
    cors({
        origin: allowedOrigins,
        credentials: true,
        allowMethods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowHeaders: [
            "Content-Type",
            "Authorization",
        ],
    }),
);

/**
 * Rate Limit
 */
app.use(
    "/api/*",
    rateLimit({
        windowMs: rateLimitWindowMs,
        limit: rateLimitMax,
    }),
);

/**
 * Health Check
 */
app.get("/api/health", (c) =>
    c.json({
        ok: true,
        service: "santai-server",
        time: new Date().toISOString(),
    }),
);

/**
 * Better Auth
 */
app.all("/api/auth/*", (c) =>
    auth.handler(c.req.raw),
);

export { app };
