import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./styles/globals.css";
import { SideBar } from "@/widgets/Sidebar";
import { AuthLifecycleProvider } from "@/app/providers/AuthLifecycleProvider";

const calmFont = Inter({
    variable: "--font-body",
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const highlightFont = JetBrains_Mono({
    variable: "--font-highlight",
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Video generate",
    description: "AI video generate",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body
                className={`${calmFont.variable} ${highlightFont.variable} flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] antialiased overflow-x-hidden`}
            >
                <AuthLifecycleProvider>
                    <SideBar />
                    <main className="flex-1 min-h-screen transition-[width] duration-300 ease-out">
                        {children}
                    </main>
                </AuthLifecycleProvider>
            </body>
        </html>
    );
}
