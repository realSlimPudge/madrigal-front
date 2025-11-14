import { VideosList } from "@/widgets/VideosList";

export default function VideosPage() {
    return (
        <section className="flex min-h-screen flex-col gap-8 px-4 py-10 sm:px-6">
            <div className="w-full max-w-6xl mx-auto">
                <VideosList />
            </div>
        </section>
    );
}
