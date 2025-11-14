"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "../model/sidebarStore";
import { navItems } from "../model/navItems";

export function NavigationMenu() {
    const pathname = usePathname();
    const closeSidebar = useSidebarStore((state) => state.closeSidebar);

    return (
        <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                            if (window.innerWidth < 768) {
                                closeSidebar();
                            }
                        }}
                        className={`flex items-center gap-3 rounded-3xl  px-4 py-2 text-sm font-medium transition ${
                            active
                                ? "bg-[var(--color-text)]/10 text-[var(--color-text)]"
                                : "text-[var(--color-muted)]  hover:bg-[var(--color-border)]/30"
                        }`}
                    >
                        <Icon size={18} />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
