import { Hono } from "hono";
import { serve } from "@hono/node-server";
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

/**
 * CORS
 */
app.use(
    "/api/*",
    cors({
        origin: webOrigin,
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
        windowMs: 60_000,
        limit: 100,
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

/**
 * Server
 */
serve({ fetch: app.fetch, port }, (info) => {
    console.log(
        `[server] auth baseURL=${serverURL} webOrigin=${webOrigin}`,
    );

    console.log(
        `[server] listening on http://localhost:${info.port}`,
    );
});