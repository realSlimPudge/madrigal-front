"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/shared/ui";
import { useVoices, type Voice } from "@/feauters/videos/voices";

interface VoiceSelectorProps {
    value?: string;
    onChange: (voiceId: string) => void;
}

export function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
    const { voices, isLoading, error } = useVoices();
    const [isExpanded, setIsExpanded] = useState(false);
    const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const selectedVoice = useMemo(
        () => voices.find((voice) => voice.voice_id === value),
        [value, voices]
    );
    const otherVoices = useMemo(
        () =>
            voices.filter(
                (voice) => voice.voice_id !== selectedVoice?.voice_id
            ),
        [selectedVoice?.voice_id, voices]
    );

    const stopPreview = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPreviewVoiceId(null);
    }, []);

    const handleTogglePreview = useCallback(
        (voice: Voice) => {
            if (!voice.preview_url) return;
            if (previewVoiceId === voice.voice_id) {
                stopPreview();
                return;
            }
            stopPreview();
            const audio = new Audio(voice.preview_url);
            audioRef.current = audio;
            setPreviewVoiceId(voice.voice_id);
            audio.play().catch(() => {
                setPreviewVoiceId(null);
            });
            audio.onended = () => {
                setPreviewVoiceId((current) =>
                    current === voice.voice_id ? null : current
                );
                audioRef.current = null;
            };
        },
        [previewVoiceId, stopPreview]
    );

    useEffect(() => stopPreview, [stopPreview]);

    const handleSelectVoice = useCallback(
        (voiceId: string) => {
            onChange(voiceId);
            setIsExpanded(false);
        },
        [onChange]
    );

    useEffect(() => {
        if (!voices.length) return;
        if (!value || !voices.some((voice) => voice.voice_id === value)) {
            onChange(voices[0].voice_id);
        }
    }, [onChange, value, voices]);

    useEffect(() => {
        if (!selectedVoice && otherVoices.length === 0 && voices.length > 0) {
            onChange(voices[0].voice_id);
        }
    }, [onChange, otherVoices.length, selectedVoice, voices]);

    const renderVoiceCard = (voice: Voice, isSelected: boolean) => {
        const isPlaying = previewVoiceId === voice.voice_id;
        const baseClasses =
            "rounded-2xl border p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-to)]";
        const selectedClasses = "border-[var(--color-border)]  text-white ";
        const defaultClasses =
            "border-[var(--color-border)] bg-black/20 text-[var(--color-text)]";

        return (
            <div
                key={voice.voice_id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectVoice(voice.voice_id)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelectVoice(voice.voice_id);
                    }
                }}
                className={`${baseClasses} ${
                    isSelected ? selectedClasses : defaultClasses
                }`}
            >
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-base font-semibold">{voice.name}</p>
                        {voice.description && (
                            <p
                                className={`text-sm ${
                                    isSelected
                                        ? "text-white/80"
                                        : "text-[var(--color-muted)]"
                                }`}
                            >
                                {voice.description}
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
                            handleTogglePreview(voice);
                        }}
                        disabled={!voice.preview_url}
                    >
                        {isPlaying ? "Пауза" : "Прослушать"}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                        Выбор голоса
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                        Прослушайте и выберите подходящий тембр
                    </p>
                </div>
                {isLoading && (
                    <p className="text-sm text-[var(--color-muted)]">
                        Загружаем голоса...
                    </p>
                )}
            </div>
            {error && (
                <p className="text-sm text-[var(--color-danger)]">
                    Не удалось загрузить голоса
                </p>
            )}
            {selectedVoice
                ? renderVoiceCard(selectedVoice, true)
                : !isLoading && (
                      <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-muted)]">
                          Нет доступных голосов. Попробуйте позже.
                      </div>
                  )}
            {otherVoices.length > 0 && (
                <div className="space-y-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        fullWidth
                    >
                        {isExpanded
                            ? "Скрыть другие голоса"
                            : "Показать больше голосов"}
                    </Button>
                    {isExpanded && (
                        <div className="grid gap-4 md:grid-cols-2">
                            {otherVoices.map((voice) =>
                                renderVoiceCard(voice, false)
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
