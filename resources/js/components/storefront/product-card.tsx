import { useCart } from '@/contexts/CartContext';
import { useStorefront } from '@/contexts/StorefrontContext';
import { compactNumber, money, stars } from '@/lib/format';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { openProduct } = useStorefront();

    return (
        <article
            onClick={() => openProduct(product)}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
            <div
                className={cn(
                    'relative flex h-36 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br sm:h-40',
                    product.gradient,
                )}
            >
                <span
                    className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                >
                    {product.emoji}
                </span>

                {product.discount_percent > 0 ? (
                    <span className="absolute top-2 left-2 rounded bg-amz-red px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                        -{product.discount_percent}%
                    </span>
                ) : null}

                {product.is_prime ? (
                    <span className="absolute right-2 bottom-2 flex items-end gap-1 rounded bg-black/25 px-1.5 py-0.5 backdrop-blur-sm">
                        <span className="text-[13px] leading-none font-black text-amz-prime lowercase">
                            prime
                        </span>
                    </span>
                ) : null}
            </div>

            <div className="mt-3 flex flex-1 flex-col">
                <h3 className="line-clamp-2 min-h-[40px] text-sm leading-5 font-medium text-gray-900 group-hover:text-amz-link-hover">
                    {product.name}
                </h3>

                <div className="mt-1 flex items-center gap-1 text-xs">
                    <span className="tracking-tight text-amz-orange">
                        {stars(product.rating)}
                    </span>
                    <span className="font-medium text-amz-link">
                        {product.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                        ({compactNumber(product.reviews_count)})
                    </span>
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-xl font-bold text-amz-price">
                        {money(product.price)}
                    </span>
                    {product.old_price &&
                    product.old_price > product.price ? (
                        <span className="text-xs text-gray-500 line-through">
                            {money(product.old_price)}
                        </span>
                    ) : null}
                </div>

                <p className="mt-1 text-[11px] text-gray-600">
                    {product.is_prime ? (
                        <span className="flex flex-wrap items-center gap-1">
                            <span className="font-black text-amz-prime lowercase">
                                prime
                            </span>
                            <span>Entrega GRATIS</span>
                        </span>
                    ) : (
                        <span>Envío {money(99)} · Llega en 4 días</span>
                    )}
                </p>

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        addToCart(product.id);
                    }}
                    className="mt-auto w-full rounded-full bg-amz-yellow py-2 text-xs font-bold text-gray-900 shadow-sm transition hover:bg-amz-cart-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amz-dark"
                >
                    Agregar al carrito
                </button>
            </div>
        </article>
    );
}
