const baseURL = process.env.NEXT_PUBLIC_API_URL;

const deriveWsUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (url.startsWith("ws")) return url;
    if (url.startsWith("https")) return url.replace("https", "wss");
    if (url.startsWith("http")) return url.replace("http", "ws");
    return url;
};

export const API_CONFIG = {
    baseURL,
    wsURL: process.env.NEXT_PUBLIC_WS_URL ?? deriveWsUrl(baseURL),
};
