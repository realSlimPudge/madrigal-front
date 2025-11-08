"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { UserInfoCard } from "@/widgets/UserInfo";
import { PanelRightOpen, PanelLeftOpen, Plus } from "lucide-react";
import { useSidebarStore } from "../model/sidebarStore";

const toggleButtonBase =
    "fixed top-6 z-40 h-11 w-11 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xl transition-all duration-300 ease-out";

const navItems = [
    { href: "/", label: "Главная" },
    { href: "/videos", label: "Видео" },
];

export default function SideBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { open, toggleSidebar } = useSidebarStore();

    const handleCreateVideo = () => {
        router.push("/create");
    };

    return (
        <>
            <Button
                onClick={toggleSidebar}
                size="rounded"
                variant="ghost"
                aria-label={open ? "Скрыть сайдбар" : "Открыть сайдбар"}
                className={`${toggleButtonBase} left-0 ${
                    open
                        ? "translate-x-[calc(var(--sidebar-open)+1rem)]"
                        : "translate-x-4"
                }`}
            >
                {open ? (
                    <PanelLeftOpen size={22} />
                ) : (
                    <PanelRightOpen size={22} />
                )}
            </Button>

            <div
                className={`relative shrink-0 overflow-visible transition-[width] duration-300 ease-in-out ${
                    open ? "w-[var(--sidebar-open)]" : "w-0"
                }`}
            >
                <aside
                    className={`${
                        open
                            ? "translate-x-0 opacity-100 pointer-events-auto border-[var(--color-border)]"
                            : "-translate-x-full opacity-0 pointer-events-none border-transparent"
                    } fixed left-0 top-0 z-30 h-screen w-[var(--sidebar-open)] overflow-hidden border-r bg-[var(--color-surface)] p-4 transition-[transform,opacity] duration-300 ease-in-out flex flex-col gap-4`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <Button
                            size="lg"
                            variant="primary"
                            className="flex-1"
                            onClick={handleCreateVideo}
                        >
                            Создать видео
                            <Plus size={20} />
                        </Button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                                    pathname === item.href
                                        ? "border-[var(--color-text)] bg-[var(--color-text)]/10 text-[var(--color-text)]"
                                        : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-border)]/30"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <UserInfoCard />
                </aside>
            </div>
        </>
    );
}
