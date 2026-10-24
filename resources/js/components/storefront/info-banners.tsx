import { money } from '@/lib/format';

const BENEFITS = [
    {
        icon: '🚚',
        title: 'Envío gratis',
        text: `En compras mayores a ${money(599)}`,
        accent: 'bg-blue-50',
    },
    {
        icon: '↩️',
        title: 'Devoluciones gratis',
        text: 'Tienes 30 días para cambiarlo',
        accent: 'bg-emerald-50',
    },
    {
        icon: '🔒',
        title: 'Pago seguro',
        text: 'Tus datos siempre protegidos',
        accent: 'bg-amber-50',
    },
    {
        icon: '💬',
        title: 'Soporte 24/7',
        text: 'Estamos aquí para ayudarte',
        accent: 'bg-purple-50',
    },
];

export default function InfoBanners() {
    return (
        <section
            aria-label="Beneficios de comprar en Miami Caracas Express"
            className="mx-auto mt-8 max-w-[1500px] px-4"
        >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {BENEFITS.map((benefit) => (
                    <article
                        key={benefit.title}
                        className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <span
                            className={`flex size-14 shrink-0 items-center justify-center rounded-full text-3xl ${benefit.accent}`}
                            aria-hidden="true"
                        >
                            {benefit.icon}
                        </span>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                {benefit.title}
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-600">
                                {benefit.text}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
