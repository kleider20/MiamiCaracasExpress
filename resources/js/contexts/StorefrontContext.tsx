import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '@/types';

type StorefrontContextValue = {
    products: Product[];
    category: string;
    query: string;
    selectedProduct: Product | null;
    sideDrawerOpen: boolean;
    cartOpen: boolean;
    setSideDrawerOpen: (open: boolean) => void;
    setCartOpen: (open: boolean) => void;
    selectCategory: (category: string) => void;
    search: (query: string, category?: string) => void;
    openProduct: (product: Product) => void;
    closeProduct: () => void;
    scrollToProducts: () => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

function scrollToProducts(): void {
    window.setTimeout(() => {
        document
            .getElementById('productos')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
}

export function StorefrontProvider({
    products,
    children,
}: {
    products: Product[];
    children: ReactNode;
}) {
    const [category, setCategory] = useState('Todos');
    const [query, setQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    const selectCategory = useCallback((nextCategory: string) => {
        setCategory(nextCategory);
        setQuery('');
        setSideDrawerOpen(false);
        scrollToProducts();
    }, []);

    const search = useCallback((nextQuery: string, nextCategory = 'Todos') => {
        setQuery(nextQuery.trim());
        setCategory(nextCategory);
        setSideDrawerOpen(false);
        scrollToProducts();
    }, []);

    const openProduct = useCallback((product: Product) => {
        setSelectedProduct(product);
    }, []);

    const closeProduct = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    return (
        <StorefrontContext.Provider
            value={{
                products,
                category,
                query,
                selectedProduct,
                sideDrawerOpen,
                cartOpen,
                setSideDrawerOpen,
                setCartOpen,
                selectCategory,
                search,
                openProduct,
                closeProduct,
                scrollToProducts,
            }}
        >
            {children}
        </StorefrontContext.Provider>
    );
}

export function useStorefront(): StorefrontContextValue {
    const context = useContext(StorefrontContext);

    if (!context) {
        throw new Error(
            'useStorefront debe usarse dentro de StorefrontProvider.',
        );
    }

    return context;
}
