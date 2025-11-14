"use client";

import useSWR from "swr";
import { fetchMedia } from "../api/media";

export const useSharedMedia = (folder: string) => {
    const { data, error, isLoading, mutate } = useSWR(
        folder ? ["media", folder] : null,
        () => fetchMedia(folder)
    );

    return {
        assets:
            data?.items.filter((item) => item.url && item.size > 0) ?? [],
        isLoading,
        error,
        refresh: mutate,
    };
};
