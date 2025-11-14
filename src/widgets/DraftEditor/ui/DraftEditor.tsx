"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button, Input, TextArea } from "@/shared/ui";
import type { VideoStoryboardScene } from "@/entities/video";
import { useApproveDraft } from "@/feauters/videos/draft";
import { useSharedMedia, useUploadMedia } from "@/feauters/videos/media";
import type { MediaAsset } from "@/feauters/videos/media";

interface DraftEditorProps {
    videoId: string;
    summary?: string | null;
    scenes?: VideoStoryboardScene[];
    onSubmitted?: () => void;
    disableBackgroundSelection?: boolean;
}

const emptyScene: VideoStoryboardScene = {
    position: 1,
    title: "",
    focus: "",
    voiceover: "",
    visual: "",
    duration_seconds: 3,
};

const createEmptyScene = (position: number): VideoStoryboardScene => ({
    ...emptyScene,
    position,
});

export function DraftEditor({
    videoId,
    summary,
    scenes = [],
    onSubmitted,
    disableBackgroundSelection = false,
}: DraftEditorProps) {
    const [localSummary, setLocalSummary] = useState(summary ?? "");
    const [localScenes, setLocalScenes] = useState<VideoStoryboardScene[]>(
        scenes.length ? scenes : [createEmptyScene(1)]
    );
    const { approveDraft, isLoading, error } = useApproveDraft(videoId);
    const [successMessage, setSuccessMessage] = useState("");
    const summaryRef = useRef(summary);
    const scenesRef = useRef(scenes);
    const [mediaPickerIndex, setMediaPickerIndex] = useState<number | null>(
        null
    );
    const [expandedScenes, setExpandedScenes] = useState<boolean[]>(
        scenes.length ? scenes.map(() => false) : [true]
    );
    const {
        assets,
        isLoading: isMediaLoading,
        refresh,
    } = useSharedMedia("test/images");
    const {
        uploadMedia,
        isLoading: isUploading,
        error: uploadError,
    } = useUploadMedia();

    useEffect(() => {
        if (summaryRef.current === summary) return;
        summaryRef.current = summary;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalSummary(summary ?? "");
    }, [summary]);

    useEffect(() => {
        if (scenesRef.current === scenes) return;
        scenesRef.current = scenes;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalScenes(scenes.length ? scenes : [createEmptyScene(1)]);
    }, [scenes]);

    const updateScene = (
        index: number,
        field: keyof Omit<VideoStoryboardScene, "position">,
        value: string
    ) => {
        setLocalScenes((prev) => {
            const next = [...prev];
            const target = next[index];
            next[index] = {
                ...target,
                [field]: value,
            };
            return next;
        });
    };

    const addScene = () => {
        setLocalScenes((prev) => {
            if (prev.length >= 10) return prev;
            return [...prev, createEmptyScene(prev.length + 1)];
        });
        setExpandedScenes((prev) => {
            if (prev.length >= 10) return prev;
            return [...prev, true];
        });
    };

    const removeScene = (index: number) => {
        setLocalScenes((prev) => {
            if (prev.length === 1) return prev;
            const next = prev.filter((_, idx) => idx !== index);
            return next.map((scene, idx) => ({
                ...scene,
                position: idx + 1,
            }));
        });
        setExpandedScenes((prev) => {
            if (prev.length === 1) return prev;
            const next = prev.filter((_, idx) => idx !== index);
            return next;
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccessMessage("");
        await approveDraft({
            summary: localSummary.trim(),
            scenes: localScenes.map((scene, idx) => ({
                ...scene,
                position: idx + 1,
            })),
        });
        setSuccessMessage("Сценарий отправлен на подтверждение");
        onSubmitted?.();
    };

    const handleSelectMedia = (sceneIndex: number, asset: MediaAsset) => {
        setLocalScenes((prev) => {
            const next = [...prev];
            next[sceneIndex] = {
                ...next[sceneIndex],
                background_url: asset.url,
            };
            return next;
        });
        setMediaPickerIndex(null);
    };

    const handleUploadCustom = async (
        event: React.ChangeEvent<HTMLInputElement>,
        sceneIndex: number
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const result = reader.result;
            if (typeof result !== "string") return;
            const base64 = result.split(",").pop() ?? "";
            const response = await uploadMedia({
                folder: "test/images",
                content_type: file.type || "image/gif",
                data: base64,
            });
            if (response?.asset?.url) {
                handleSelectMedia(sceneIndex, response.asset);
                refresh();
            }
        };
        reader.readAsDataURL(file);
    };

    const renderMediaPicker = (sceneIndex: number) => {
        if (mediaPickerIndex !== sceneIndex) return null;
        return (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                    Выберите фон
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                    {isMediaLoading && (
                        <div className="col-span-3 text-xs text-[var(--color-muted)]">
                            Загружаем изображения...
                        </div>
                    )}
                    {assets.map((asset) => (
                        <button
                            key={asset.url}
                            type="button"
                            className="relative h-24 overflow-hidden rounded-xl border border-white/10"
                            onClick={() => handleSelectMedia(sceneIndex, asset)}
                        >
                            <Image
                                src={asset.thumbnail ?? asset.url}
                                alt="preview"
                                fill
                                sizes="100px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
                <div className="mt-4 space-y-2 text-xs">
                    <label className="block font-medium text-[var(--color-muted)]">
                        Загрузить своё изображение
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full text-[var(--color-text)]"
                            onChange={(event) =>
                                handleUploadCustom(event, sceneIndex)
                            }
                            disabled={isUploading}
                        />
                    </label>
                    {uploadError && (
                        <p className="text-[var(--color-danger)]">
                            {uploadError.message}
                        </p>
                    )}
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => setMediaPickerIndex(null)}
                >
                    Отмена
                </Button>
            </div>
        );
    };

    useEffect(() => {
        if (!localScenes.length) return;
        if (expandedScenes.length === localScenes.length) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpandedScenes((prev) => {
            if (prev.length === localScenes.length) return prev;
            const next = [...prev];
            while (next.length < localScenes.length) {
                next.push(false);
            }
            return next.slice(0, localScenes.length);
        });
    }, [expandedScenes.length, localScenes.length]);

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[32px] border border-white/10 bg-black/35 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                        Шаг ревью · сценарий
                    </p>
                    <h2 className="text-3xl font-semibold text-white">
                        Редактируйте storyboard
                    </h2>
                    <p className="text-sm text-[var(--color-muted)]">
                        Обновите синопсис и сцены, затем подтвердите, чтобы
                        генерация пошла дальше.
                    </p>
                </div>
                <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                    Draft Review
                </span>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                <TextArea
                    label="Краткое описание"
                    placeholder="Перескажите сюжет в нескольких предложениях"
                    value={localSummary}
                    onChange={(event) => setLocalSummary(event.target.value)}
                    minRows={4}
                />
            </div>

            <div className="space-y-5">
                {localScenes.map((scene, index) => (
                    <div
                        key={`${scene.position}-${index}`}
                        className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6"
                    >
                        <button
                            type="button"
                            className="flex w-full items-center justify-between gap-3 text-left"
                            onClick={() =>
                                setExpandedScenes((prev) => {
                                    const next = [...prev];
                                    next[index] = !next[index];
                                    return next;
                                })
                            }
                        >
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                                    Сцена {index + 1}
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {scene.title || "Без названия"}
                                </p>
                            </div>
                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                                #{index + 1}
                            </span>
                        </button>
                        {expandedScenes[index] && (
                            <>
                                <Input
                                    label="Заголовок"
                                    value={scene.title}
                                    onChange={(event) =>
                                        updateScene(
                                            index,
                                            "title",
                                            event.target.value
                                        )
                                    }
                                />
                                <TextArea
                                    label="Фокус сцены"
                                    minRows={2}
                                    value={scene.focus}
                                    onChange={(event) =>
                                        updateScene(
                                            index,
                                            "focus",
                                            event.target.value
                                        )
                                    }
                                />
                                <TextArea
                                    label="Озвучка"
                                    minRows={2}
                                    value={scene.voiceover}
                                    onChange={(event) =>
                                        updateScene(
                                            index,
                                            "voiceover",
                                            event.target.value
                                        )
                                    }
                                />
                                <TextArea
                                    label="Визуальная подсказка"
                                    minRows={2}
                                    value={scene.visual}
                                    onChange={(event) =>
                                        updateScene(
                                            index,
                                            "visual",
                                            event.target.value
                                        )
                                    }
                                />
                                {!disableBackgroundSelection && (
                                    <>
                                        {scene.background_url && (
                                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-[var(--color-muted)]">
                                                <p className="mb-2 font-medium text-white">
                                                    Выбранный фон
                                                </p>
                                                <div className="relative h-40 overflow-hidden rounded-xl">
                                                    <Image
                                                        src={scene.background_url}
                                                        alt="background"
                                                        fill
                                                        sizes="200px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-3">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    setMediaPickerIndex(index)
                                                }
                                            >
                                                {scene.background_url
                                                    ? "Сменить фон"
                                                    : "Добавить фон"}
                                            </Button>
                                            {scene.background_url && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        updateScene(
                                                            index,
                                                            "background_url",
                                                            ""
                                                        )
                                                    }
                                                >
                                                    Удалить фон
                                                </Button>
                                            )}
                                        </div>
                                        {renderMediaPicker(index)}
                                    </>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        disabled={localScenes.length === 1}
                                        onClick={() => removeScene(index)}
                                    >
                                        Удалить сцену
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="secondary"
                    onClick={addScene}
                    fullWidth
                    disabled={localScenes.length >= 10}
                >
                    Добавить сцену
                </Button>
            </div>

            <div className="space-y-2 rounded-3xl border border-white/10 bg-gradient-to-r from-[rgba(192,38,211,0.15)] via-[rgba(3,105,161,0.15)] to-transparent p-5">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Отправляем..." : "Сохранить сценарий"}
                </Button>
                {successMessage && (
                    <p className="text-sm text-emerald-400">{successMessage}</p>
                )}
                {error && (
                    <p className="text-sm text-[var(--color-danger)]">
                        {error.message || "Не удалось отправить"}
                    </p>
                )}
            </div>
        </form>
    );
}
