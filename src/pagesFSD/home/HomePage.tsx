import Link from "next/link";
import { Button } from "@/shared/ui";

const features = [
    {
        title: "Генерация по промтам",
        description:
            "Опиши идею несколькими предложениями — мы соберём сюжет, раскадровку и видеоряд автоматически.",
    },
    {
        title: "Голоса и звук",
        description:
            "Встроенные голосовые профили и саундтреки позволяют озвучить ролик без сторонних сервисов.",
    },
    {
        title: "Экспорт за секунды",
        description:
            "Готовое видео можно скачать или отправить в соцсети сразу после генерации.",
    },
];

export default function HomePage() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center sm:items-start sm:text-left">
                <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-muted)]">
                    Madrigal Studio
                </p>
                <h1 className="feature-font text-4xl font-bold leading-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
                    Создавайте вертикальные видео с помощью AI за минуты
                </h1>
                <p className="max-w-2xl text-base text-[var(--color-muted)] sm:text-lg">
                    Простой бриф на русском или английском превращается в клип с
                    титрами, озвучкой и музыкой. Никаких монтажных программ —
                    только описание идеи.
                </p>
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    <Link href="/create">
                        <Button size="lg" className="feature-font text-base">
                            Создать видео
                        </Button>
                    </Link>
                    <Link href="/videos">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="feature-font text-base"
                        >
                            Смотреть галерею
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-center sm:justify-between sm:px-14  w-full flex-wrap gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 sm:gap-10">
                    <div>
                        <p className="feature-font text-3xl font-semibold">
                            10+
                        </p>
                        <p className="text-sm text-[var(--color-muted)]">
                            шаблонов истории и сценариев
                        </p>
                    </div>
                    <div>
                        <p className="feature-font text-3xl font-semibold">
                            60 сек
                        </p>
                        <p className="text-sm text-[var(--color-muted)]">
                            максимальная длительность ролика
                        </p>
                    </div>
                    <div>
                        <p className="feature-font text-3xl font-semibold">∞</p>
                        <p className="text-sm text-[var(--color-muted)]">
                            количество генерируемых видео
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-6 text-left"
                    >
                        <h3 className="text-xl font-semibold text-[var(--color-text)]">
                            {feature.title}
                        </h3>
                        <p className="mt-3 text-sm text-[var(--color-muted)]">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
}
