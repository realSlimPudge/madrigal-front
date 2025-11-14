"use client";

import useSWRMutation from "swr/mutation";
import { uploadVideoMedia } from "../api/media";

export const useUploadVideo = () => {
    const { trigger, isMutating, error } = useSWRMutation(
        "media/upload/video",
        (
            _: string,
            { arg }: { arg: { folder: string; file: File } }
        ) => uploadVideoMedia(arg.folder, arg.file)
    );

    return {
        uploadVideo: trigger,
        isLoading: isMutating,
        error,
    };
};
