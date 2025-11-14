export type PromptPayload = {
    idea: string;
    style: string;
    duration_seconds: number;
    language: string;
    template_id: string;
    voice_id: string;
    soundtrack: string;
    soundtrack_url: string;
    background_video_url?: string;
};

export type ChatFormState = {
    idea: string;
    style: string;
    duration_seconds: string;
    language: string;
    voice_id: string;
    soundtrack: string;
    soundtrack_url: string;
    generationMode: "storyboard" | "video";
    background_video_url: string;
};
