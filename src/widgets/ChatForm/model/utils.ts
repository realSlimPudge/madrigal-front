import type { ChatFormState, PromptPayload } from "./types";

export const toPayload = (state: ChatFormState): PromptPayload => ({
    idea: state.idea.trim(),
    tone: state.tone.trim(),
    language: state.language.trim(),
    target_audience: state.target_audience.trim(),
    duration_seconds: Number(state.duration_seconds) || 0,
    num_scenes: Number(state.num_scenes) || 0,
    visual_style: state.visual_style.trim(),
    constraints: state.constraintsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
});
