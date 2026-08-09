import { serve } from "@hono/node-server";
import { app } from "./app";

const port = Number(process.env.SERVER_PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
    console.log(
        `[server] baseURL=${process.env.BETTER_AUTH_URL ?? `http://localhost:${port}`}`,
    );

    console.log(
        `[server] listening on http://localhost:${info.port}`,
    );
});
