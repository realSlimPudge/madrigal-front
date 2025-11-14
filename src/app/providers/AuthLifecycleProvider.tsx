"use client";

import { ReactNode, useEffect } from "react";
import { useAuthUserStore } from "@/entities/user";

interface AuthLifecycleProviderProps {
    children: ReactNode;
}

export function AuthLifecycleProvider({ children }: AuthLifecycleProviderProps) {
    const hydrate = useAuthUserStore((state) => state.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return children;
}
