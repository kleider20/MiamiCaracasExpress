import { money } from '@/lib/format';
import type { WishlistEntry } from '@/types';

export default function WishlistCard({
    entry,
    onAdd,
    onRemove,
}: {
    entry: WishlistEntry;
    onAdd: () => void;
    onRemove: () => void;
}) {
    const product = entry.product;

    if (!product) {
        return null;
    }

    return (
        <article className="card flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div
                className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${product.gradient}`}
            >
                <span className="text-6xl drop-shadow" aria-hidden="true">
                    {product.emoji}
                </span>

                {product.discount_percent > 0 && (
                    <span className="absolute top-2 left-2 rounded bg-amz-red px-2 py-0.5 text-[10px] font-bold text-white">
                        -{product.discount_percent}%
                    </span>
                )}

                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Eliminar ${product.name} de la lista de deseos`}
                    className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow transition hover:bg-white hover:text-amz-red"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-4"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-2 min-h-8 text-xs leading-4 font-medium text-gray-900">
                    {product.name}
                </h3>

                <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-lg font-bold text-amz-price">
                        {money(product.price)}
                    </span>
                    {product.old_price && (
                        <span className="text-[11px] text-gray-500 line-through">
                            {money(product.old_price)}
                        </span>
                    )}
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            entry.in_stock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {entry.in_stock ? 'En stock' : 'Sin stock'}
                    </span>
                    {product.is_prime && (
                        <span className="prime-tag text-[10px]">
                            prime Envío GRATIS
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onAdd}
                    disabled={!entry.in_stock}
                    className="btn-cart mt-auto w-full py-1.5 text-[11px] font-bold text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {entry.in_stock ? 'Agregar al carrito' : 'No disponible'}
                </button>
            </div>
        </article>
    );
}
