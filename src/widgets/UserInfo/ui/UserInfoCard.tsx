"use client";

import { useEffect } from "react";
import { useAuthUserStore } from "@/entities/user";
import { Button } from "@/shared/ui";
import { useLogout } from "@/feauters/auth/logout/model/useLogout";
import { LogOut } from "lucide-react";

export function UserInfoCard() {
    const user = useAuthUserStore((state) => state.user);
    const hydrate = useAuthUserStore((state) => state.hydrate);
    const { logout, isLoading, error } = useLogout();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // ошибки покажем ниже
        }
    };

    if (!user) {
        return (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-transparent p-4 text-sm text-[var(--color-muted)]">
                Не выполнен вход
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/60 p-4 text-sm text-[var(--color-text)] space-y-3">
            <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                    Вы вошли как
                </p>
                <p className="mt-1 font-semibold break-all">{user.email}</p>
            </div>
            <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full"
                onClick={handleLogout}
                disabled={isLoading}
            >
                {isLoading ? "Выходим..." : "Выйти"}
                <LogOut size={16} />
            </Button>
            {error && (
                <p className="text-xs text-[var(--color-danger)]">
                    {error.message || "Не удалось выйти"}
                </p>
            )}
        </div>
    );
}
