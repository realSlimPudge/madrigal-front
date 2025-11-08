"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { useCreateVideo } from "@/feauters/videos/create";
import { createSampleFormState, samplePayload } from "./constants";
import { toPayload } from "./utils";
import type { ChatFormState, CopyStatus, PromptPayload } from "./types";

const COPY_RESET_DELAY = 2000;

export const useChatForm = () => {
    const [form, setForm] = useState<ChatFormState>(() =>
        createSampleFormState()
    );
    const [submittedPayload, setSubmittedPayload] =
        useState<PromptPayload>(samplePayload);
    const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
    const [successMessage, setSuccessMessage] = useState("");
    const { createVideo, error: submitError, isLoading: isSubmitting } =
        useCreateVideo();

    const handleFieldChange = useCallback(
        (field: keyof ChatFormState, value: string) => {
            setForm((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const handleNumberChange = useCallback(
        (field: "duration_seconds" | "num_scenes", value: string) => {
            const sanitized = value.replace(/[^0-9]/g, "");
            handleFieldChange(field, sanitized);
        },
        [handleFieldChange]
    );

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSuccessMessage("");
            const payload = toPayload(form);
            setSubmittedPayload(payload);
            setCopyStatus("idle");

            try {
                await createVideo(payload);
                setSuccessMessage("Запрос на генерацию видео отправлен");
            } catch {
                // ошибка придет в submitError
            }
        },
        [createVideo, form]
    );

    const handleFillSample = useCallback(() => {
        setForm(createSampleFormState());
        setSubmittedPayload(samplePayload);
        setCopyStatus("idle");
        setSuccessMessage("");
    }, []);

    const handleCopy = useCallback(async () => {
        const text = JSON.stringify(submittedPayload, null, 2);
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                setCopyStatus("copied");
                setTimeout(() => setCopyStatus("idle"), COPY_RESET_DELAY);
            }
        } catch {
            setCopyStatus("idle");
        }
    }, [submittedPayload]);

    const isSubmitDisabled = useMemo(
        () =>
            !form.idea.trim() ||
            !form.language.trim() ||
            !form.tone.trim() ||
            !form.target_audience.trim(),
        [form]
    );

    return {
        form,
        copyStatus,
        submittedPayload,
        successMessage,
        isSubmitDisabled,
        isSubmitting,
        submitError,
        handleFieldChange,
        handleNumberChange,
        handleSubmit,
        handleFillSample,
        handleCopy,
    };
};
