"use client";

import { useEffect, useRef } from "react";
import { useRefreshSession } from "./useRefreshSession";
import { getAccessTokenFromCookies } from "@/shared/lib/tokens/refreshToken";
import { getTokenExpiration } from "@/shared/lib/tokenPayload";

const REFRESH_THRESHOLD_MS = 5_000;
const CHECK_INTERVAL_MS = 30_000;

export const useAutoRefresh = () => {
    const { refresh } = useRefreshSession();
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const schedule = () => {
            const token = getAccessTokenFromCookies();
            const expMs = token ? getTokenExpiration(token) : null;
            const delay =
                expMs !== null
                    ? Math.max(expMs - Date.now() - REFRESH_THRESHOLD_MS, 1_000)
                    : CHECK_INTERVAL_MS;

            timerRef.current = window.setTimeout(async () => {
                const currentToken = getAccessTokenFromCookies();
                const currentExp = currentToken
                    ? getTokenExpiration(currentToken)
                    : null;

                if (
                    currentToken &&
                    currentExp !== null &&
                    currentExp - Date.now() <= REFRESH_THRESHOLD_MS + 1_000
                ) {
                    try {
                        await refresh();
                    } catch {}
                }

                schedule();
            }, delay);
        };

        schedule();

        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, [refresh]);
};
