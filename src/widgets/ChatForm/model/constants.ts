import type { ChatFormState, PromptPayload } from "./types";

export const DEFAULT_TEMPLATE_ID = "test";
export const DEFAULT_SOUNDTRACK = "chaotic-core";

export const defaultPayload: PromptPayload = {
    idea: "",
    style: "YouTube shorts",
    duration_seconds: 15,
    language: "ru",
    template_id: DEFAULT_TEMPLATE_ID,
    voice_id: "",
    soundtrack: DEFAULT_SOUNDTRACK,
    soundtrack_url: "",
    background_video_url: "",
};

export const defaultFormState: ChatFormState = {
    idea: defaultPayload.idea,
    style: defaultPayload.style,
    duration_seconds: String(defaultPayload.duration_seconds),
    language: defaultPayload.language,
    voice_id: defaultPayload.voice_id,
    soundtrack: defaultPayload.soundtrack,
    soundtrack_url: defaultPayload.soundtrack_url,
    generationMode: "storyboard",
    background_video_url: "",
};
