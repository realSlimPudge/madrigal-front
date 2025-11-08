"use client";

import { useState } from "react";

interface VideoPlayerProps {
    src?: string | null;
    poster?: string;
    className?: string;
}

export function VideoPlayer({ src, poster, className }: VideoPlayerProps) {
    const [error, setError] = useState(false);

    if (!src) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/60 text-sm text-[var(--color-muted)]">
                Видео недоступно
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 text-center text-sm text-[var(--color-danger)]">
                Не удалось загрузить видео
                <button
                    className="text-xs text-[var(--color-text)] underline"
                    onClick={() => setError(false)}
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-black ${className ?? ""}`}
        >
            <video
                key={src}
                controls
                playsInline
                poster={poster}
                className="h-full w-full object-cover"
                onError={() => setError(true)}
            >
                <source src={src} type="video/mp4" />
            </video>
        </div>
    );
}
