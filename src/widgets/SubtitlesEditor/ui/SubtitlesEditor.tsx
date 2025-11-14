"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input, TextArea } from "@/shared/ui";
import { useApproveSubtitles } from "@/feauters/videos/subtitles";

interface SubtitlesEditorProps {
    videoId: string;
    text?: string | null;
    onSubmitted?: () => void;
}

interface SubtitleBlock {
    index: string;
    timeRange: string;
    text: string;
}

interface SubtitleStyle {
    font_family: string;
    font_size: number;
    color: string;
    outline_color: string;
    bold: boolean;
    uppercase: boolean;
    margin_bottom: number;
}

const parseSubtitles = (value?: string | null): SubtitleBlock[] => {
    if (!value) return [];
    return value
        .split(/\r?\n\r?\n/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
            const lines = block.split(/\r?\n/);
            const [indexLine = "", timeRange = "", ...textLines] = lines;
            return {
                index: indexLine.trim() || "",
                timeRange: timeRange.trim(),
                text: textLines.join("\n").trim(),
            };
        });
};

const stringifySubtitles = (blocks: SubtitleBlock[]) =>
    blocks
        .map((block, idx) => {
            const indexLine = block.index || String(idx + 1);
            const timeLine = block.timeRange || "";
            const body = block.text.trim();
            return [indexLine, timeLine, body].filter(Boolean).join("\n");
        })
        .join("\n\n");

