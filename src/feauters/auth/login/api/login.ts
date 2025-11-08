import { User } from "@/entities/user";
import { post } from "@/shared/api/http";

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    refresh_token: string;
    user: User;
}

export const login = (body: LoginDto) =>
    post<LoginResponse, LoginDto>("/auth/login", body);
