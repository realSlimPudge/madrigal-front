"use client";

import useSWR from "swr";
import { fetchVideoMedia } from "../api/media";

export const useSharedVideoMedia = (folder: string) => {
    const { data, error, isLoading, mutate } = useSWR(
        folder ? ["video-media", folder] : null,
        () => fetchVideoMedia(folder)
    );

    return {
        assets: data?.items ?? [],
        isLoading,
        error,
        refresh: mutate,
    };
};
