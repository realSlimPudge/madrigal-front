"use client";

import { API_CONFIG } from "@/shared/config";
import { useAuthUserStore } from "@/entities/user";
import {
    getAccessTokenFromCookies,
    getRefreshToken,
    setRefreshToken,
} from "@/shared/lib/tokens/refreshToken";

interface RefreshResponse {
    refresh_token: string;
    user?: ReturnType<typeof useAuthUserStore.getState>["user"];
}

let refreshPromise: Promise<boolean> | null = null;

const apiBase = API_CONFIG.baseURL ?? "";

export const refreshTokens = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    if (refreshPromise) return refreshPromise;

    const refresh_token = getRefreshToken();
    const access_token = getAccessTokenFromCookies();

    if (!refresh_token || !access_token) {
        return false;
    }

    refreshPromise = fetch(`${apiBase}/auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refresh_token, access_token }),
    })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error("Failed to refresh");
            }
            const data = (await response.json()) as RefreshResponse;
            if (data.refresh_token) {
                setRefreshToken(data.refresh_token);
            }
            if (data.user) {
                useAuthUserStore.getState().setUser(data.user);
            }
            return true;
        })
        .catch(() => false)
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
};
