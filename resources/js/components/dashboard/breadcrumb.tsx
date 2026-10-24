import { Link } from '@inertiajs/react';
import { useDashboard } from '@/contexts/DashboardContext';
import type { DashboardSection } from '@/types';

const LABELS: Record<DashboardSection, string> = {
    resumen: 'Resumen',
    pedidos: 'Tus pedidos',
    direcciones: 'Tus direcciones',
    deseos: 'Lista de deseos',
    pagos: 'Métodos de pago',
    configuracion: 'Configuración',
};

export default function Breadcrumb() {
    const { section } = useDashboard();

    return (
        <nav
            aria-label="Ruta de navegación"
            className="mx-auto max-w-[1500px] px-4 pt-4 text-xs text-gray-600"
        >
            <ol className="flex flex-wrap items-center gap-1">
                <li>
                    <Link href="/" className="link-mk">
                        Inicio
                    </Link>
                </li>
                <li aria-hidden="true" className="text-gray-400">
                    ›
                </li>
                <li>
                    <Link href="/dashboard" className="link-mk">
                        Tu cuenta
                    </Link>
                </li>
                <li aria-hidden="true" className="text-gray-400">
                    ›
                </li>
                <li aria-current="page" className="font-semibold text-gray-900">
                    {LABELS[section]}
                </li>
            </ol>
        </nav>
    );
}
