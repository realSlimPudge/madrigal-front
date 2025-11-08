"use client";

import useSWR from "swr";
import Link from "next/link";
import { fetchVideoById } from "@/entities/video/api/videos";
import { VideoPlayer } from "@/shared/ui";

interface VideoDetailsProps {
    id: string;
}

export function VideoDetails({ id }: VideoDetailsProps) {
    const { data, error, isLoading } = useSWR(
        id ? `videos/${id}` : null,
        () => fetchVideoById(id),
        {
            refreshInterval: 15_000,
        }
    );

    if (isLoading) {
        return (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 text-center text-[var(--color-muted)]">
                Загружаем данные о видео...
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 text-center text-[var(--color-danger)]">
                Не удалось загрузить видео
            </div>
        );
    }

    const job = data.job;

    return (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-wide text-[var(--color-muted)]">
                            {job.language.toUpperCase()} · {job.style}
                        </p>
                        <h1 className="text-3xl font-semibold break-words">
                            {job.idea}
                        </h1>
                        <p className="text-sm text-[var(--color-muted)]">
                            Целевая аудитория: {job.target_audience}
                        </p>
                    </div>
                    <Link
                        href="/videos"
                        className="text-sm text-[var(--color-muted)] underline-offset-4 hover:underline"
                    >
                        ← ко всем видео
                    </Link>
                </div>

                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-muted)]">
                                Статус
                            </p>
                        <p className="text-2xl font-semibold">{job.status}</p>
                        </div>
                        {job.video_url && (
                            <a
                                href={job.video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)] transition hover:bg-[var(--color-border)]/40"
                            >
                                Скачать
                            </a>
                        )}
                    </div>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <div>
                            <dt className="text-sm text-[var(--color-muted)]">
                                Длительность
                            </dt>
                            <dd className="text-lg font-medium text-[var(--color-text)]">
                                {job.duration_seconds} секунд
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-[var(--color-muted)]">
                                Создано
                            </dt>
                            <dd className="text-lg font-medium text-[var(--color-text)]">
                                {new Date(job.created_at).toLocaleString(
                                    "ru-RU"
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-6">
                    <p className="text-sm font-medium text-[var(--color-muted)]">
                        История статусов
                    </p>
                    <ol className="mt-4 space-y-3 text-sm">
                        {job.status_history.map((entry) => (
                            <li
                                key={`${entry.status}-${entry.occurred_at}`}
                                className="rounded-2xl border border-[var(--color-border)]/60 bg-black/10 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-[var(--color-text)]">
                                        {entry.status}
                                    </span>
                                    <span className="text-xs text-[var(--color-muted)]">
                                        {new Date(
                                            entry.occurred_at
                                        ).toLocaleString("ru-RU")}
                                    </span>
                                </div>
                                <p className="mt-2 text-[var(--color-muted)]">
                                    {entry.message}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-8">
                <VideoPlayer
                    src={job.video_url}
                    className="aspect-[9/16] w-full"
                />
                <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-4 text-sm text-[var(--color-muted)]">
                    Видео воспроизводится прямо на странице. Используйте
                    кнопки управления, чтобы просматривать результат генерации.
                </div>
            </div>
        </div>
    );
}
