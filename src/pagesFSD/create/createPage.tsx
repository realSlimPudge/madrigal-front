import { ChatForm } from "@/widgets/ChatForm";

export default function CreatePage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(3,105,161,0.2),_transparent_45%),_radial-gradient(circle_at_20%_20%,_rgba(192,38,211,0.22),_transparent_55%),_#05060a]">
            <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -left-10 top-24 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-sky-500/30 blur-3xl" />
                <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/20 to-purple-600/30 blur-[120px]" />
            </div>

            <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
                <header className="space-y-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-muted)]">
                        Studio Madrigal
                    </p>
                    <div className="space-y-4">
                        <h1 className="max-w-3xl text-3xl font-medium tracking-tight text-white sm:text-5xl">
                            Создайте новое видео и наблюдайте за генерацией на
                            каждом этапе
                        </h1>
                        <p className="max-w-2xl text-base text-[var(--color-muted)] sm:text-lg">
                            Настройте идею, стиль и звучание: система построит
                            сценарий, позволит внести правки и проводит вас от
                            черновика до готового вертикального ролика.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
                        <div className="rounded-full border border-white/10 px-4 py-1">
                            Реактивные шаги генерации
                        </div>
                        <div className="rounded-full border border-white/10 px-4 py-1">
                            Редактирование сценария и субтитров
                        </div>
                        <div className="rounded-full border border-white/10 px-4 py-1">
                            Голоса ElevenLabs
                        </div>
                    </div>
                </header>

                <ChatForm />
            </section>
        </div>
    );
}
