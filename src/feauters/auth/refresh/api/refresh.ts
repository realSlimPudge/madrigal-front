import { User } from "@/entities/user";
import { post } from "@/shared/api/http";

export interface RefreshDto {
    access_token: string;
    refresh_token: string;
}

export interface RefreshResponse {
    access_token?: string;
    refresh_token: string;
    user: User;
}

export const refreshSession = (body: RefreshDto) =>
    post<RefreshResponse, RefreshDto>("/auth/refresh", body);
