import { post } from "@/shared/api/http";
import type { VideoJob } from "@/entities/video";

export interface CreateVideoDto {
    idea: string;
    tone: string;
    language: string;
    target_audience: string;
    duration_seconds: number;
    num_scenes: number;
    visual_style: string;
    constraints: string[];
}

export interface CreateVideoResponse {
    job: VideoJob;
}

export const createVideo = (body: CreateVideoDto) =>
    post<CreateVideoResponse, CreateVideoDto>("/videos", body);
