import { VideoDetails } from "@/widgets/VideoDetails";

interface VideoDetailsPageProps {
    id: string;
}

export default function VideoDetailsPage({ id }: VideoDetailsPageProps) {
    return (
        <section className="flex min-h-screen flex-col gap-8 px-4 py-10 sm:px-6 lg:px-12">
            <div className="w-full max-w-6xl mx-auto">
                <VideoDetails id={id} />
            </div>
        </section>
    );
}
