import { useEffect } from 'react';
import { useStorefront } from '@/contexts/StorefrontContext';
import { cn } from '@/lib/utils';

const TRENDING = [
    { label: 'Ofertas del día', category: 'Ofertas' },
    { label: 'Los más vendidos', category: 'Todos' },
    { label: 'Novedades en Electrónica', category: 'Electrónica' },
    { label: 'Ideas para el hogar', category: 'Hogar' },
];

const DEPARTMENTS = [
    { label: 'Electrónica', category: 'Electrónica', emoji: '🎧' },
    { label: 'Hogar y Cocina', category: 'Hogar', emoji: '🏠' },
    { label: 'Moda', category: 'Moda', emoji: '👟' },
    { label: 'Deportes y Aire Libre', category: 'Deportes', emoji: '🏋️' },
    { label: 'Juguetes y Juegos', category: 'Juguetes', emoji: '🧱' },
];

export default function SideDrawer() {
    const {
        sideDrawerOpen,
        setSideDrawerOpen,
        selectCategory,
    } = useStorefront();

    useEffect(() => {
        if (!sideDrawerOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSideDrawerOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [sideDrawerOpen, setSideDrawerOpen]);

    return (
        <div
            aria-hidden={!sideDrawerOpen}
            className={cn(
                'fixed inset-0 z-[90]',
                sideDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none',
            )}
        >
            <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setSideDrawerOpen(false)}
                className={cn(
                    'absolute inset-0 bg-black/60 transition-opacity duration-300',
                    sideDrawerOpen ? 'opacity-100' : 'opacity-0',
                )}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Menú de categorías"
                className={cn(
                    'absolute top-0 left-0 flex h-full w-80 max-w-[88vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
                    sideDrawerOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex items-center justify-between bg-amz-navy px-4 py-3 text-white">
                    <div className="flex items-center gap-2 text-lg font-bold">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-7"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="8"
                                r="3.4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="M5 20c.7-3.8 3.4-5.8 7-5.8s6.3 2 7 5.8"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                        Hola, identifícate
                    </div>
                    <button
                        type="button"
                        onClick={() => setSideDrawerOpen(false)}
                        aria-label="Cerrar menú"
                        className="rounded-sm p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-6"
                            aria-hidden="true"
                        >
                            <path
                                d="m6 6 12 12M18 6 6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className="hide-scroll flex-1 overflow-y-auto px-5 py-4 text-gray-900">
                    <Section title="Tendencias">
                        {TRENDING.map((item) => (
                            <MenuLink
                                key={item.label}
                                onClick={() => selectCategory(item.category)}
                            >
                                {item.label}
                            </MenuLink>
                        ))}
                    </Section>

                    <div className="my-4 border-t border-gray-200" />

                    <Section title="Comprar por departamento">
                        {DEPARTMENTS.map((item) => (
                            <MenuLink
                                key={item.label}
                                emoji={item.emoji}
                                onClick={() => selectCategory(item.category)}
                            >
                                {item.label}
                            </MenuLink>
                        ))}
                    </Section>

                    <div className="my-4 border-t border-gray-200" />

                    <Section title="Ayuda">
                        <MenuLink onClick={() => setSideDrawerOpen(false)}>
                            Atención al cliente
                        </MenuLink>
                        <MenuLink onClick={() => setSideDrawerOpen(false)}>
                            Devoluciones y reemplazos
                        </MenuLink>
                        <MenuLink onClick={() => setSideDrawerOpen(false)}>
                            Envíos y entregas
                        </MenuLink>
                        <MenuLink onClick={() => setSideDrawerOpen(false)}>
                            Métodos de pago
                        </MenuLink>
                    </Section>

                    <div className="mt-6 rounded-lg bg-amz-bg p-3 text-xs text-gray-600">
                        Compra protegida de la A a la Z. Miles de productos con
                        envío gratis y devoluciones sin complicaciones.
                    </div>
                </div>
            </aside>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="mb-1 px-2 text-base font-bold text-gray-900">
                {title}
            </h3>
            <ul className="space-y-0.5">{children}</ul>
        </div>
    );
}

function MenuLink({
    children,
    emoji,
    onClick,
}: {
    children: React.ReactNode;
    emoji?: string;
    onClick: () => void;
}) {
    return (
        <li>
            <button
                type="button"
                onClick={onClick}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-gray-800 transition hover:bg-gray-100 hover:text-amz-link-hover"
            >
                {emoji ? <span aria-hidden="true">{emoji}</span> : null}
                <span>{children}</span>
            </button>
        </li>
    );
}
