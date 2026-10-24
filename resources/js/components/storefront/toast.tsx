import { useToast } from '@/contexts/ToastContext';

export default function Toast() {
    const { toast } = useToast();

    if (!toast) {
        return null;
    }

    return (
        <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className="mk-fade-in-center fixed bottom-5 left-1/2 z-[120] flex max-w-[92vw] items-center gap-3 rounded-lg border border-white/10 bg-amz-dark px-5 py-3 text-sm font-medium text-white shadow-2xl"
        >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amz-green">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-4"
                    aria-hidden="true"
                >
                    <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="line-clamp-2">{toast.message}</span>
        </div>
    );
}
