"use client";

import { Button } from "@/shared/ui";
import { PanelLeftClose, PanelRightOpen, Plus } from "lucide-react";
import { useSidebarStore } from "../model/sidebarStore";

export default function SideBar() {
    const { open, toggleSidebar } = useSidebarStore();

    return (
        <>
            <Button
                onClick={toggleSidebar}
                size="rounded"
                variant="ghost"
                className={`fixed left-4 top-4 z-40 h-12 w-12 shadow-lg transition-all duration-300 ease-out ${
                    open
                        ? "pointer-events-none -translate-x-2 opacity-0"
                        : "pointer-events-auto translate-x-0 opacity-100"
                }`}
            >
                <PanelRightOpen size={22} />
            </Button>

            <aside
                className={`${
                    open
                        ? "w-[var(--sidebar-open)] translate-x-0 opacity-100 pointer-events-auto border-[var(--color-border)]"
                        : "w-0 -translate-x-full opacity-0 pointer-events-none border-transparent"
                } h-screen shrink-0 overflow-hidden border-r bg-[var(--color-surface)] p-3 transition-all duration-300 ease-out flex flex-col`}
            >
                <div className="flex justify-between">
                    <Button
                        size="rounded"
                        variant="primary"
                        className="w-[70%]"
                    >
                        New chat
                        <Plus size={20} />
                    </Button>
                    <Button
                        onClick={toggleSidebar}
                        size="rounded"
                        className="p-2 w-12 h-12"
                        variant="ghost"
                        aria-label="Закрыть боковую панель"
                    >
                        <PanelLeftClose size={24} />
                    </Button>
                </div>
            </aside>
        </>
    );
}
