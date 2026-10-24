const benefits = [
    'Seguimiento de tus pedidos en tiempo real',
    'Ofertas exclusivas para miembros',
    'Envíos gratis y entregas más rápidas',
    'Listas de deseos y recomendaciones',
];

export default function BenefitsCard() {
    return (
        <aside className="card mt-5 hidden rounded-lg border border-gray-300 bg-white p-5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.08)] lg:block">
            <h2 className="text-base font-bold text-gray-900">
                ¿Por qué crear una cuenta?
            </h2>

            <ul className="mt-3 space-y-2.5 text-gray-700">
                {benefits.map((benefit, index) => (
                    <li key={benefit} className="flex items-start gap-2">
                        {index === 2 ? (
                            <span className="prime-tag mt-0.5 shrink-0 text-xs">
                                prime
                            </span>
                        ) : (
                            <span
                                aria-hidden="true"
                                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#e7f4e4] text-amz-green"
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="size-2.5"
                                >
                                    <path
                                        d="m3 8.5 3 3 7-7"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        )}
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
