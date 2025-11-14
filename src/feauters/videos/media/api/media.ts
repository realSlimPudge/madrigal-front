import { get, post } from "@/shared/api/http";

export interface MediaAsset {
    key: string;
    url: string;
    size: number;
    last_modified?: string;
    thumbnail?: string;
}

export interface SharedMediaResponse {
    items: MediaAsset[];
}

export const fetchMedia = (folder: string) =>
    get<SharedMediaResponse>(
        `/videos/media?folder=${encodeURIComponent(folder)}`
    );

export const fetchVideoMedia = (folder: string) =>
    get<SharedMediaResponse>(
        `/videos/media/videos?folder=${encodeURIComponent(folder)}`
    );

export interface UploadMediaDto {
    folder?: string;
    content_type?: string;
    data: string;
}

export interface UploadMediaResponse {
    asset: MediaAsset;
}

export const uploadMedia = (body: UploadMediaDto) =>
    post<UploadMediaResponse, UploadMediaDto>("/videos/media", body);

export const uploadVideoMedia = (folder: string, file: File) => {
    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", file);
    return post<UploadMediaResponse, FormData>(
        "/videos/media/videos:upload",
        formData
    );
};
