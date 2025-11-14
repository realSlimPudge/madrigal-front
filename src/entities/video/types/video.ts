export interface VideoStatusHistory {
    status: string;
    stage?: string;
    message: string;
    occurred_at: string;
}

export interface VideoArtifact {
    kind: string;
    path: string;
    url: string;
    metadata?: Record<string, unknown>;
}

export interface VideoStoryboardScene {
    position: number;
    title: string;
    focus: string;
    voiceover: string;
    visual: string;
    duration_seconds: number;
    background_url?: string | null;
}

export interface VideoJob {
    id: string;
    idea: string;
    style: string;
    language: string;
    duration_seconds: number;
    template_id: string | null;
    target_audience?: string | null;
    stage?: string | null;
    status: string;
    status_history: VideoStatusHistory[];
    video_url: string | null;
    error: string | null;
    created_at: string;
    updated_at: string;
    assets_folder?: string | null;
    artifacts?: VideoArtifact[];
    storyboard_summary?: string | null;
    storyboard?: VideoStoryboardScene[];
    voice_profile?: string;
    soundtrack?: string;
    subtitles_url?: string | null;
    subtitles_text?: string | null;
    background_video_url?: string | null;
}

export interface VideoListResponse {
    items: VideoJob[];
}

export interface VideoDetailsResponse {
    job: VideoJob;
}

export interface VideoStreamMessage {
    job: VideoJob;
}
