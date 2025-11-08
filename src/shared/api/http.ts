"use client";

import { API_CONFIG } from "../config";
import { refreshTokens } from "@/shared/lib/auth/refreshTokens";

const api = API_CONFIG.baseURL ?? "";

const shouldSkipRefresh = (url: string) =>
    url.includes("/auth/refresh") || url.includes("/auth/logout");

const request = async <T>(
    url: string,
    init: RequestInit = {},
    attempt = 0
) => {
    const response = await fetch(`${api}${url}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init.headers,
        },
        credentials: init.credentials ?? "include",
    });

    const data = await response.json();

    if (!response.ok) {
        if (
            response.status === 401 &&
            attempt === 0 &&
            !shouldSkipRefresh(url)
        ) {
            const refreshed = await refreshTokens();
            if (refreshed) {
                return request<T>(url, init, attempt + 1);
            }
        }

        throw {
            status: response.status,
            message: data?.message || "Error fetching data",
        };
    }

    return data as T;
};

export const post = <T, B>(url: string, body: B) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) });

export const get = <T>(url: string) => request<T>(url);
