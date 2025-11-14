import type { LucideIcon } from "lucide-react";
import { Home, Film } from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const navItems: NavItem[] = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/videos", label: "Видео", icon: Film },
];
