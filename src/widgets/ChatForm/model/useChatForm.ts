"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { useCreateVideo } from "@/feauters/videos/create";
import { defaultFormState } from "./constants";
import { toPayload } from "./utils";
import type { ChatFormState } from "./types";
import type { VideoJob } from "@/entities/video";

export const useChatForm = () => {
    const [form, setForm] = useState<ChatFormState>(defaultFormState);
    const [successMessage, setSuccessMessage] = useState("");
    const { createVideo, error: submitError, isLoading: isSubmitting } =
        useCreateVideo();
    const [createdJob, setCreatedJob] = useState<VideoJob | null>(null);

    const handleFieldChange = useCallback(
        (field: keyof ChatFormState, value: string) => {
            setForm((prev) => ({
                ...prev,
                [field]: value,
            }));
        },
        []
    );

    const handleNumberChange = useCallback((value: string) => {
        const sanitized = value.replace(/[^0-9]/g, "");
        handleFieldChange("duration_seconds", sanitized);
    }, [handleFieldChange]);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setSuccessMessage("");
            const payload = toPayload(form);

            try {
                const response = await createVideo(payload);
                if (response?.job) {
                    setCreatedJob(response.job);
                }
                setSuccessMessage("Запрос на генерацию видео отправлен");
            } catch {
                // ошибка придет в submitError
            }
        },
        [createVideo, form]
    );

    const isSubmitDisabled = useMemo(() => {
        const hasIdea = Boolean(form.idea.trim());
        const hasStyle = Boolean(form.style.trim());
        const hasDuration = Boolean(form.duration_seconds.trim());
        const hasVoice = Boolean(form.voice_id);
        const hasSoundtrack = Boolean(form.soundtrack_url);
        const needsVideo = form.generationMode === "video";
        const hasBackgroundVideo = !needsVideo || Boolean(form.background_video_url);
        return !(
            hasIdea &&
            hasStyle &&
            hasDuration &&
            hasVoice &&
            hasSoundtrack &&
            hasBackgroundVideo
        );
    }, [
        form.background_video_url,
        form.duration_seconds,
        form.generationMode,
        form.idea,
        form.soundtrack_url,
        form.style,
        form.voice_id,
    ]);

    return {
        form,
        successMessage,
        createdJob,
        isSubmitDisabled,
        isSubmitting,
        submitError,
        handleFieldChange,
        handleNumberChange,
        handleSubmit,
    };
};
