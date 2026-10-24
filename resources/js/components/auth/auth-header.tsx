import { Link } from '@inertiajs/react';
import { home, login } from '@/routes';

export default function AuthHeader() {
    return (
        <header className="hero-grad">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
                <Link
                    href={login()}
                    aria-label="Miami Caracas Express, ir a iniciar sesión"
                    className="flex items-center text-white"
                >
                    <span className="flex flex-col leading-none">
                        <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                            M<span className="text-amz-orange">CE</span>
                        </span>
                        <span className="mt-1 text-[9px] font-medium tracking-[0.14em] text-white/70 uppercase sm:text-[10px]">
                            Miami Caracas Express
                        </span>
                    </span>
                </Link>

                <Link
                    href={home()}
                    className="hidden items-center gap-2 rounded-md border border-white/25 px-3 py-1.5 text-sm font-medium text-white/90 transition hover:border-white/60 hover:bg-white/10 sm:inline-flex"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-4"
                        aria-hidden="true"
                    >
                        <path
                            d="M15 5l-7 7 7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Volver a la tienda
                </Link>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-2 text-[11px] text-white/70 sm:px-6">
                    <p>
                        Envíos gratis en miles de productos y ofertas todos los
                        días.
                    </p>
                    <p className="hidden items-center gap-1.5 sm:flex">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-3.5"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 3l7 3v5c0 4.4-2.9 8.4-7 9.5C7.9 19.4 5 15.4 5 11V6l7-3Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                            <path
                                d="m9 12 2 2 4-4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Conexión segura
                    </p>
                </div>
            </div>
        </header>
    );
}
