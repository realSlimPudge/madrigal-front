"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { UserInfoCard } from "@/widgets/UserInfo";
import { PanelRightOpen, Plus } from "lucide-react";
import { useSidebarStore } from "../model/sidebarStore";
import { NavigationMenu } from "./NavigationMenu";

const toggleButtonBase =
    "fixed top-6 z-50 h-11 w-11 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-xl transition-all duration-300 ease-out";

export default function SideBar() {
    const router = useRouter();
    const { open, toggleSidebar, closeSidebar } = useSidebarStore();

    const handleCreateVideo = () => {
        router.push("/create");
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    };

    return (
        <>
            <Button
                onClick={toggleSidebar}
                size="rounded"
                variant="ghost"
                aria-label={open ? "Скрыть сайдбар" : "Открыть сайдбар"}
                className={`${toggleButtonBase} left-0  md:left-0 max-md:left-auto max-md:right-4 ${
                    open
                        ? "md:translate-x-[calc(var(--sidebar-open)+1rem)]"
                        : "md:translate-x-4"
                } max-md:translate-x-0 max-md:opacity-${open ? "0" : "100"}`}
            >
                <PanelRightOpen size={22} />
            </Button>

            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <div
                className={`relative shrink-0 overflow-visible transition-[width] duration-300 ease-in-out ${
                    open ? "w-[var(--sidebar-open)]" : "w-0"
                } max-md:w-0`}
            >
                <aside
                    className={`${
                        open
                            ? "translate-x-0 opacity-100 pointer-events-auto border-[var(--color-border)]"
                            : "-translate-x-full opacity-0 pointer-events-none border-transparent"
                    } fixed left-0 top-0 z-40 h-screen w-[var(--sidebar-open)] overflow-hidden border-r bg-[var(--color-surface)] p-4 transition-[transform,opacity] duration-300 ease-in-out flex flex-col gap-4 max-md:w-[min(90vw,320px)]`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <Button
                            size="lg"
                            variant="primary"
                            className="flex-1 feature-font"
                            onClick={handleCreateVideo}
                        >
                            Создать видео
                            <Plus size={20} />
                        </Button>
                    </div>

                    <NavigationMenu />

                    <UserInfoCard />
                </aside>
            </div>
        </>
    );
}
