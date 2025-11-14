"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, TextArea } from "@/shared/ui";
import { useChatForm } from "../model/useChatForm";
import { VoiceSelector } from "./VoiceSelector";
import { SoundtrackSelector } from "./SoundtrackSelector";
import { BackgroundVideoSelector } from "./BackgroundVideoSelector";

export function ChatForm() {
    const router = useRouter();
    const {
        form,
        successMessage,
        createdJob,
        isSubmitDisabled,
        isSubmitting,
        submitError,
        handleFieldChange,
        handleNumberChange,
        handleSubmit,
    } = useChatForm();

    const handleSoundtrackSelect = useCallback(
        (payload: { name: string; url: string }) => {
            handleFieldChange("soundtrack", payload.name);
            handleFieldChange("soundtrack_url", payload.url);
        },
        [handleFieldChange]
    );

    const handleModeChange = useCallback(
        (mode: "storyboard" | "video") => {
            handleFieldChange("generationMode", mode);
            if (mode === "storyboard") {
                handleFieldChange("background_video_url", "");
            }
        },
        [handleFieldChange]
    );

    const handleBackgroundVideoChange = useCallback(
        (url: string) => {
            handleFieldChange("background_video_url", url);
        },
        [handleFieldChange]
    );

    useEffect(() => {
        if (createdJob?.id) {
            router.push(`/videos/${createdJob.id}`);
        }
    }, [createdJob, router]);

    return (
        <div className="space-y-8">
            <div className="grid gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)]">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-[32px] border border-white/5 bg-[rgba(7,9,15,0.75)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                                Шаг 1 · Параметры запроса
                            </p>
                            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                                Заполните бриф перед генерацией
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
                            <span className="rounded-full border border-white/10 px-3 py-1">
                                сценарий → ассеты → субтитры
                            </span>
                            <span className="rounded-full border border-white/10 px-3 py-1">
                                realtime-редактирование
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
                        <div className="space-y-3">
                            <TextArea
                                label="Идея"
                                placeholder="Опишите сюжет, жанр, настроение"
                                minRows={5}
                                value={form.idea}
                                onChange={(event) =>
                                    handleFieldChange(
                                        "idea",
                                        event.target.value
                                    )
                                }
                            />
                            <Input
                                label="Стиль"
                                placeholder="YouTube shorts"
                                value={form.style}
                                onChange={(event) =>
                                    handleFieldChange(
                                        "style",
                                        event.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Длительность (сек)"
                                type="text"
                                inputMode="numeric"
                                placeholder="17"
                                value={form.duration_seconds}
                                onChange={(event) =>
                                    handleNumberChange(event.target.value)
                                }
                            />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[var(--color-text)]">
                                    Язык
                                </label>
                                <select
                                    value={form.language}
                                    onChange={(event) =>
                                        handleFieldChange(
                                            "language",
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-2xl border border-[var(--color-border)] bg-black/30 px-4 py-3 text-sm text-[var(--color-text)] shadow-[0_12px_40px_rgba(0,0,0,0.35)] focus-visible:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-outline)]"
                                >
                                    <option value="ru">Русский</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 rounded-3xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
                        <p className="text-sm font-medium text-[var(--color-text)]">
                            Формат генерации
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                className={`rounded-2xl border px-4 py-3 text-left transition ${
                                    form.generationMode === "storyboard"
                                        ? "border-transparent bg-gradient-to-br from-[var(--color-primary-from)] to-[var(--color-primary-to)] text-white shadow-[0_20px_60px_rgba(3,105,161,0.35)]"
                                        : "border-white/10 bg-black/30 text-[var(--color-text)]"
                                }`}
                                onClick={() => handleModeChange("storyboard")}
                            >
                                <p className="text-base font-semibold">
                                    Из изображений
                                </p>
                                <p className="text-sm text-white/80">
                                    Слайдшоу с генерацией сцен
                                </p>
                            </button>
                            <button
                                type="button"
                                className={`rounded-2xl border px-4 py-3 text-left transition ${
                                    form.generationMode === "video"
                                        ? "border-transparent bg-gradient-to-br from-[var(--color-primary-from)] to-[var(--color-primary-to)] text-white shadow-[0_20px_60px_rgba(3,105,161,0.35)]"
                                        : "border-white/10 bg-black/30 text-[var(--color-text)]"
                                }`}
                                onClick={() => handleModeChange("video")}
                            >
                                <p className="text-base font-semibold">
                                    Одно видео
                                </p>
                                <p className="text-sm text-white/80">
                                    Наложим озвучку и субтитры
                                </p>
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
                        <VoiceSelector
                            value={form.voice_id}
                            onChange={(voiceId) =>
                                handleFieldChange("voice_id", voiceId)
                            }
                        />
                    </div>

                    <SoundtrackSelector
                        selectedName={form.soundtrack}
                        selectedUrl={form.soundtrack_url}
                        onChange={handleSoundtrackSelect}
                    />

                    {form.generationMode === "video" && (
                        <BackgroundVideoSelector
                            value={form.background_video_url}
                            onChange={handleBackgroundVideoChange}
                        />
                    )}

                    <div className="space-y-3 rounded-3xl border border-white/10 bg-gradient-to-r from-[rgba(192,38,211,0.15)] via-[rgba(3,105,161,0.12)] to-transparent p-5 sm:p-6">
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Отправьте на генерацию
                            </p>
                            <p className="text-sm text-[var(--color-muted)]">
                                После отправки вы перейдёте к странице видео и
                                сможете наблюдать за стадиями в реальном
                                времени.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Button
                                type="submit"
                                fullWidth
                                disabled={isSubmitDisabled || isSubmitting}
                            >
                                {isSubmitting
                                    ? "Отправляем..."
                                    : "Создать видео"}
                            </Button>
                            {successMessage && (
                                <p className="text-sm text-emerald-400">
                                    {successMessage}
                                </p>
                            )}
                            {submitError && (
                                <p className="text-sm text-[var(--color-danger)]">
                                    {submitError.message ||
                                        "Не удалось отправить запрос"}
                                </p>
                            )}
                        </div>
                    </div>
                </form>

                <aside className="space-y-6   p-6  sm:p-7">
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-[var(--color-muted)]">
                        <p className="text-base font-semibold text-white">
                            Что происходит после отправки
                        </p>
                        <div className="space-y-3">
                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                                    стадия · сценарий
                                </p>
                                <p className="mt-1 text-lg font-semibold text-white">
                                    Draft Review
                                </p>
                                <p>
                                    Получаете сценарий от нейросети Gemini,
                                    редактируете текст и кадры прямо на странице
                                    видео.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                                    стадия · ассеты
                                </p>
                                <p className="mt-1 text-lg font-semibold text-white">
                                    Assets & Audio
                                </p>
                                <p>
                                    Генерируем кадры, озвучку выбранным голосом
                                    и саундтрек, всё автоматически.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                                    стадия · субтитры
                                </p>
                                <p className="mt-1 text-lg font-semibold text-white">
                                    Subtitle Review
                                </p>
                                <p>
                                    Редактируете текст построчно и
                                    подтверждаете, прежде чем ролик уйдёт на
                                    рендер.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-[var(--color-muted)]">
                        <p className="text-base font-semibold text-white">
                            Советы перед запуском
                        </p>
                        <ol className="mt-3 space-y-2 text-sm">
                            <li>
                                <span className="font-semibold text-white">
                                    1. Черновик
                                </span>{" "}
                                — система создаёт storyline и ждёт
                                подтверждения.
                            </li>
                            <li>
                                <span className="font-semibold text-white">
                                    2. Ассеты и озвучка
                                </span>{" "}
                                — фоновые кадры, озвучка выбранным голосом.
                            </li>
                            <li>
                                <span className="font-semibold text-white">
                                    3. Субтитры и финал
                                </span>{" "}
                                — редактируете текст, после чего ролик
                                рендерится.
                            </li>
                        </ol>
                        <p className="mt-3 text-xs text-[var(--color-muted)]">
                            После отправки мы автоматически перенаправим вас на
                            страницу видео. Следите за таймлайном, чтобы не
                            пропустить момент, когда система ждёт вашего
                            решения.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
