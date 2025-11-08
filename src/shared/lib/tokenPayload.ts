"use client";

import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    exp?: number;
}

export const getTokenExpiration = (token: string): number | null => {
    try {
        const payload = jwtDecode<TokenPayload>(token);
        if (!payload.exp) return null;
        return payload.exp * 1000;
    } catch {
        return null;
    }
};
