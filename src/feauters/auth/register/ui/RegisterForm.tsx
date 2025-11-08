"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/shared/ui";
import { useLogin } from "../../login/model/useLogin";
import { useRegister } from "../model/useRegister";

export function RegisterForm() {
    const {
        register: registerUser,
        isLoading: isRegisterLoading,
        error: registerError,
    } = useRegister();
    const {
        login,
        isLoading: isLoginLoading,
        error: loginError,
    } = useLogin();

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await registerUser({ email, password });
            await login({ email, password });
            router.push("/");
        } catch {
            // Ошибки отображаются через registerError/loginError
        }
    };

    const submitDisabled =
        isRegisterLoading || isLoginLoading || !email || !password;

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
            {(registerError || loginError) && (
                <p className="text-sm text-[var(--color-danger)]">
                    {registerError?.message ||
                        loginError?.message ||
                        "Не удалось завершить регистрацию"}
                </p>
            )}
            <Button type="submit" disabled={submitDisabled} fullWidth>
                {isRegisterLoading || isLoginLoading
                    ? "Создаем..."
                    : "Зарегистрироваться"}
            </Button>
        </form>
    );
}
