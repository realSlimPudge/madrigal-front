"use client";

import useSWRMutation from "swr/mutation";
import { uploadMedia, type UploadMediaDto } from "../api/media";

export const useUploadMedia = () => {
    const { trigger, isMutating, error } = useSWRMutation("media/upload", (
        _: string,
        { arg }: { arg: UploadMediaDto }
    ) => uploadMedia(arg));

    return {
        uploadMedia: trigger,
        isLoading: isMutating,
        error,
    };
};
