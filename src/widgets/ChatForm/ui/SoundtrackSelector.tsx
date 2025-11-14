"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui";
import { useSoundtracks, type Soundtrack } from "@/feauters/videos/music";

interface SoundtrackSelectorProps {
    selectedName?: string;
    selectedUrl?: string;
    onChange: (track: { name: string; url: string }) => void;
}

export function SoundtrackSelector({
    selectedName,
    selectedUrl,
    onChange,
}: SoundtrackSelectorProps) {
    const { soundtracks, isLoading, error } = useSoundtracks();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const selectedTrack = useMemo(() => {
        if (!soundtracks.length) return undefined;
        return (
            soundtracks.find(
                (track) =>
                    track.url === selectedUrl || track.name === selectedName
            ) ?? soundtracks[0]
        );
    }, [selectedName, selectedUrl, soundtracks]);

    const otherTracks = useMemo(
        () => soundtracks.filter((track) => track.url !== selectedTrack?.url),
        [selectedTrack?.url, soundtracks]
    );

    const stopPreview = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPreviewUrl(null);
    }, []);

    useEffect(() => stopPreview, [stopPreview]);

    const handleTogglePreview = useCallback(
        (track: Soundtrack) => {
            const previewSource = track.low_volume || track.url;
            if (!previewSource) return;
            if (previewUrl === previewSource) {
                stopPreview();
                return;
            }
            stopPreview();
            const audio = new Audio(previewSource);
            audioRef.current = audio;
            setPreviewUrl(previewSource);
            audio.play().catch(() => {
                setPreviewUrl(null);
            });
            audio.onended = () => {
                setPreviewUrl((current) =>
                    current === previewSource ? null : current
                );
                audioRef.current = null;
            };
        },
        [previewUrl, stopPreview]
    );

    const handleSelect = useCallback(
        (track: Soundtrack) => {
            onChange({ name: track.name, url: track.url });
            setIsExpanded(false);
        },
        [onChange]
    );

    useEffect(() => {
        if (selectedTrack && selectedTrack.url === selectedUrl) return;
        if (selectedTrack) {
            onChange({ name: selectedTrack.name, url: selectedTrack.url });
        }
    }, [onChange, selectedTrack, selectedUrl]);

    const renderTrackCard = (track: Soundtrack, isSelected: boolean) => {
        const isPlaying =
            previewUrl === (track.low_volume || track.url) &&
            previewUrl !== null;
        const baseClasses =
            "rounded-2xl border p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-to)]";
        const selectedClasses = "border-[var(--color-border)]  text-white ";
        const defaultClasses =
            "border-[var(--color-border)] bg-black/20 text-[var(--color-text)]";

        return (
            <div
                key={track.url}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(track)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelect(track);
                    }
                }}
                className={`${baseClasses} ${
                    isSelected ? selectedClasses : defaultClasses
                }`}
            >
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-base font-semibold">{track.name}</p>
                        <p
                            className={`text-sm ${
                                isSelected
                                    ? "text-white/80"
                                    : "text-[var(--color-muted)]"
                            }`}
                        >
                            {track.description || "Саундтрек"}
                        </p>
                        {track.author && (
                            <p
                                className={`text-xs ${
                                    isSelected
                                        ? "text-white/80"
                                        : "text-[var(--color-muted)]"
                                }`}
                            >
                                {track.author}
                            </p>
                        )}
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isSelected
                                ? "bg-white/15 text-white"
                                : "bg-white/10 text-[var(--color-muted)]"
                        }`}
                    >
                        {isSelected ? "Выбран" : "Выбрать"}
                    </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                        type="button"
                        variant={isSelected ? "primary" : "secondary"}
                        size="sm"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleTogglePreview(track);
                        }}
                        disabled={!track.url}
                    >
                        {isPlaying ? "Пауза" : "Прослушать"}
                    </Button>
                </div>
            </div>
        );
    };

    if (!soundtracks.length && !isLoading) {
        return (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-[var(--color-muted)]">
                Нет доступных саундтреков. Попробуйте позже.
            </div>
        );
    }

    return (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                        Выбор саундтрека
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                        Слушайте и выбирайте подходящее настроение
                    </p>
                </div>
                {isLoading && (
                    <p className="text-sm text-[var(--color-muted)]">
                        Загружаем треки...
                    </p>
                )}
            </div>
            {error && (
                <p className="text-sm text-[var(--color-danger)]">
                    Не удалось загрузить саундтреки
                </p>
            )}
            {selectedTrack && renderTrackCard(selectedTrack, true)}
            {otherTracks.length > 0 && (
                <div className="space-y-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        fullWidth
                    >
                        {isExpanded ? "Скрыть другие треки" : "Показать больше"}
                    </Button>
                    {isExpanded && (
                        <div className="grid gap-4 md:grid-cols-2">
                            {otherTracks.map((track) =>
                                renderTrackCard(track, false)
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
