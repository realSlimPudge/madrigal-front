"use client";

import useSWRMutation from "swr/mutation";
import {
    createVideo,
    type CreateVideoDto,
    type CreateVideoResponse,
} from "../api/createVideo";

const createVideoFetcher = async (
    _: string,
    { arg }: { arg: CreateVideoDto }
): Promise<CreateVideoResponse> => {
    return await createVideo(arg);
};

export const useCreateVideo = () => {
    const { trigger, data, error, isMutating } = useSWRMutation<
        CreateVideoResponse,
        Error,
        string,
        CreateVideoDto
    >("videos/create", createVideoFetcher);

    return {
        createVideo: trigger,
        data,
        error,
        isLoading: isMutating,
    };
};
