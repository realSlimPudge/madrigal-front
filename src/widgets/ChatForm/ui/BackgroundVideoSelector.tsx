"use client";

import { useRef, useState } from "react";
import { Button } from "@/shared/ui";
import {
    useSharedVideoMedia,
    useUploadVideo,
    type MediaAsset,
} from "@/feauters/videos/media";

const SHARED_FOLDER = "test/videos";
const MAX_VIDEO_SIZE_MB = 50;

interface BackgroundVideoSelectorProps {
    value?: string;
    onChange: (url: string) => void;
}

export function BackgroundVideoSelector({
    value,
    onChange,
}: BackgroundVideoSelectorProps) {
    const { assets, isLoading, error, refresh } = useSharedVideoMedia(
        SHARED_FOLDER
    );
    const { uploadVideo, isLoading: isUploading, error: uploadError } =
        useUploadVideo();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSelect = (asset: MediaAsset) => {
        onChange(asset.url);
    };

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            setFormError(
                `Видео должно быть меньше ${MAX_VIDEO_SIZE_MB} МБ`
            );
            event.target.value = "";
            return;
        }
        setFormError(null);
        try {
            const response = await uploadVideo({
                folder: "videos/test",
                file,
            });
            await refresh();
            if (response?.asset?.url) {
                onChange(response.asset.url);
            }
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        } catch (uploadErr) {
            setFormError(
                (uploadErr as Error)?.message ||
                    "Не удалось загрузить видео"
            );
        }
    };

    return (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[var(--color-text)]">
                        Фоновое видео
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                        Выберите ролик или загрузите своё видео
                    </p>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? "Загружаем..." : "Загрузить видео"}
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>
            {error && (
                <p className="text-sm text-[var(--color-danger)]">
                    Не удалось загрузить список видео
                </p>
            )}
            {uploadError && (
                <p className="text-sm text-[var(--color-danger)]">
                    {uploadError.message}
                </p>
            )}
            {formError && (
                <p className="text-sm text-[var(--color-danger)]">
                    {formError}
                </p>
            )}
            {isLoading ? (
                <p className="text-sm text-[var(--color-muted)]">
                    Загружаем ролики...
                </p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {assets.map((asset) => {
                        const isSelected = asset.url === value;
                        return (
                            <button
                                key={asset.url}
                                type="button"
                                onClick={() => handleSelect(asset)}
                                className={`rounded-2xl border p-3 text-left transition ${
                                    isSelected
                                        ? "border-transparent bg-gradient-to-br from-[var(--color-primary-from)] to-[var(--color-primary-to)] text-white shadow-[0_20px_60px_rgba(3,105,161,0.35)]"
                                        : "border-white/10 bg-black/20 text-[var(--color-text)]"
                                }`}
                            >
                                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                    <video
                                        src={asset.url}
                                        className="h-full w-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                    />
                                </div>
                                <p className="mt-2 text-sm font-semibold">
                                    {asset.key.split("/").pop()}
                                </p>
                                <p className="text-xs text-[var(--color-muted)]">
                                    {(asset.size / (1024 * 1024)).toFixed(1)} MB
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}
            {!assets.length && !isLoading && (
                <p className="text-sm text-[var(--color-muted)]">
                    Нет доступных роликов. Загрузите своё.
                </p>
            )}
        </div>
    );
}
