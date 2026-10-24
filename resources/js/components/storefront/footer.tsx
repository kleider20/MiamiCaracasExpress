import { useStorefront } from '@/contexts/StorefrontContext';

const COLUMNS = [
    {
        title: 'Conócenos',
        links: [
            'Acerca de Miami Caracas Express',
            'Empleos',
            'Sala de prensa',
            'Relación con inversionistas',
            'Dispositivos MCE',
            'Ciencia en MCE',
        ],
    },
    {
        title: 'Gana dinero con nosotros',
        links: [
            'Vende productos en MCE',
            'Vende en MCE Business',
            'Programa de afiliados',
            'Anuncia tus productos',
            'Publica tu libro',
            'MCE Pay',
        ],
    },
    {
        title: 'Métodos de pago',
        links: [
            'Tarjetas de crédito y débito',
            'Meses sin intereses',
            'Tarjetas de regalo',
            'Pago en OXXO',
            'Pago contra entrega',
            'MCE Cash',
        ],
    },
    {
        title: 'Ayuda',
        links: [
            'Mi cuenta',
            'Mis pedidos',
            'Envíos y entregas',
            'Devoluciones y reemplazos',
            'Centro de ayuda',
            'Contáctanos',
        ],
    },
];

export default function Footer() {
    const { scrollToProducts, selectCategory } = useStorefront();

    return (
        <footer className="mt-12 text-white">
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-amz-navy-light py-3 text-center text-sm font-medium transition hover:bg-[#485769]"
            >
                Volver arriba
            </button>

            <div className="bg-amz-navy">
                <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
                    {COLUMNS.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-sm font-bold text-white">
                                {column.title}
                            </h3>
                            <ul className="mt-3 space-y-2">
                                {column.links.map((link) => (
                                    <li key={link}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                column.title ===
                                                'Gana dinero con nosotros'
                                                    ? scrollToProducts()
                                                    : selectCategory('Todos')
                                            }
                                            className="text-left text-xs text-gray-300 transition hover:text-white hover:underline"
                                        >
                                            {link}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/15 bg-amz-navy">
                    <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:justify-between">
                        <a
                            href="/"
                            className="flex items-end text-2xl leading-none font-bold tracking-tight"
                        >
                            <span className="text-white">M</span>
                            <span className="text-amz-orange">CE</span>
                            <span className="text-white">.com</span>
                        </a>

                        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-300">
                            <span>🌐 Español (Venezuela)</span>
                            <span>💵 VES - Bolívares de Venezuela</span>
                            <span className="rounded border border-white/30 px-2 py-0.5">
                                🇻🇪 Venezuela
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-amz-dark">
                <div className="mx-auto max-w-[1200px] px-6 py-5">
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-gray-300">
                        <a href="#" className="hover:text-white hover:underline">
                            Condiciones de uso
                        </a>
                        <a href="#" className="hover:text-white hover:underline">
                            Aviso de privacidad
                        </a>
                        <a href="#" className="hover:text-white hover:underline">
                            Aviso de cookies
                        </a>
                        <a href="#" className="hover:text-white hover:underline">
                            Publicidad basada en intereses
                        </a>
                    </div>
                    <p className="mt-3 text-center text-[11px] text-gray-400">
                        © 2026 Miami Caracas Express, Inc. o sus afiliados.
                        Miami Caracas Express y el logotipo de MCE son marcas
                        registradas. Hecho con cariño en Venezuela por Kleider
                        Rosamilia.
                    </p>

                    <div className="mt-3 flex justify-center">
                        <a
                            href="https://github.com/kleider20"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub de Kleider Rosamilia"
                            title="GitHub de Kleider Rosamilia"
                            className="text-gray-400 transition hover:text-white"
                        >
                            <svg
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                                className="size-5 fill-current"
                            >
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
