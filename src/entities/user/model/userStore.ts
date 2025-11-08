"use client";

import { create } from "zustand";
import type { User } from "../types/types";
import {
    loadUserFromStorage,
    saveUserToStorage,
    clearUserFromStorage,
} from "@/shared/lib/userStorage";

interface AuthUserState {
    user: User | null;
    setUser: (user: User | null) => void;
    hydrate: () => void;
}

export const useAuthUserStore = create<AuthUserState>((set) => ({
    user: null,
    setUser: (user) =>
        set(() => {
            if (user) {
                saveUserToStorage(user);
            } else {
                clearUserFromStorage();
            }
            return { user };
        }),
    hydrate: () =>
        set(() => ({
            user: loadUserFromStorage(),
        })),
}));
