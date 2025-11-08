"use client";

import { VideoDetailsPage } from "@/pagesFSD/videos";
import { useParams } from "next/navigation";

export default function VideoDetailsRoute() {
    const params = useParams<{ id: string }>();
    const id = params?.id;

    if (!id) {
        return null;
    }

    return <VideoDetailsPage id={id} />;
}
