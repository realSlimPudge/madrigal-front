"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { API_CONFIG } from "@/shared/config";
import { fetchVideoById } from "../api/videos";
import type { VideoDetailsResponse, VideoStreamMessage } from "../types/video";
import { getAccessTokenFromCookies } from "@/shared/lib/tokens/refreshToken";

const getWsBase = () => API_CONFIG.wsURL;

interface PollingLocks {
    draft: boolean;
    subtitles: boolean;
}

export const useVideoJob = (id?: string) => {
    const shouldFetch = Boolean(id);
    const { data, error, isLoading, mutate } = useSWR<VideoDetailsResponse>(
        shouldFetch ? ["video", id] : null,
        () => fetchVideoById(id as string),
        {
            revalidateOnFocus: false,
        }
    );
    const [locks, setLocks] = useState<PollingLocks>({ draft: false, subtitles: false });
    const setPollingLocks = useCallback((next: Partial<PollingLocks>) => {
        setLocks((prev) => ({ ...prev, ...next }));
    }, []);

    const refresh = useCallback(() => mutate(), [mutate]);

    useEffect(() => {
        if (!id || typeof window === "undefined") return;
        const wsBase = getWsBase();
        if (!wsBase) return;
        const token = getAccessTokenFromCookies();
        if (!token) return;

        const ws = new WebSocket(`${wsBase}/videos/${id}/stream`, [
            `authorization: Bearer ${token}`,
        ]);

        ws.onmessage = (event) => {
            try {
                const payload: VideoStreamMessage = JSON.parse(event.data);
                if (payload?.job) {
                    mutate(
                        (current) => {
                            if (
                                current?.job?.updated_at ===
                                payload.job.updated_at
                            ) {
                                return current;
                            }
                            return { job: payload.job };
                        },
                        { revalidate: false, populateCache: true }
                    );
                }
            } catch {
                // ignore malformed message
            }
        };

        return () => {
            ws.close();
        };
    }, [id, mutate]);

    useEffect(() => {
        if (!id) return;
        const status = data?.job.status;
        const stage = data?.job.stage;

        const shouldPauseDraft = locks.draft && stage === "draft_review";
        const shouldPauseSubtitles =
            locks.subtitles && stage === "subtitle_review";

        if (!status || status === "ready" || shouldPauseDraft || shouldPauseSubtitles)
            return;
        const interval = setInterval(async () => {
            await mutate(async (current) => {
                const fresh = await fetchVideoById(id);
                if (
                    current?.job?.updated_at === fresh.job.updated_at
                ) {
                    return current;
                }
                return fresh;
            }, { revalidate: false });
        }, 4000);
        return () => clearInterval(interval);
    }, [
        data?.job.stage,
        data?.job.status,
        id,
        mutate,
        locks.draft,
        locks.subtitles,
    ]);

    return {
        job: data?.job,
        isLoading,
        error,
        refresh,
        setPollingLocks,
    };
};
