import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function AuthButton({
    type = 'submit',
    variant = 'primary',
    loading = false,
    disabled = false,
    fullWidth = true,
    loadingLabel = 'Verificando...',
    onClick,
    children,
    className,
}: {
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    loadingLabel?: string;
    onClick?: () => void;
    children: ReactNode;
    className?: string;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-busy={loading}
            className={cn(
                'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition',
                variant === 'primary' ? 'btn-amazon' : 'btn-cart',
                fullWidth && 'w-full',
                'disabled:cursor-not-allowed disabled:opacity-60',
                className,
            )}
        >
            {loading && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4 animate-spin"
                    aria-hidden="true"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="3"
                    />
                    <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
            )}
            {loading ? loadingLabel : children}
        </button>
    );
}
