"use client";

import { useCallback } from "react";
import { useAuthUserStore } from "@/entities/user";
import {
    getAccessTokenFromCookies,
    getRefreshToken,
    setRefreshToken,
} from "@/shared/lib/tokens/refreshToken";
import useSWRMutation from "swr/mutation";
import {
    refreshSession,
    type RefreshDto,
    type RefreshResponse,
} from "../api/refresh";

const refreshFetcher = async (
    _: string,
    { arg }: { arg: RefreshDto }
): Promise<RefreshResponse> => {
    return await refreshSession(arg);
};

export const useRefreshSession = () => {
    const { trigger, data, error, isMutating } = useSWRMutation<
        RefreshResponse,
        Error,
        string,
        RefreshDto
    >("auth/refresh", refreshFetcher);

    const setUser = useAuthUserStore((state) => state.setUser);

    const refresh = useCallback(async () => {
        const refresh_token = getRefreshToken();
        const access_token = getAccessTokenFromCookies();

        if (!refresh_token || !access_token) {
            throw new Error("Нет токенов для обновления сессии");
        }

        const response = await trigger({ refresh_token, access_token });

        if (response?.refresh_token) {
            setRefreshToken(response.refresh_token);
        }
        if (response?.user) {
            setUser(response.user);
        }

        return response;
    }, [setUser, trigger]);

    return {
        refresh,
        data,
        error,
        isLoading: isMutating,
    };
};
