export interface VideoStatusHistory {
    status: string;
    message: string;
    occurred_at: string;
}

export interface VideoJob {
    id: string;
    idea: string;
    tone?: string;
    language: string;
    duration_seconds: number;
    style: string;
    target_audience: string;
    template_id: string | null;
    status: string;
    status_history: VideoStatusHistory[];
    video_url: string;
    error: string | null;
    created_at: string;
    updated_at: string;
}

export interface VideoListResponse {
    items: VideoJob[];
}

export interface VideoDetailsResponse {
    job: VideoJob;
}
