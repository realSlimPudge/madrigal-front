"use client";

import useSWRMutation from "swr/mutation";
import {
    register,
    type RegisterDto,
    type RegisterResponse,
} from "../api/register";

const registerFetcher = async (
    _: string,
    { arg }: { arg: RegisterDto }
): Promise<RegisterResponse> => {
    return await register(arg);
};

export const useRegister = () => {
    const mutation = useSWRMutation<RegisterResponse, Error, string, RegisterDto>(
        "auth/register",
        registerFetcher
    );

    return {
        register: mutation.trigger,
        data: mutation.data,
        isLoading: mutation.isMutating,
        error: mutation.error,
    };
};
