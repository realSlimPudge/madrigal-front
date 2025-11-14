import { post } from "@/shared/api/http";
import type { VideoStoryboardScene } from "@/entities/video";

export interface ApproveDraftDto {
    summary: string;
    scenes: VideoStoryboardScene[];
    background_url?: string;
}

export const approveDraft = (videoId: string, body: ApproveDraftDto) =>
    post(`/videos/${videoId}/draft:approve`, body);
