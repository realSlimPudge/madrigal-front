"use client";

import type { User } from "@/entities/user/types/types";

const STORAGE_KEY = "auth_user";

const isBrowser = () => typeof window !== "undefined";

export const saveUserToStorage = (user: User) => {
    if (!isBrowser()) return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
        // ignore
    }
};

export const loadUserFromStorage = (): User | null => {
    if (!isBrowser()) return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
};

export const clearUserFromStorage = () => {
    if (!isBrowser()) return;
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
};
