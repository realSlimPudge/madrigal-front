"use client";

import { ReactNode, useEffect } from "react";
import { useAutoRefresh } from "@/feauters/auth/refresh/model/useAutoRefresh";
import { useAuthUserStore } from "@/entities/user";

interface AuthLifecycleProviderProps {
    children: ReactNode;
}

export function AuthLifecycleProvider({ children }: AuthLifecycleProviderProps) {
    useAutoRefresh();
    const hydrate = useAuthUserStore((state) => state.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return children;
}
