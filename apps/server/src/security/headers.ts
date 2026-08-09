import { secureHeaders } from "hono/secure-headers";

export const securityHeaders = secureHeaders({
    xContentTypeOptions: "nosniff",
    xFrameOptions: "DENY",
    referrerPolicy: "strict-origin-when-cross-origin",
    xDnsPrefetchControl: "off",
    xDownloadOptions: "noopen",
    xPermittedCrossDomainPolicies: "none",
    crossOriginOpenerPolicy: "same-origin",
    crossOriginResourcePolicy: "same-origin",
});