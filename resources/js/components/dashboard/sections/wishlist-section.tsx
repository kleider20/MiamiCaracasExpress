import { router } from '@inertiajs/react';
import { destroy as destroyWishlist } from '@/actions/App/Http/Controllers/Dashboard/WishlistController';
import WishlistCard from '@/components/dashboard/wishlist-card';
import { useCart } from '@/contexts/CartContext';
import { useDashboard } from '@/contexts/DashboardContext';
import type { WishlistEntry } from '@/types';

export default function WishlistSection({
    wishlist,
}: {
    wishlist: WishlistEntry[];
}) {
    const { addToCart } = useCart();
    const { setSection } = useDashboard();

    const remove = (entry: WishlistEntry) => {
        router.delete(destroyWishlist(entry.id).url, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-5 fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Lista de deseos
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    {wishlist.length}{' '}
                    {wishlist.length === 1
                        ? 'producto guardado'
                        : 'productos guardados'}{' '}
                    para comprar más adelante.
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                    <span className="text-6xl" aria-hidden="true">
                        💔
                    </span>
                    <h2 className="mt-3 text-lg font-bold text-gray-900">
                        Tu lista de deseos está vacía
                    </h2>
                    <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
                        Guarda los productos que te gusten desde la tienda y
                        aparecerán aquí automáticamente.
                    </p>
                    <button
                        type="button"
                        onClick={() => setSection('resumen')}
                        className="link-mk mt-4 text-sm font-semibold"
                    >
                        Descubrir productos recomendados
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                    {wishlist.map((entry) => (
                        <WishlistCard
                            key={entry.id}
                            entry={entry}
                            onAdd={() => {
                                if (entry.product) {
                                    addToCart(entry.product.id);
                                }
                            }}
                            onRemove={() => remove(entry)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
