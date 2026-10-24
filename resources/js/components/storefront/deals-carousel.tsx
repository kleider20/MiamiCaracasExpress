import { useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useStorefront } from '@/contexts/StorefrontContext';
import { compactNumber, money, stars } from '@/lib/format';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

export default function DealsCarousel() {
    const { products, openProduct, selectCategory } = useStorefront();
    const { addToCart } = useCart();
    const trackRef = useRef<HTMLDivElement | null>(null);

    const deals = products.filter((product) => product.is_deal);

    function scroll(direction: number) {
        trackRef.current?.scrollBy({ left: direction * 460, behavior: 'smooth' });
    }

    if (deals.length === 0) {
        return null;
    }

    return (
        <section
            aria-label="Ofertas del día"
            className="mx-auto mt-8 max-w-[1500px] px-4"
        >
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-baseline gap-3">
                        <h2 className="text-xl font-bold text-gray-900">
                            Ofertas del día
                        </h2>
                        <span className="hidden text-xs font-medium text-amz-red sm:inline">
                            Terminan en pocas horas
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => selectCategory('Ofertas')}
                        className="text-sm font-medium text-amz-link hover:text-amz-link-hover hover:underline"
                    >
                        Ver todas las ofertas
                    </button>
                </div>

                <div className="group/deals relative">
                    <div
                        ref={trackRef}
                        className="hide-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
                    >
                        {deals.map((product) => (
                            <DealCard
                                key={product.id}
                                product={product}
                                onOpen={() => openProduct(product)}
                                onAdd={() => addToCart(product.id)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => scroll(-1)}
                        aria-label="Ver ofertas anteriores"
                        className="absolute top-1/2 -left-3 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 opacity-0 shadow-md transition hover:bg-gray-50 focus-visible:opacity-100 group-hover/deals:opacity-100 md:flex"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-5"
                            aria-hidden="true"
                        >
                            <path
                                d="m15 5-7 7 7 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll(1)}
                        aria-label="Ver más ofertas"
                        className="absolute top-1/2 -right-3 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 opacity-0 shadow-md transition hover:bg-gray-50 focus-visible:opacity-100 group-hover/deals:opacity-100 md:flex"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-5"
                            aria-hidden="true"
                        >
                            <path
                                d="m9 5 7 7-7 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

function DealCard({
    product,
    onOpen,
    onAdd,
}: {
    product: Product;
    onOpen: () => void;
    onAdd: () => void;
}) {
    const claimed = Math.min(92, 24 + product.discount_percent);

    return (
        <article
            onClick={onOpen}
            className="group w-[220px] shrink-0 snap-start cursor-pointer rounded-lg border border-gray-100 p-2 transition hover:shadow-md sm:w-[240px]"
        >
            <div
                className={cn(
                    'relative flex h-40 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br',
                    product.gradient,
                )}
            >
                <span
                    className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                >
                    {product.emoji}
                </span>
                <span className="absolute top-2 left-2 rounded bg-amz-red px-1.5 py-0.5 text-[11px] font-bold text-white">
                    -{product.discount_percent}%
                </span>
            </div>

            <div className="mt-2">
                <span className="inline-block rounded-sm bg-amz-red px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Oferta del día
                </span>
                <h3 className="mt-1 line-clamp-2 min-h-[36px] text-xs leading-[18px] font-medium text-gray-900 group-hover:text-amz-link-hover">
                    {product.name}
                </h3>

                <div className="mt-1 flex items-center gap-1 text-[11px]">
                    <span className="tracking-tight text-amz-orange">
                        {stars(product.rating)}
                    </span>
                    <span className="text-gray-500">
                        ({compactNumber(product.reviews_count)})
                    </span>
                </div>

                <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-amz-price">
                        {money(product.price)}
                    </span>
                    {product.old_price ? (
                        <span className="text-[11px] text-gray-500 line-through">
                            {money(product.old_price)}
                        </span>
                    ) : null}
                </div>

                <div className="mt-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-amz-red"
                            style={{ width: `${claimed}%` }}
                        />
                    </div>
                    <p className="mt-1 text-[10px] text-gray-600">
                        {claimed}% reclamado
                    </p>
                </div>

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onAdd();
                    }}
                    className="mt-2 w-full rounded-full bg-amz-yellow py-1.5 text-[11px] font-bold text-gray-900 transition hover:bg-amz-cart-yellow"
                >
                    Agregar al carrito
                </button>
            </div>
        </article>
    );
}
