export type PromptPayload = {
    idea: string;
    tone: string;
    language: string;
    target_audience: string;
    duration_seconds: number;
    num_scenes: number;
    visual_style: string;
    constraints: string[];
};

export type ChatFormState = {
    idea: string;
    tone: string;
    language: string;
    target_audience: string;
    duration_seconds: string;
    num_scenes: string;
    visual_style: string;
    constraintsText: string;
};

export type CopyStatus = "idle" | "copied";
