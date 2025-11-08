"use client";

import { useCallback } from "react";
import { useAuthUserStore } from "@/entities/user";
import { setRefreshToken } from "@/shared/lib/tokens/refreshToken";
import useSWRMutation from "swr/mutation";
import { login, type LoginDto, type LoginResponse } from "../api/login";

const loginFetcher = async (
    _: string,
    { arg }: { arg: LoginDto }
): Promise<LoginResponse> => {
    return await login(arg);
};

export const useLogin = () => {
    const { trigger, data, isMutating, error } = useSWRMutation<
        LoginResponse,
        Error,
        string,
        LoginDto
    >("auth/login", loginFetcher);

    const setUser = useAuthUserStore((state) => state.setUser);

    const loginAndStore = useCallback(
        async (payload: LoginDto) => {
            const response = await trigger(payload);
            if (response?.refresh_token) {
                setRefreshToken(response.refresh_token);
            }
            if (response?.user) {
                setUser(response.user);
            }
            return response;
        },
        [setUser, trigger]
    );

    return {
        login: loginAndStore,
        data,
        isLoading: isMutating,
        error,
    };
};
