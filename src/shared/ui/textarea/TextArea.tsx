"use client";

import { forwardRef, useId } from "react";
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize";

export interface TextAreaProps extends TextareaAutosizeProps {
    label?: string;
    helperText?: string;
    error?: string;
}

const baseStyles =
    "block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 py-3 text-base text-[var(--color-text)] placeholder:text-[var(--color-muted)] shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition focus-visible:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-outline)] disabled:cursor-not-allowed disabled:opacity-60";

const errorStyles =
    "border-[var(--color-danger)] focus-visible:outline-[var(--color-danger-strong)] focus-visible:outline-offset-2";

const joinClasses = (...classes: Array<string | false | undefined>) =>
    classes.filter(Boolean).join(" ");

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        { label, helperText, error, className, id, minRows = 3, ...props },
        ref
    ) => {
        const generatedId = useId();
        const textareaId = id ?? generatedId;
        const helperId = helperText ? `${textareaId}-helper` : undefined;
        const errorId = error ? `${textareaId}-error` : undefined;
        const describedBy = error ? errorId : helperId;

        return (
            <div className="space-y-1.5 text-[var(--color-text)]">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-sm font-medium text-[var(--color-text)]"
                    >
                        {label}
                    </label>
                )}
                <TextareaAutosize
                    id={textareaId}
                    ref={ref}
                    minRows={minRows}
                    className={joinClasses(
                        baseStyles,
                        error && errorStyles,
                        className
                    )}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    {...props}
                />
                {error ? (
                    <p id={errorId} className="text-sm text-[var(--color-danger)]">
                        {error}
                    </p>
                ) : (
                    helperText && (
                        <p
                            id={helperId}
                            className="text-sm text-[var(--color-muted)]"
                        >
                            {helperText}
                        </p>
                    )
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";
