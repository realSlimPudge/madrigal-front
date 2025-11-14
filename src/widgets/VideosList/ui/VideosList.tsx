"use client";

import Link from "next/link";
import useSWR from "swr";
import { RefreshCcw } from "lucide-react";
import { fetchVideos } from "@/entities/video/api/videos";
import type { VideoJob } from "@/entities/video";

const formatTimeAgo = (date: string) => {
    const formatter = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.round(diff / 60000);
    if (Math.abs(minutes) < 60) {
        return formatter.format(-minutes, "minute");
    }
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) {
        return formatter.format(-hours, "hour");
    }
    const days = Math.round(hours / 24);
    return formatter.format(-days, "day");
};

const coverOptions = [
    "from-[#0f2027] via-[#203a43] to-[#2c5364]",
    "from-[#232526] to-[#414345]",
    "from-[#42275a] to-[#734b6d]",
    "from-[#373b44] to-[#4286f4]",
];

const getCoverClass = (id: string) =>
    coverOptions[
        Math.abs(
            id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        ) % coverOptions.length
    ];

export function VideosList() {
    const { data, error, isLoading, mutate } = useSWR("videos", fetchVideos, {
        refreshInterval: 30_000,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
                        <div className="mt-2 h-4 w-64 animate-pulse rounded-full bg-white/5" />
                    </div>
                    <div className="h-4 w-24 animate-pulse rounded-full bg-white/5" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <VideoCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 text-center text-[var(--color-danger)]">
                Не удалось загрузить видео
            </div>
        );
    }

    const videos = data?.items ?? [];

    if (!videos.length) {
        return (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 text-center text-[var(--color-muted)]">
                Пока нет созданных видео. Попробуйте создать новое на странице{" "}
                <Link
                    href="/create"
                    className="text-[var(--color-text)] underline"
                >
                    /create
                </Link>
                .
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Ваши видео</h1>
                    <p className="text-sm text-[var(--color-muted)]">
                        История генераций обновляется автоматически
                    </p>
                </div>
                <button
                    onClick={() => mutate()}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
                    aria-label="Обновить список видео"
                >
                    <RefreshCcw size={16} />
                </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-3/4">
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
}

function VideoCard({ video }: { video: VideoJob }) {
    const coverClass = getCoverClass(video.id);

    return (
        <Link
            href={`/videos/${video.id}`}
            className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]/80 shadow-[0_25px_80px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-[var(--color-border)]/60"
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
                {video.video_url ? (
                    <video
                        key={video.video_url}
                        src={`${video.video_url}#t=0.1`}
                        className="absolute inset-0 h-full w-full object-cover"
                        muted
                        playsInline
                        loop
                        preload="metadata"
                    />
                ) : (
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${coverClass}`}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 transition group-hover:from-[rgba(192,38,211,0.5)] group-hover:via-[rgba(3,105,161,0.35)] group-hover:to-transparent" />
                <div className="absolute top-3 right-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {video.status}
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-2 text-white">
                    <p className="text-lg font-semibold leading-tight line-clamp-2">
                        {video.idea}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-white/80">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                            <span className="h-2 w-2 rounded-full bg-white/80" />
                            {video.language.toUpperCase()}
                        </span>
                        <span>{formatTimeAgo(video.updated_at)}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4 text-sm text-[var(--color-muted)]">
                <span>{video.style}</span>
                <span>{video.duration_seconds} сек</span>
            </div>
        </Link>
    );
}

function VideoCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]/60 shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#1f1f23] via-[#121212] to-[#1f1f23]" />
                <div className="absolute bottom-4 left-4 right-4 space-y-3">
                    <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/10" />
                    <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/10" />
                </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4 text-sm text-[var(--color-muted)]">
                <div className="h-4 w-20 animate-pulse rounded-full bg-white/5" />
                <div className="h-4 w-12 animate-pulse rounded-full bg-white/5" />
            </div>
        </div>
    );
}
