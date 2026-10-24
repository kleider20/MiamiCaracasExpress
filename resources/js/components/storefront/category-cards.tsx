import { useStorefront } from '@/contexts/StorefrontContext';
import { useToast } from '@/contexts/ToastContext';

export default function CategoryCards() {
    const { selectCategory } = useStorefront();
    const { showToast } = useToast();

    return (
        <section
            aria-label="Comprar por categoría"
            className="relative z-10 mx-auto -mt-10 max-w-[1500px] px-4 md:-mt-16"
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="flex flex-col rounded-lg bg-white p-5 shadow-md transition-shadow hover:shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900">
                        Ofertas en Electrónica
                    </h3>
                    <div className="mt-3 grid flex-1 grid-cols-2 gap-2">
                        {[
                            { emoji: '🎧', label: 'Audio' },
                            { emoji: '⌚', label: 'Wearables' },
                            { emoji: '💻', label: 'Laptops' },
                            { emoji: '🎮', label: 'Gaming' },
                        ].map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => selectCategory('Electrónica')}
                                className="group flex flex-col items-center justify-center rounded-md bg-gray-100 px-2 py-3 transition hover:bg-gray-200"
                            >
                                <span
                                    className="text-4xl transition-transform group-hover:scale-110"
                                    aria-hidden="true"
                                >
                                    {item.emoji}
                                </span>
                                <span className="mt-1 text-[11px] font-medium text-gray-700">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => selectCategory('Electrónica')}
                        className="mt-4 text-left text-sm font-medium text-amz-link hover:text-amz-link-hover hover:underline"
                    >
                        Ver más
                    </button>
                </article>

                <article className="flex flex-col rounded-lg bg-white p-5 shadow-md transition-shadow hover:shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900">
                        Productos para el hogar
                    </h3>
                    <button
                        type="button"
                        onClick={() => selectCategory('Hogar')}
                        className="mt-3 flex flex-1 items-center justify-center rounded-md bg-[#f5efe6] p-2"
                        aria-label="Ver productos para el hogar"
                    >
                        <svg
                            viewBox="0 0 260 160"
                            className="h-32 w-full"
                            role="img"
                            aria-label="Utensilios de cocina"
                        >
                            <rect
                                x="36"
                                y="54"
                                width="82"
                                height="60"
                                rx="12"
                                fill="#d97706"
                            />
                            <rect
                                x="44"
                                y="46"
                                width="66"
                                height="14"
                                rx="7"
                                fill="#92400e"
                            />
                            <path
                                d="M118 70h14c10 0 16 7 16 15s-6 15-16 15h-14"
                                stroke="#92400e"
                                strokeWidth="6"
                                fill="none"
                            />
                            <path
                                d="M56 45c0-10 8-17 18-17s18 7 18 17"
                                stroke="#78350f"
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                                opacity=".35"
                            />
                            <ellipse
                                cx="182"
                                cy="99"
                                rx="46"
                                ry="15"
                                fill="#1f2937"
                            />
                            <path
                                d="M140 96h84l-8-30h-68l-8 30Z"
                                fill="#374151"
                            />
                            <path
                                d="M214 66h14c6 0 10 4 10 9s-4 9-10 9h-14"
                                stroke="#111827"
                                strokeWidth="5"
                                fill="none"
                            />
                            <circle cx="166" cy="76" r="5" fill="#fbbf24" />
                            <circle cx="188" cy="76" r="5" fill="#fbbf24" />
                            <circle cx="210" cy="76" r="5" fill="#fbbf24" />
                            <rect
                                x="90"
                                y="122"
                                width="82"
                                height="8"
                                rx="4"
                                fill="#d1d5db"
                            />
                            <rect
                                x="38"
                                y="122"
                                width="76"
                                height="8"
                                rx="4"
                                fill="#d1d5db"
                            />
                            <circle
                                cx="180"
                                cy="44"
                                r="6"
                                fill="#f59e0b"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => selectCategory('Hogar')}
                        className="mt-4 text-left text-sm font-medium text-amz-link hover:text-amz-link-hover hover:underline"
                    >
                        Ver más
                    </button>
                </article>

                <article className="flex flex-col rounded-lg bg-white p-5 shadow-md transition-shadow hover:shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900">
                        Moda para todos
                    </h3>
                    <div className="mt-3 grid flex-1 grid-cols-2 gap-2">
                        {[
                            { emoji: '👟', label: 'Calzado' },
                            { emoji: '🧥', label: 'Chamarras' },
                            { emoji: '👜', label: 'Bolsos' },
                            { emoji: '🕶️', label: 'Accesorios' },
                        ].map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => selectCategory('Moda')}
                                className="group flex flex-col items-center justify-center rounded-md bg-gray-100 px-2 py-3 transition hover:bg-gray-200"
                            >
                                <span
                                    className="text-4xl transition-transform group-hover:scale-110"
                                    aria-hidden="true"
                                >
                                    {item.emoji}
                                </span>
                                <span className="mt-1 text-[11px] font-medium text-gray-700">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => selectCategory('Moda')}
                        className="mt-4 text-left text-sm font-medium text-amz-link hover:text-amz-link-hover hover:underline"
                    >
                        Ver más
                    </button>
                </article>

                <article className="flex flex-col rounded-lg bg-amz-navy p-5 text-white shadow-md transition-shadow hover:shadow-xl">
                    <h3 className="text-xl font-bold">Sé miembro Prime</h3>
                    <div className="flex flex-1 flex-col items-center justify-center py-4">
                        <div className="flex items-end gap-1">
                            <span className="text-4xl leading-none font-black tracking-tight text-amz-prime lowercase">
                                prime
                            </span>
                            <svg
                                viewBox="0 0 48 18"
                                className="mb-1 w-12 fill-amz-prime"
                                aria-hidden="true"
                            >
                                <path d="M2 4c12 9 30 10 44 2-9 8-25 10-37 4L4 8l-2-4Z" />
                            </svg>
                        </div>
                        <p className="mt-3 text-center text-xs leading-relaxed text-gray-200">
                            Envíos gratis en millones de productos, series,
                            música y ofertas exclusivas.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() =>
                            showToast(
                                'Tu prueba Prime de 30 días está lista. ¡Disfruta envíos gratis!',
                            )
                        }
                        className="w-full rounded-md bg-amz-yellow px-4 py-2 text-sm font-bold text-gray-900 transition hover:bg-[#f7ca00]"
                    >
                        Prueba Prime gratis
                    </button>
                </article>
            </div>
        </section>
    );
}
