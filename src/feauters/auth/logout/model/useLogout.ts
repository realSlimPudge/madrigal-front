"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthUserStore } from "@/entities/user";
import {
    clearAccessTokenCookie,
    clearRefreshToken,
    getRefreshToken,
} from "@/shared/lib/tokens/refreshToken";
import useSWRMutation from "swr/mutation";
import { logout, type LogoutDto, type LogoutResponse } from "../api/logout";

const logoutFetcher = async (
    _: string,
    { arg }: { arg: LogoutDto }
): Promise<LogoutResponse> => {
    return await logout(arg);
};

export const useLogout = () => {
    const { trigger, error, isMutating } = useSWRMutation<
        LogoutResponse,
        Error,
        string,
        LogoutDto
    >("auth/logout", logoutFetcher);
    const setUser = useAuthUserStore((state) => state.setUser);
    const router = useRouter();

    const performLogout = useCallback(async () => {
        const refresh_token = getRefreshToken();
        const payload = refresh_token ? { refresh_token } : {};

        try {
            await trigger(payload);
        } finally {
            clearRefreshToken();
            clearAccessTokenCookie();
            setUser(null);
            router.push("/login");
        }
    }, [router, setUser, trigger]);

    return {
        logout: performLogout,
        error,
        isLoading: isMutating,
    };
};
