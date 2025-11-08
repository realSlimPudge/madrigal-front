"use client";

import { Button, Input, TextArea } from "@/shared/ui";
import { useChatForm } from "../model/useChatForm";

export function ChatForm() {
    const {
        form,
        submittedPayload,
        copyStatus,
        successMessage,
        isSubmitDisabled,
        isSubmitting,
        submitError,
        handleFieldChange,
        handleNumberChange,
        handleSubmit,
        handleFillSample,
        handleCopy,
    } = useChatForm();

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
            >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-semibold">Ваша идея</h1>
                        <p className="text-sm text-[var(--color-muted)]">
                            Опишите идею, тон и ограничения будущего видео
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleFillSample}
                    >
                        Заполнить примером
                    </Button>
                </div>

                <TextArea
                    label="Идея"
                    placeholder="Опишите идею или бриф"
                    minRows={6}
                    value={form.idea}
                    onChange={(event) =>
                        handleFieldChange("idea", event.target.value)
                    }
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <Input
                        label="Тон"
                        placeholder="нейтральный"
                        value={form.tone}
                        onChange={(event) =>
                            handleFieldChange("tone", event.target.value)
                        }
                    />
                    <Input
                        label="Язык"
                        placeholder="ru"
                        value={form.language}
                        onChange={(event) =>
                            handleFieldChange("language", event.target.value)
                        }
                    />
                    <Input
                        label="Целевая аудитория"
                        placeholder="Например: студенты, айтишники"
                        value={form.target_audience}
                        onChange={(event) =>
                            handleFieldChange(
                                "target_audience",
                                event.target.value
                            )
                        }
                    />
                    <Input
                        label="Визуальный стиль"
                        placeholder="Например: неон, кино"
                        value={form.visual_style}
                        onChange={(event) =>
                            handleFieldChange(
                                "visual_style",
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
                        placeholder="30"
                        value={form.duration_seconds}
                        onChange={(event) =>
                            handleNumberChange(
                                "duration_seconds",
                                event.target.value
                            )
                        }
                    />
                    <Input
                        label="Количество сцен"
                        type="text"
                        inputMode="numeric"
                        placeholder="5"
                        value={form.num_scenes}
                        onChange={(event) =>
                            handleNumberChange("num_scenes", event.target.value)
                        }
                    />
                </div>

                <TextArea
                    label="Ограничения"
                    placeholder="Каждую новую мысль на новой строке"
                    minRows={3}
                    helperText="Например: избегать жаргона, добавить call-to-action"
                    value={form.constraintsText}
                    onChange={(event) =>
                        handleFieldChange("constraintsText", event.target.value)
                    }
                />

                <div className="space-y-2">
                    <Button
                        type="submit"
                        fullWidth
                        disabled={isSubmitDisabled || isSubmitting}
                    >
                        {isSubmitting ? "Отправляем..." : "Создать видео"}
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
            </form>

            <div className="space-y-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-[var(--color-muted)]">
                            Предпросмотр JSON
                        </p>
                        <p className="text-lg font-semibold">
                            Текущее состояние формы
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCopy}
                        disabled={!submittedPayload}
                    >
                        {copyStatus === "copied"
                            ? "Скопировано"
                            : "Скопировать"}
                    </Button>
                </div>
                <pre className="max-h-[320px] overflow-auto rounded-2xl bg-black/40 p-4 text-sm leading-relaxed text-[var(--color-text)]">
                    {JSON.stringify(submittedPayload, null, 2)}
                </pre>
            </div>
        </div>
    );
}
