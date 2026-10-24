import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useStorefront } from '@/contexts/StorefrontContext';
import { useToast } from '@/contexts/ToastContext';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function CartDrawer() {
    const { cartOpen, setCartOpen } = useStorefront();
    const { cartLines, cartQty, cartTotal, changeQty, removeItem, clearCart } =
        useCart();
    const { showToast } = useToast();
    const [giftWrap, setGiftWrap] = useState(false);

    useEffect(() => {
        if (!cartOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCartOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [cartOpen, setCartOpen]);

    function checkout() {
        clearCart();
        setGiftWrap(false);
        setCartOpen(false);
        showToast('¡Pedido confirmado! Gracias por comprar en Miami Caracas Express.');
    }

    const freeShipping = cartTotal >= 599;

    return (
        <div
            aria-hidden={!cartOpen}
            className={cn(
                'fixed inset-0 z-[95]',
                cartOpen ? 'pointer-events-auto' : 'pointer-events-none',
            )}
        >
            <button
                type="button"
                aria-label="Cerrar carrito"
                onClick={() => setCartOpen(false)}
                className={cn(
                    'absolute inset-0 bg-black/60 transition-opacity duration-300',
                    cartOpen ? 'opacity-100' : 'opacity-0',
                )}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Carrito de compras"
                className={cn(
                    'absolute top-0 right-0 flex h-full w-full max-w-96 flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-96',
                    cartOpen ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                <div className="flex items-center justify-between bg-amz-navy px-4 py-4 text-white">
                    <div className="flex items-center gap-2">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="size-6"
                            aria-hidden="true"
                        >
                            <path
                                d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="10" cy="20" r="1.3" fill="currentColor" />
                            <circle cx="17" cy="20" r="1.3" fill="currentColor" />
                        </svg>
                        <h2 className="text-lg font-bold">
                            Tu carrito{' '}
                            <span className="text-sm font-normal text-gray-300">
                                ({cartQty})
                            </span>
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCartOpen(false)}
                        aria-label="Cerrar carrito"
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

                {cartLines.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                        <span className="text-7xl" aria-hidden="true">
                            🛒
                        </span>
                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                            Tu carrito está vacío
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Descubre miles de productos con envío Prime y
                            ofertas que no vas a querer perder.
                        </p>
                        <button
                            type="button"
                            onClick={() => setCartOpen(false)}
                            className="mt-6 rounded-full bg-amz-yellow px-6 py-2 text-sm font-bold text-gray-900 transition hover:bg-amz-cart-yellow"
                        >
                            Seguir comprando
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-3">
                            <p className="mb-3 rounded-md bg-amz-green/10 px-3 py-2 text-xs font-medium text-amz-green">
                                {freeShipping
                                    ? '✓ Tu pedido califica para envío GRATIS'
                                    : `Te faltan ${money(599 - cartTotal)} para envío GRATIS`}
                            </p>

                            <ul className="divide-y divide-gray-200">
                                {cartLines.map((line) => (
                                    <li
                                        key={line.product.id}
                                        className="mk-fade-in flex gap-3 py-3"
                                    >
                                        <div
                                            className={cn(
                                                'flex size-20 shrink-0 items-center justify-center rounded-md bg-gradient-to-br',
                                                line.product.gradient,
                                            )}
                                        >
                                            <span
                                                className="text-3xl drop-shadow"
                                                aria-hidden="true"
                                            >
                                                {line.product.emoji}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="line-clamp-2 text-xs leading-4 font-medium text-gray-900">
                                                {line.product.name}
                                            </p>
                                            <p className="mt-1 text-sm font-bold text-amz-price">
                                                {money(line.lineTotal)}
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex items-center rounded-full border border-gray-300">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            changeQty(
                                                                line.product.id,
                                                                -1,
                                                            )
                                                        }
                                                        aria-label="Quitar una unidad"
                                                        className="flex size-7 items-center justify-center rounded-l-full text-gray-700 hover:bg-gray-100"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-6 text-center text-xs font-bold text-gray-900">
                                                        {line.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            changeQty(
                                                                line.product.id,
                                                                1,
                                                            )
                                                        }
                                                        aria-label="Agregar una unidad"
                                                        className="flex size-7 items-center justify-center rounded-r-full text-gray-700 hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(
                                                            line.product.id,
                                                        )
                                                    }
                                                    className="text-[11px] font-medium text-amz-link hover:text-amz-link-hover hover:underline"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">
                                    Subtotal ({cartQty}{' '}
                                    {cartQty === 1 ? 'producto' : 'productos'}):
                                </span>
                                <span className="text-lg font-bold text-gray-900">
                                    {money(cartTotal)}
                                </span>
                            </div>

                            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={giftWrap}
                                    onChange={(event) =>
                                        setGiftWrap(event.target.checked)
                                    }
                                    className="size-4 accent-amz-orange"
                                />
                                Incluye regalo (envoltura gratis)
                            </label>

                            <button
                                type="button"
                                onClick={checkout}
                                className="mt-4 w-full rounded-full bg-amz-yellow py-2.5 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-amz-cart-yellow"
                            >
                                Proceder al pago
                            </button>
                            <button
                                type="button"
                                onClick={() => setCartOpen(false)}
                                className="mt-2 w-full rounded-full border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                            >
                                Seguir comprando
                            </button>

                            <p className="mt-3 text-center text-[10px] text-gray-500">
                                Pago seguro · Devoluciones gratis 30 días
                            </p>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}
