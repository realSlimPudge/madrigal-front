"use client";

import useSWR from "swr";
import { fetchVoices, type Voice } from "../api/voices";

export const useVoices = () => {
    const { data, error, isLoading } = useSWR("videos/voices", fetchVoices, {
        revalidateOnFocus: false,
    });

    return {
        voices: data?.items ?? [],
        isLoading,
        error,
    };
};

export type { Voice };
