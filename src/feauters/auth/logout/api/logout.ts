import { post } from "@/shared/api/http";

export interface LogoutDto {
    refresh_token?: string;
}

export interface LogoutResponse {
    success: boolean;
}

export const logout = (body: LogoutDto) =>
    post<LogoutResponse, LogoutDto>("/auth/logout", body);
