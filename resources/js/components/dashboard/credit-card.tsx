import type { PaymentMethod } from '@/types';

export default function CreditCard({
    method,
    onDefault,
    onDelete,
}: {
    method: PaymentMethod;
    onDefault: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex flex-col">
            <div
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${method.color} p-4 text-white shadow-lg`}
            >
                <div className="flex items-start justify-between">
                    <span className="text-lg font-black tracking-tight">
                        {method.brand === 'Mastercard' ? (
                            <span className="flex items-center gap-0.5">
                                <span className="size-5 rounded-full bg-red-500" />
                                <span className="-ml-2 size-5 rounded-full bg-yellow-400/90" />
                            </span>
                        ) : (
                            <span
                                className={
                                    method.brand === 'Visa' ? 'italic' : ''
                                }
                            >
                                {method.brand}
                            </span>
                        )}
                    </span>

                    {method.is_default && (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold backdrop-blur">
                            Predeterminada
                        </span>
                    )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <svg
                        viewBox="0 0 32 24"
                        className="h-6 w-8 text-yellow-200"
                        aria-hidden="true"
                    >
                        <rect
                            x="1"
                            y="1"
                            width="30"
                            height="22"
                            rx="4"
                            fill="currentColor"
                        />
                        <path
                            d="M1 8h30M1 16h30M10 1v22M22 1v22"
                            stroke="rgba(120,90,20,.35)"
                            strokeWidth="1.5"
                        />
                    </svg>
                    <span className="font-mono text-sm tracking-[0.18em] text-white/90">
                        •••• •••• •••• {method.last4}
                    </span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[8px] tracking-wider text-white/60 uppercase">
                            Titular
                        </p>
                        <p className="truncate text-[11px] font-semibold tracking-wide">
                            {method.holder}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] tracking-wider text-white/60 uppercase">
                            Vence
                        </p>
                        <p className="text-[11px] font-semibold">
                            {method.exp_label}
                        </p>
                    </div>
                </div>

                <span className="pointer-events-none absolute -right-8 -bottom-10 size-32 rounded-full bg-white/10" />
            </div>

            <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold">
                {!method.is_default && (
                    <button
                        type="button"
                        onClick={onDefault}
                        className="link-mk"
                    >
                        Predeterminar
                    </button>
                )}
                <button
                    type="button"
                    onClick={onDelete}
                    className="ml-auto text-amz-red hover:underline"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}
