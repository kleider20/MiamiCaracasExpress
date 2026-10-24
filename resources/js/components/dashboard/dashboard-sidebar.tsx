import { useDashboard } from '@/contexts/DashboardContext';
import { cn } from '@/lib/utils';
import type { DashboardSection, DashboardUser } from '@/types';

const ITEMS: Array<{
    id: DashboardSection;
    label: string;
    emoji: string;
    description: string;
}> = [
    {
        id: 'resumen',
        label: 'Resumen',
        emoji: '🏠',
        description: 'Tu actividad reciente',
    },
    {
        id: 'pedidos',
        label: 'Tus pedidos',
        emoji: '📦',
        description: 'Historial y seguimiento',
    },
    {
        id: 'direcciones',
        label: 'Tus direcciones',
        emoji: '📍',
        description: 'Envíos y contactos',
    },
    {
        id: 'deseos',
        label: 'Lista de deseos',
        emoji: '❤️',
        description: 'Productos guardados',
    },
    {
        id: 'pagos',
        label: 'Métodos de pago',
        emoji: '💳',
        description: 'Tarjetas y seguridad',
    },
    {
        id: 'configuracion',
        label: 'Configuración',
        emoji: '⚙️',
        description: 'Datos y acceso',
    },
];

export default function DashboardSidebar({ user }: { user: DashboardUser }) {
    const { section, setSection, logout } = useDashboard();

    return (
        <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-32 space-y-4">
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <h2 className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-base font-bold text-gray-900">
                        Tu cuenta
                    </h2>

                    <nav aria-label="Secciones de tu cuenta">
                        {ITEMS.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setSection(item.id)}
                                aria-current={
                                    section === item.id ? 'page' : undefined
                                }
                                className={cn(
                                    'nav-item block w-full px-4 py-2.5 text-left text-sm text-gray-700',
                                    section === item.id && 'active',
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <span aria-hidden="true">{item.emoji}</span>
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </span>
                                <span className="mt-0.5 block pl-6 text-[11px] text-gray-500">
                                    {item.description}
                                </span>
                            </button>
                        ))}
                    </nav>

                    <div className="border-t border-gray-200 p-3">
                        <button
                            type="button"
                            onClick={() => void logout()}
                            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-amz-link hover:text-amz-link"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="size-4"
                                aria-hidden="true"
                            >
                                <path
                                    d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 8l-4 4 4 4M6 12h9"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Cerrar sesión
                        </button>
                    </div>
                </div>

                <div className="hero-grad rounded-lg p-4 text-white shadow-sm">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black italic">prime</span>
                        <span className="text-[10px] font-semibold text-amz-prime">
                            MCE
                        </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-gray-200">
                        Miembro desde {user.member_since ?? 'tu primera compra'}
                        .
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-amz-orange">
                        Envíos gratis en miles de productos
                    </p>
                </div>
            </div>
        </aside>
    );
}
