import { post } from "@/shared/api/http";

export interface ApproveSubtitlesDto {
    text: string;
    words_per_batch?: number;
    style?: {
        font_family?: string;
        font_size?: number;
        color?: string;
        outline_color?: string;
        bold?: boolean;
        uppercase?: boolean;
        margin_bottom?: number;
    };
}

export const approveSubtitles = (videoId: string, body: ApproveSubtitlesDto) =>
    post(`/videos/${videoId}/subtitles:approve`, body);
