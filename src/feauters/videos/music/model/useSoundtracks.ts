"use client";

import useSWR from "swr";
import { fetchSoundtracks, type Soundtrack } from "../api/music";

export const useSoundtracks = () => {
    const { data, error, isLoading } = useSWR(
        "videos/music",
        fetchSoundtracks,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        soundtracks: data?.items ?? [],
        isLoading,
        error,
    };
};

export type { Soundtrack };
