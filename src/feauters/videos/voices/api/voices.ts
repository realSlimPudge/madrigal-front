import { get } from "@/shared/api/http";

export interface Voice {
    voice_id: string;
    name: string;
    description?: string | null;
    preview_url?: string | null;
}

export interface VoicesResponse {
    items: Voice[];
}

export const fetchVoices = () =>
    get<VoicesResponse>("/videos/voices");
