"use client";

import useSWRMutation from "swr/mutation";
import { approveDraft, type ApproveDraftDto } from "../api/approveDraft";

interface TriggerArgs {
    videoId: string;
    payload: ApproveDraftDto;
}

const approveFetcher = async (
    key: readonly [string, string, string],
    { arg }: { arg: TriggerArgs }
) => {
    return approveDraft(arg.videoId, arg.payload);
};

export const useApproveDraft = (videoId: string) => {
    const { trigger, error, isMutating } = useSWRMutation<
        unknown,
        Error,
        readonly [string, string, string],
        TriggerArgs
    >(["video", videoId, "draft"], approveFetcher);

    const submit = (payload: ApproveDraftDto) =>
        trigger({ videoId, payload });

    return {
        approveDraft: submit,
        error,
        isLoading: isMutating,
    };
};
