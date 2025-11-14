import { get } from "@/shared/api/http";

export interface Soundtrack {
    name: string;
    description?: string;
    author?: string;
    url: string;
    low_volume?: string;
}

export interface SoundtrackResponse {
    items: Soundtrack[];
}

export const fetchSoundtracks = () =>
    get<SoundtrackResponse>("/videos/music");
