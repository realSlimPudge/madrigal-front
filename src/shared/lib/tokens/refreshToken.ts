"use client";

const REFRESH_STORAGE_KEY = "refresh_token";
const ACCESS_COOKIE_KEY = "access_token";

const isBrowser = () => typeof window !== "undefined";

export const getRefreshToken = (): string | null => {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(REFRESH_STORAGE_KEY);
};

export const setRefreshToken = (token: string) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(REFRESH_STORAGE_KEY, token);
};

export const clearRefreshToken = () => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(REFRESH_STORAGE_KEY);
};

const getCookieValue = (name: string): string | null => {
    if (!isBrowser()) return null;
    const cookies = document.cookie?.split("; ") ?? [];
    const target = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    if (!target) return null;
    const [, value] = target.split("=");
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

export const getAccessTokenFromCookies = (): string | null => {
    return getCookieValue(ACCESS_COOKIE_KEY);
};

export const clearAccessTokenCookie = () => {
    if (!isBrowser()) return;
    document.cookie = `${ACCESS_COOKIE_KEY}=; Max-Age=0; path=/;`;
};
