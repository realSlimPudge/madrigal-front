import { VideosList } from "@/widgets/VideosList";

export default function VideosPage() {
    return (
        <section className="flex min-h-screen flex-col gap-8 px-4 py-10">
            <VideosList />
        </section>
    );
}
