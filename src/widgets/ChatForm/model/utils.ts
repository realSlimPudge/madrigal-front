import type { ChatFormState, PromptPayload } from "./types";
import { DEFAULT_SOUNDTRACK, DEFAULT_TEMPLATE_ID } from "./constants";

export const toPayload = (state: ChatFormState): PromptPayload => ({
    idea: state.idea.trim(),
    style: state.style.trim(),
    duration_seconds: Number(state.duration_seconds) || 0,
    language: state.language,
    template_id: DEFAULT_TEMPLATE_ID,
    voice_id: state.voice_id,
    soundtrack: state.soundtrack || DEFAULT_SOUNDTRACK,
    soundtrack_url: state.soundtrack_url,
    background_video_url:
        state.generationMode === "video"
            ? state.background_video_url || undefined
            : undefined,
});
