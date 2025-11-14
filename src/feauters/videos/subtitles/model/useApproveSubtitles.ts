"use client";

import useSWRMutation from "swr/mutation";
import {
    approveSubtitles,
    type ApproveSubtitlesDto,
} from "../api/approveSubtitles";

interface TriggerArgs {
    videoId: string;
    payload: ApproveSubtitlesDto;
}

const subtitlesFetcher = async (
    _key: readonly [string, string, string],
    { arg }: { arg: TriggerArgs }
) => {
    return approveSubtitles(arg.videoId, arg.payload);
};

export const useApproveSubtitles = (videoId: string) => {
    const { trigger, error, isMutating } = useSWRMutation<
        unknown,
        Error,
        readonly [string, string, string],
        TriggerArgs
    >(["video", videoId, "subtitles"], subtitlesFetcher);

    const submit = (payload: ApproveSubtitlesDto) =>
        trigger({ videoId, payload });

    return {
        approveSubtitles: submit,
        error,
        isLoading: isMutating,
    };
};
