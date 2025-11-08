import { User } from "@/entities/user";
import { post } from "@/shared/api/http";

export interface RegisterDto {
    email: string;
    password: string;
}

export interface RegisterResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export const register = (body: RegisterDto) =>
    post<RegisterResponse, RegisterDto>("/auth/register", body);
