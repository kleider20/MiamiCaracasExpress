import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useStorefront } from '@/contexts/StorefrontContext';
import { compactNumber, deliveryDate, money, stars } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function ProductModal() {
    const { selectedProduct, closeProduct, setCartOpen } = useStorefront();
    const { addToCart } = useCart();

    useEffect(() => {
        if (!selectedProduct) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeProduct();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [selectedProduct, closeProduct]);

    if (!selectedProduct) {
        return null;
    }

    const product = selectedProduct;
    const savings =
        product.old_price && product.old_price > product.price
            ? product.old_price - product.price
            : 0;

    function buyNow() {
        addToCart(product.id);
        closeProduct();
        setCartOpen(true);
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-3 sm:p-6"
        >
            <button
                type="button"
                aria-label="Cerrar detalles del producto"
                onClick={closeProduct}
                className="fixed inset-0 cursor-default"
            />

            <div className="mk-scale-in relative z-10 my-4 w-full max-w-5xl rounded-xl bg-white shadow-2xl">
                <button
                    type="button"
                    onClick={closeProduct}
                    aria-label="Cerrar"
                    className="absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-5"
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

                <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-8">
                    <div>
                        <div
                            className={cn(
                                'relative flex h-64 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br sm:h-80',
                                product.gradient,
                            )}
                        >
                            <span
                                className="text-[120px] drop-shadow-2xl sm:text-[150px]"
                                aria-hidden="true"
                            >
                                {product.emoji}
                            </span>
                            {product.discount_percent > 0 ? (
                                <span className="absolute top-3 left-3 rounded bg-amz-red px-2 py-1 text-xs font-bold text-white">
                                    -{product.discount_percent}%
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {[0, 1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        'flex h-16 items-center justify-center rounded-md border bg-gradient-to-br sm:h-20',
                                        index === 0
                                            ? 'border-amz-orange ring-1 ring-amz-orange'
                                            : 'border-gray-200 opacity-80',
                                        product.gradient,
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'text-3xl drop-shadow-md sm:text-4xl',
                                            index === 1 && 'scale-90',
                                            index === 2 && '-rotate-6',
                                            index === 3 && 'rotate-6',
                                        )}
                                        aria-hidden="true"
                                    >
                                        {product.emoji}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pr-1">
                        <a
                            href="#productos"
                            onClick={(event) => event.preventDefault()}
                            className="text-xs font-medium text-amz-link hover:text-amz-link-hover hover:underline"
                        >
                            Visita la tienda MCE
                        </a>

                        <h2 className="mt-1 text-xl leading-7 font-bold text-gray-900 sm:text-2xl">
                            {product.name}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                            <span className="tracking-tight text-amz-orange">
                                {stars(product.rating)}
                            </span>
                            <span className="font-medium text-amz-link">
                                {product.rating.toFixed(1)}
                            </span>
                            <span className="text-gray-500">
                                {compactNumber(product.reviews_count)}{' '}
                                calificaciones
                            </span>
                        </div>

                        <div className="mt-4 border-t border-gray-200 pt-3">
                            <div className="flex flex-wrap items-baseline gap-2">
                                {product.discount_percent > 0 ? (
                                    <span className="text-xs font-medium text-amz-red">
                                        {product.discount_percent}% de descuento aplicado
                                    </span>
                                ) : null}
                            </div>
                            <div className="mt-1 flex flex-wrap items-baseline gap-2">
                                {product.old_price &&
                                product.old_price > product.price ? (
                                    <span className="text-sm text-gray-500">
                                        Precio anterior:{' '}
                                        <span className="line-through">
                                            {money(product.old_price)}
                                        </span>
                                    </span>
                                ) : null}
                            </div>
                            <div className="mt-1 flex flex-wrap items-baseline gap-2">
                                <span className="text-3xl font-bold text-amz-price">
                                    {money(product.price)}
                                </span>
                                {product.discount_percent > 0 ? (
                                    <span className="rounded bg-amz-red px-1.5 py-0.5 text-xs font-bold text-white">
                                        -{product.discount_percent}%
                                    </span>
                                ) : null}
                            </div>
                            {savings > 0 ? (
                                <p className="mt-1 text-xs text-gray-600">
                                    Ahorras:{' '}
                                    <span className="font-bold text-amz-price">
                                        {money(savings)}
                                    </span>
                                </p>
                            ) : null}
                        </div>

                        <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
                            {product.is_prime ? (
                                <p className="flex flex-wrap items-center gap-1.5 text-gray-800">
                                    <span className="font-black text-amz-prime lowercase">
                                        prime
                                    </span>
                                    <span>
                                        Entrega GRATIS el{' '}
                                        <strong>{deliveryDate(3)}</strong>
                                    </span>
                                </p>
                            ) : (
                                <p className="text-gray-800">
                                    Envío por{' '}
                                    <strong>{money(99)}</strong> · Llega el{' '}
                                    <strong>{deliveryDate(4)}</strong>
                                </p>
                            )}
                            <p className="mt-1 text-xs font-medium text-amz-green">
                                En stock
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Vendido por Miami Caracas Express · Enviado por
                                Miami Caracas Express
                            </p>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-gray-700">
                            {product.description}
                        </p>

                        <ul className="mt-3 grid gap-1 text-xs text-gray-700 sm:grid-cols-2">
                            <li>✓ Devoluciones gratis 30 días</li>
                            <li>✓ Pago 100% seguro</li>
                            <li>✓ Garantía de 12 meses</li>
                            <li>✓ Empaque protegido</li>
                        </ul>

                        <div className="mt-5 flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => addToCart(product.id)}
                                className="w-full rounded-full bg-amz-yellow py-2.5 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-amz-cart-yellow"
                            >
                                Agregar al carrito
                            </button>
                            <button
                                type="button"
                                onClick={buyNow}
                                className="w-full rounded-full bg-amz-buy-orange py-2.5 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-[#fa8900]"
                            >
                                Comprar ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
