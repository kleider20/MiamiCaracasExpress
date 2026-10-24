import { useMemo } from 'react';
import ProductCard from '@/components/storefront/product-card';
import { useStorefront } from '@/contexts/StorefrontContext';
import { cn } from '@/lib/utils';

const CATEGORIES = [
    'Todos',
    'Ofertas',
    'Electrónica',
    'Hogar',
    'Moda',
    'Deportes',
    'Juguetes',
];

export default function ProductGrid() {
    const { products, category, query, selectCategory } = useStorefront();

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();
        let list = products;

        if (term !== '') {
            list = list.filter(
                (product) =>
                    product.name.toLowerCase().includes(term) ||
                    product.category.toLowerCase().includes(term) ||
                    product.description.toLowerCase().includes(term),
            );
        }

        if (category === 'Ofertas') {
            return list.filter((product) => product.is_deal);
        }

        if (category !== 'Todos') {
            return list.filter((product) => product.category === category);
        }

        return list;
    }, [products, category, query]);

    const title = query
        ? `Resultados para “${query}”`
        : category === 'Todos'
          ? 'Los más vendidos en Miami Caracas Express'
          : category === 'Ofertas'
            ? 'Ofertas del día'
            : category;

    return (
        <section
            id="productos"
            className="mx-auto mt-8 max-w-[1500px] scroll-mt-28 px-4"
        >
            <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {filtered.length}{' '}
                            {filtered.length === 1 ? 'producto' : 'productos'}
                            {category !== 'Todos' && !query
                                ? ` en ${category}`
                                : ''}
                        </p>
                    </div>
                    {query ? (
                        <button
                            type="button"
                            onClick={() => selectCategory('Todos')}
                            className="text-sm font-medium text-amz-link hover:text-amz-link-hover hover:underline"
                        >
                            Limpiar búsqueda
                        </button>
                    ) : null}
                </div>

                <div className="hide-scroll mt-4 flex gap-2 overflow-x-auto pb-1">
                    {CATEGORIES.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => selectCategory(item)}
                            aria-pressed={category === item}
                            className={cn(
                                'shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition',
                                category === item
                                    ? 'border-amz-dark bg-amz-dark text-white'
                                    : 'border-gray-300 bg-white text-gray-700 hover:border-amz-dark hover:text-amz-dark',
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <span className="text-6xl" aria-hidden="true">
                            🔎
                        </span>
                        <h3 className="mt-4 text-lg font-bold text-gray-900">
                            No encontramos resultados
                        </h3>
                        <p className="mt-1 max-w-md text-sm text-gray-600">
                            Intenta con otra búsqueda o explora todas nuestras
                            categorías. Tenemos miles de productos esperando por
                            ti.
                        </p>
                        <button
                            type="button"
                            onClick={() => selectCategory('Todos')}
                            className="mt-5 rounded-full bg-amz-yellow px-6 py-2 text-sm font-bold text-gray-900 transition hover:bg-amz-cart-yellow"
                        >
                            Ver todos los productos
                        </button>
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                        {filtered.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
