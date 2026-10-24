import { Link } from '@inertiajs/react';
import { login } from '@/routes';

export default function LogoutScreen() {
    return (
        <div className="mk-body flex min-h-screen flex-col bg-amz-bg">
            <header className="bg-amz-dark px-4 py-4 text-white">
                <div className="mx-auto flex max-w-[1500px] items-center gap-2">
                    <Link
                        href="/"
                        className="text-2xl font-black tracking-tight"
                    >
                        MCE<span className="text-amz-orange">.com</span>
                    </Link>
                    <span className="text-[10px] font-semibold tracking-[0.18em] text-gray-300">
                        MIAMI CARACAS EXPRESS
                    </span>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm fade-in">
                    <span className="text-6xl" aria-hidden="true">
                        👋
                    </span>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                        Has cerrado sesión
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        Gracias por visitar Miami Caracas Express. Esperamos
                        verte de nuevo muy pronto para seguir encontrando las
                        mejores ofertas.
                    </p>
                    <Link
                        href={login()}
                        className="btn-cart mt-6 inline-flex h-10 items-center justify-center px-8 text-sm font-bold text-gray-900"
                    >
                        Volver a iniciar sesión
                    </Link>
                </div>
            </main>

            <footer className="bg-amz-navy py-4 text-center text-[11px] text-gray-300">
                © 2026 Miami Caracas Express · Hecho con cariño en Venezuela
            </footer>
        </div>
    );
}
