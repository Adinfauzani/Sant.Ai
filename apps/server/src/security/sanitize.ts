export function sanitizeString(value: string): string {
    return value
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "")
        .replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gi, "")
        .replace(/<object\b[^>]*>([\s\S]*?)<\/object>/gi, "")
        .replace(/<embed\b[^>]*>([\s\S]*?)<\/embed>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/vbscript:/gi, "")
        .replace(/data:text\/html/gi, "")
        .replace(/on[a-z]+\s*=/gi, "")
        .trim();
}

export function sanitizeObject<T>(value: T): T {
    if (typeof value === "string") {
        return sanitizeString(value) as T;
    }

    if (Array.isArray(value)) {
        return value.map((item) =>
            sanitizeObject(item),
        ) as T;
    }

    if (value !== null && typeof value === "object") {
        const result: Record<string, unknown> = {};

        for (const [key, item] of Object.entries(value)) {
            result[key] = sanitizeObject(item);
        }

        return result as T;
    }

    return value;
}