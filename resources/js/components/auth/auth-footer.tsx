const footerLinks = [
    'Condiciones de uso',
    'Aviso de privacidad',
    'Ayuda',
    'Cookies',
];

export default function AuthFooter() {
    return (
        <footer className="mt-auto bg-amz-navy text-white">
            <div className="border-b border-white/10">
                <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 text-xs text-gray-300">
                    {footerLinks.map((link) => (
                        <a
                            key={link}
                            href="#"
                            className="transition hover:text-white hover:underline"
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>

            <div className="mx-auto w-full max-w-5xl px-4 py-4 text-center text-[11px] leading-5 text-gray-400">
                © 2026 Miami Caracas Express (MCE) — Demo inspirada en Amazon.
                Hecho con fines educativos.
            </div>
        </footer>
    );
}
