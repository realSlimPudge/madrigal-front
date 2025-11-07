import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "rounded";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
}

const baseStyles =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-gradient-to-br from-[var(--color-primary-from)] to-[var(--color-primary-to)] text-white hover:from-[var(--color-primary-hover-from)] hover:to-[var(--color-primary-hover-to)] focus-visible:outline-[var(--color-primary-outline)] disabled:from-[var(--color-primary-disabled)] disabled:to-[var(--color-primary-disabled)]",
    secondary:
        "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-border)] focus-visible:outline-[var(--color-muted)] disabled:bg-[color-mix(in_oklab,var(--color-surface),var(--color-muted))] disabled:text-[color-mix(in_oklab,var(--color-text),var(--color-muted))]",
    ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-ghost-hover)] focus-visible:outline-[var(--color-border)] disabled:text-[color-mix(in_oklab,var(--color-text),var(--color-muted))]",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
    rounded: "",
};

const joinClasses = (...classes: Array<string | false | undefined>) =>
    classes.filter(Boolean).join(" ");

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            fullWidth,
            loading,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled ?? loading;
        const composedClassName = joinClasses(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && "w-full",
            (isDisabled || loading) && "opacity-70",
            className
        );

        return (
            <button
                ref={ref}
                className={composedClassName}
                disabled={isDisabled}
                aria-busy={loading || undefined}
                {...props}
            >
                {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