export function SubtitlesEditor({
    videoId,
    text,
    onSubmitted,
}: SubtitlesEditorProps) {
    const parsed = useMemo(() => parseSubtitles(text), [text]);
    const [blocks, setBlocks] = useState<SubtitleBlock[]>(parsed);
    const { approveSubtitles, isLoading, error } = useApproveSubtitles(videoId);
    const [successMessage, setSuccessMessage] = useState("");
    const [wordsPerBatch, setWordsPerBatch] = useState(3);
    const [style, setStyle] = useState<SubtitleStyle>({
        font_family: "Arial",
        font_size: 14,
        color: "#FFFFFF",
        outline_color: "#000000",
        bold: true,
        uppercase: false,
        margin_bottom: 32,
    });

    useEffect(() => {
        setBlocks(parsed);
    }, [parsed]);

    const updateBlock = (index: number, value: string) => {
        setBlocks((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], text: value };
            return next;
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccessMessage("");
        const payload =
            blocks.length > 0 ? stringifySubtitles(blocks) : text ?? "";
        await approveSubtitles({
            text: payload,
            words_per_batch: wordsPerBatch,
            style,
        });
        setSuccessMessage("Субтитры отправлены на подтверждение");
        onSubmitted?.();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[32px] border border-white/10 bg-black/35 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                        Шаг ревью · субтитры
                    </p>
                    <h2 className="text-3xl font-semibold text-white">
                        Отредактируйте текст и подтвердите
                    </h2>
                    <p className="text-sm text-[var(--color-muted)]">
                        Каждая строка соответствует отдельному таймкоду.
                        Измените текст и отправьте, чтобы генерация
                        продолжилась.
                    </p>
                </div>
                <span className="rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                    Subtitle Review
                </span>
            </div>

            {blocks.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-sm text-[var(--color-muted)]">
                    Нет данных для редактирования. Как только субтитры будут
                    готовы, здесь появятся строки для правок.
                </p>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <div
                            key={`${block.index || index}-${
                                block.timeRange
                            }-${index}`}
                            className="rounded-3xl border border-white/10 bg-white/[0.02] p-5"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
                                <span className="font-semibold text-white">
                                    Субтитр {block.index || index + 1}
                                </span>
                                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
                                    {block.timeRange || "Без тайминга"}
                                </span>
                            </div>
                            <TextArea
                                label="Текст"
                                minRows={3}
                                value={block.text}
                                onChange={(event) =>
                                    updateBlock(index, event.target.value)
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5 space-y-3">
                <label className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
                    Количество слов в пачке
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        value={String(wordsPerBatch)}
                        onChange={(event) =>
                            setWordsPerBatch(
                                Math.min(
                                    10,
                                    Math.max(1, Number(event.target.value) || 1)
                                )
                            )
                        }
                    />
                </label>
                <p className="text-xs text-[var(--color-muted)]">
                    Управляет тем, сколько слов попадает в одну строку субтитров
                    при финальной генерации (1–10).
                </p>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-5">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                        Оформление субтитров
                    </p>
                    <p className="text-base text-white">
                        Настройте шрифт, цвета и поведение текста
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-[var(--color-text)]">
                            Шрифт
                        </label>
                        <select
                            value={style.font_family}
                            onChange={(event) =>
                                setStyle((prev) => ({
                                    ...prev,
                                    font_family: event.target.value,
                                }))
                            }
                            className="w-full rounded-2xl border border-[var(--color-border)] bg-black/30 px-4 py-3 text-sm text-[var(--color-text)] shadow-[0_12px_40px_rgba(0,0,0,0.35)] focus-visible:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-outline)]"
                        >
                            <option value="Arial">Arial</option>
                            <option value="Inter">Inter</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Roboto">Roboto</option>
                            <option value="EB Garamond">EB Garamond</option>
                        </select>
                    </div>
                    <Input
                        label="Размер"
                        type="number"
                        min={12}
                        max={96}
                        value={String(style.font_size)}
                        onChange={(event) =>
                            setStyle((prev) => ({
                                ...prev,
                                font_size: Number(event.target.value) || 12,
                            }))
                        }
                    />
                    <label className="flex flex-col gap-2 text-sm text-[var(--color-text)]">
                        Цвет текста
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={style.color}
                                onChange={(event) =>
                                    setStyle((prev) => ({
                                        ...prev,
                                        color: event.target.value,
                                    }))
                                }
                                className="h-12 w-12 cursor-pointer rounded-xl border border-white/20 bg-transparent p-1"
                            />
                            <Input
                                value={style.color}
                                onChange={(event) =>
                                    setStyle((prev) => ({
                                        ...prev,
                                        color: event.target.value,
                                    }))
                                }
                                placeholder="#FFFFFF"
                            />
                        </div>
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-[var(--color-text)]">
                        Цвет обводки
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={style.outline_color}
                                onChange={(event) =>
                                    setStyle((prev) => ({
                                        ...prev,
                                        outline_color: event.target.value,
                                    }))
                                }
                                className="h-12 w-12 cursor-pointer rounded-xl border border-white/20 bg-transparent p-1"
                            />
                            <Input
                                value={style.outline_color}
                                onChange={(event) =>
                                    setStyle((prev) => ({
                                        ...prev,
                                        outline_color: event.target.value,
                                    }))
                                }
                                placeholder="#000000"
                            />
                        </div>
                    </label>
                    <Input
                        label="Отступ снизу (px)"
                        type="number"
                        min={0}
                        max={200}
                        value={String(style.margin_bottom)}
                        onChange={(event) =>
                            setStyle((prev) => ({
                                ...prev,
                                margin_bottom: Number(event.target.value) || 0,
                            }))
                        }
                    />
                    <div className="flex items-center gap-3 text-sm text-white">
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={style.bold}
                                onChange={(event) =>
                                    setStyle((prev) => ({
                                        ...prev,
                                        bold: event.target.checked,
                                    }))
                                }
                            />
                            Жирный
                        </label>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={style.uppercase}
                                onChange={(event) =>
                                    setStyle((prev) => ({
                                        ...prev,
                                        uppercase: event.target.checked,
                                    }))
                                }
                            />
                            Верхний регистр
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-2 rounded-3xl border border-white/10 bg-gradient-to-r from-[rgba(3,105,161,0.2)] via-[rgba(192,38,211,0.15)] to-transparent p-5">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Отправляем..." : "Сохранить субтитры"}
                </Button>
                {successMessage && (
                    <p className="text-sm text-emerald-400">{successMessage}</p>
                )}
                {error && (
                    <p className="text-sm text-[var(--color-danger)]">
                        {error.message || "Не удалось сохранить"}
                    </p>
                )}
            </div>
        </form>
    );
}
