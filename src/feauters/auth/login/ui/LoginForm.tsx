"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/shared/ui";
import { useLogin } from "../model/useLogin";

export function LoginForm() {
    const { login, isLoading, error } = useLogin();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await login({ email, password });
            router.push("/");
        } catch {
            // Ошибка отображается через error state
        }
    };

    const submitDisabled = isLoading || !email || !password;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
            <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
            />
            {error && (
                <p className="text-sm text-[var(--color-danger)]">
                    {error.message || "Не удалось выполнить вход"}
                </p>
            )}
            <Button type="submit" disabled={submitDisabled} fullWidth>
                {isLoading ? "Входим..." : "Войти"}
            </Button>
        </form>
    );
}
