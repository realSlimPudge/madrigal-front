import { get } from "@/shared/api/http";
import type {
    VideoDetailsResponse,
    VideoListResponse,
} from "../types/video";

export const fetchVideos = () => get<VideoListResponse>("/videos");

export const fetchVideoById = (id: string) =>
    get<VideoDetailsResponse>(`/videos/${id}`);
