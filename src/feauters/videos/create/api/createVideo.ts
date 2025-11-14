import { post } from "@/shared/api/http";
import type { VideoJob } from "@/entities/video";

export interface CreateVideoDto {
    idea: string;
    style: string;
    duration_seconds: number;
    language: string;
    template_id: string;
    voice_id: string;
    soundtrack: string;
    soundtrack_url: string;
    background_video_url?: string;
}

export interface CreateVideoResponse {
    job: VideoJob;
}

export const createVideo = (body: CreateVideoDto) =>
    post<CreateVideoResponse, CreateVideoDto>("/videos", body);
