import Link from "next/link";
import { LoginForm } from "@/feauters/auth/login/ui/LoginForm";
import { RegisterForm } from "@/feauters/auth/register/ui/RegisterForm";

type AuthWidgetMode = "login" | "register";

interface AuthWidgetProps {
    mode?: AuthWidgetMode;
}

const titles: Record<AuthWidgetMode, string> = {
    login: "Вход в аккаунт",
    register: "Регистрация",
};

const descriptions: Record<AuthWidgetMode, string> = {
    login: "Используйте email и пароль, чтобы продолжить",
    register: "Создайте аккаунт, указав email и пароль",
};

const linkMeta: Record<
    AuthWidgetMode,
    { hint: string; action: string; href: string }
> = {
    login: {
        hint: "Еще нет аккаунта?",
        action: "Зарегистрируйтесь",
        href: "/register",
    },
    register: {
        hint: "Уже есть аккаунт?",
        action: "Войдите",
        href: "/login",
    },
};

export default function AuthWidget({ mode = "login" }: AuthWidgetProps) {
    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="space-y-1 text-center">
                <h1 className="text-2xl font-semibold">{titles[mode]}</h1>
                <p className="text-sm text-[var(--color-muted)]">
                    {descriptions[mode]}
                </p>
            </div>
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
            <p className="text-center text-sm text-[var(--color-muted)]">
                {linkMeta[mode].hint}{" "}
                <Link
                    href={linkMeta[mode].href}
                    className="font-medium text-[var(--color-text)] underline-offset-4 hover:underline"
                >
                    {linkMeta[mode].action}
                </Link>
            </p>
        </div>
    );
}
