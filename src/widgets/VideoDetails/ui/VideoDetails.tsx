"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { VideoPlayer } from "@/shared/ui";
import { useVideoJob } from "@/entities/video/hooks/useVideoJob";
import { DraftEditor } from "@/widgets/DraftEditor";
import { SubtitlesEditor } from "@/widgets/SubtitlesEditor";
import {
    translateMessage,
    translateStatus,
} from "@/entities/video/lib/statusDictionary";

interface VideoDetailsProps {
    id: string;
}

export function VideoDetails({ id }: VideoDetailsProps) {
    const { job, isLoading, error, refresh, setPollingLocks } = useVideoJob(id);
    const [showHistory, setShowHistory] = useState(false);
    const [draftSubmitted, setDraftSubmitted] = useState(false);
    const [subtitlesSubmitted, setSubtitlesSubmitted] = useState(false);

    useEffect(() => {
        if (draftSubmitted && job?.stage !== "draft_review") {
            Promise.resolve().then(() => setDraftSubmitted(false));
        }
        if (subtitlesSubmitted && job?.stage !== "subtitle_review") {
            Promise.resolve().then(() => setSubtitlesSubmitted(false));
        }
    }, [draftSubmitted, job?.stage, subtitlesSubmitted]);

    const draftEditorActive = Boolean(
        job?.stage === "draft_review" &&
            job?.storyboard?.length &&
            !draftSubmitted
    );
    const subtitlesEditorActive = Boolean(
        job?.stage === "subtitle_review" &&
            job?.subtitles_text &&
            !subtitlesSubmitted
    );

    useEffect(() => {
        setPollingLocks({
            draft: draftEditorActive,
            subtitles: subtitlesEditorActive,
        });
    }, [draftEditorActive, setPollingLocks, subtitlesEditorActive]);

    if (isLoading || !job) {
        return (
            <div className="rounded-[32px] border border-white/10 bg-black/40 p-10 text-center text-[var(--color-muted)] backdrop-blur-xl">
                <div className="inline-flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    Загружаем данные о видео...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[32px] border border-white/10 bg-black/40 p-10 text-center text-[var(--color-danger)] backdrop-blur-xl">
                Не удалось загрузить видео
            </div>
        );
    }

    const showDraftEditor = draftEditorActive;
    const showSubtitlesEditor = subtitlesEditorActive;
    const history = job.status_history ?? [];
    const displayedHistory = showHistory ? history : history.slice(-1);

    const isReady = job.status === "ready";

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[36px] border border-white/5 bg-gradient-to-br from-[rgba(3,105,161,0.35)] via-[rgba(10,12,20,0.9)] to-[rgba(192,38,211,0.25)] p-6 sm:p-10 text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0 opacity-35">
                    <div className="absolute -left-12 top-10 h-52 w-52 rounded-full bg-[rgba(3,105,161,0.35)] blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[rgba(192,38,211,0.3)] blur-[140px]" />
                </div>
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                            {job.language.toUpperCase()} · {job.style}
                        </p>
                        <h1 className="text-4xl font-medium leading-tight">
                            {job.idea}
                        </h1>
                        <div className="flex flex-wrap gap-3 text-xs text-white/70">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-1">
                                <span>Статус: {translateStatus(job.status)}</span>
                                {!isReady && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white/70" />
                                )}
                            </span>
                            {job.stage && (
                                <span className="rounded-full border border-white/25 px-4 py-1">
                                    Стадия: {translateStatus(job.stage)}
                                </span>
                            )}
                        </div>
                        {job.target_audience && (
                            <p className="text-sm text-white/80">
                                Целевая аудитория: {job.target_audience}
                            </p>
                        )}
                    </div>
                    <Link
                        href="/videos"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
                        aria-label="К списку видео"
                    >
                        <ArrowLeft size={22} />
                    </Link>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
                <section className="space-y-6">
                    <div className="rounded-[32px] border border-white/10 bg-black/40 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                                    Текущая стадия
                                </p>
                                <h2 className="text-2xl font-semibold text-white">
                                    {translateStatus(job.stage)}
                                </h2>
                                <p className="text-sm text-[var(--color-muted)]">
                                    Обновлено:{" "}
                                    {new Date(job.updated_at).toLocaleString("ru-RU")}
                                </p>
                            </div>
                            {job.video_url && isReady && (
                                <a
                                    href={job.video_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    download
                                    className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                                >
                                    Скачать видео
                                </a>
                            )}
                        </div>
                        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <dt className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                                    Длительность
                                </dt>
                                <dd className="mt-1 text-xl font-semibold text-white">
                                    {job.duration_seconds} сек
                                </dd>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                <dt className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                                    Создано
                                </dt>
                                <dd className="mt-1 text-xl font-semibold text-white">
                                    {new Date(job.created_at).toLocaleString("ru-RU")}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {showDraftEditor ? (
                        <DraftEditor
                            videoId={job.id}
                            summary={job.storyboard_summary}
                            scenes={job.storyboard}
                            disableBackgroundSelection={Boolean(
                                job.background_video_url
                            )}
                            onSubmitted={() => {
                                setDraftSubmitted(true);
                                refresh();
                            }}
                        />
                    ) : showSubtitlesEditor ? (
                        <SubtitlesEditor
                            key={job.subtitles_text ?? job.id}
                            videoId={job.id}
                            text={job.subtitles_text}
                            onSubmitted={() => {
                                setSubtitlesSubmitted(true);
                                refresh();
                            }}
                        />
                    ) : (
                        <div className="rounded-[32px] border border-white/10 bg-black/35 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                                        История статусов
                                    </p>
                                    <h3 className="text-2xl font-semibold text-white">
                                        Прогресс генерации
                                    </h3>
                                </div>
                                {history.length > 1 && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 text-sm text-white/80 underline-offset-4 hover:underline"
                                        onClick={() => setShowHistory((prev) => !prev)}
                                    >
                                        {showHistory ? "Скрыть" : "Показать все"}
                                        {showHistory ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </button>
                                )}
                            </div>
                            <ol className="mt-5 space-y-4 text-sm">
                                {displayedHistory.map((entry) => (
                                    <li
                                        key={`${entry.status}-${entry.occurred_at}`}
                                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white">
                                                {translateStatus(entry.status)}
                                            </span>
                                            <span className="text-xs text-[var(--color-muted)]">
                                                {new Date(
                                                    entry.occurred_at
                                                ).toLocaleString("ru-RU")}
                                            </span>
                                        </div>
                                        {entry.message && (
                                            <p className="mt-2 text-[var(--color-muted)]">
                                                {translateMessage(entry.message)}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </section>

                <aside className="space-y-6 lg:sticky lg:top-8">
                    {isReady && job.video_url ? (
                        <div className="rounded-[32px] border border-white/10 bg-black p-4 shadow-[0_25px_90px_rgba(0,0,0,0.5)]">
                            <VideoPlayer
                                src={job.video_url}
                                className="mx-auto aspect-[9/16] w-full max-w-[380px]"
                            />
                        </div>
                    ) : (
                        <div className="rounded-[32px] border border-dashed border-white/15 bg-black/30 p-6 text-sm text-[var(--color-muted)] shadow-[0_25px_90px_rgba(0,0,0,0.4)]">
                            <p className="text-base font-semibold text-white">
                                Видео появится после генерации
                            </p>
                            <p className="mt-2">
                                Как только ролик будет готов, здесь появится
                                плеер. Продолжайте следить за статусами и
                                выполняйте ревью шаги.
                            </p>
                        </div>
                    )}
                    <div className="rounded-[32px] border border-white/10 bg-black/40 p-6 text-sm text-[var(--color-muted)] backdrop-blur">
                        <p className="text-base font-semibold text-white">
                            Управление стадиями
                        </p>
                        <p className="mt-2">
                            Пока ролик не готов, вы можете редактировать сценарий,
                            изображения и субтитры. Система остановится на нужной
                            стадии и дождётся вашего подтверждения.
                        </p>
                        {job.storyboard_summary && (
                            <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
                                <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                                    Сюжет
                                </p>
                                <p className="mt-2 text-white">
                                    {job.storyboard_summary}
                                </p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
