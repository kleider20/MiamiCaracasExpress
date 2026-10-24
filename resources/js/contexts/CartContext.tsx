import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import type { CartLine, CartState, Product } from '@/types';

const STORAGE_KEY = 'mce-cart-v1';
const OWNER_KEY = 'mce-cart-owner';

type CartPayloadItem = {
    product_id: number;
    quantity: number;
};

type CartResponse = {
    items: Record<string, number>;
};

type CartContextValue = {
    cart: CartState;
    cartLines: CartLine[];
    cartQty: number;
    cartTotal: number;
    cartIds: number[];
    cartBump: number;
    addToCart: (id: number, quantity?: number) => void;
    changeQty: (id: number, delta: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartState {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return {};
        }

        const parsed: unknown = JSON.parse(raw);

        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return {};
        }

        return Object.entries(parsed as Record<string, unknown>).reduce<CartState>(
            (cart, [id, quantity]) => {
                const productId = Number(id);
                const qty = Number(quantity);

                if (Number.isInteger(productId) && Number.isFinite(qty) && qty > 0) {
                    cart[productId] = Math.min(99, Math.floor(qty));
                }

                return cart;
            },
            {},
        );
    } catch {
        return {};
    }
}

function toPayload(cart: CartState): CartPayloadItem[] {
    return Object.entries(cart).map(([productId, quantity]) => ({
        product_id: Number(productId),
        quantity,
    }));
}

function normalizeCart(items: Record<string, number> | undefined): CartState {
    if (!items) {
        return {};
    }

    return Object.entries(items).reduce<CartState>((cart, [id, quantity]) => {
        const productId = Number(id);
        const qty = Number(quantity);

        if (Number.isInteger(productId) && Number.isFinite(qty) && qty > 0) {
            cart[productId] = Math.min(99, Math.floor(qty));
        }

        return cart;
    }, {});
}

function readXsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : null;
}

async function cartRequest(
    method: 'GET' | 'POST' | 'PUT',
    url: string,
    body?: unknown,
): Promise<CartResponse> {
    const xsrfToken = readXsrfToken();

    const response = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`No pudimos sincronizar el carrito (${response.status}).`);
    }

    return (await response.json()) as CartResponse;
}

export function CartProvider({
    products,
    children,
}: {
    products: Product[];
    children: ReactNode;
}) {
    const { showToast } = useToast();
    const { user } = useAuth();
    const userId = user?.id ?? null;

    const [cart, setCart] = useState<CartState>(loadCart);
    const [cartBump, setCartBump] = useState(0);

    const cartRef = useRef(cart);
    const userIdRef = useRef<number | null>(userId);
    const syncedFor = useRef<number | null>(null);
    const readyFor = useRef<number | null>(null);
    const lastSyncedPayload = useRef('');

    useEffect(() => {
        cartRef.current = cart;
    }, [cart]);

    /**
     * When the user signs in, merge the guest cart (localStorage) with the cart
     * stored in the database. On later visits, load the cart from the database.
     */
    useEffect(() => {
        userIdRef.current = userId;

        if (userId === null) {
            if (syncedFor.current !== null) {
                syncedFor.current = null;
                readyFor.current = null;
                lastSyncedPayload.current = '';
                window.localStorage.removeItem(OWNER_KEY);
                setCart({});
            }

            return;
        }

        if (syncedFor.current === userId) {
            return;
        }

        syncedFor.current = userId;

        const storedOwner = window.localStorage.getItem(OWNER_KEY);
        const shouldMergeGuestCart = storedOwner !== String(userId);
        const guestItems = toPayload(cartRef.current);

        void (async () => {
            try {
                const data = shouldMergeGuestCart
                    ? await cartRequest('POST', '/api/cart/sync', {
                          items: guestItems,
                      })
                    : await cartRequest('GET', '/api/cart');

                if (userIdRef.current !== userId) {
                    return;
                }

                const nextCart = normalizeCart(data.items);

                setCart(nextCart);
                lastSyncedPayload.current = JSON.stringify(nextCart);
                readyFor.current = userId;
                window.localStorage.setItem(OWNER_KEY, String(userId));
            } catch {
                if (userIdRef.current === userId) {
                    syncedFor.current = null;
                }
            }
        })();
    }, [userId]);

    /**
     * Persist the cart for guests in localStorage and debounce a PUT to the
     * database for authenticated users.
     */
    useEffect(() => {
        const serialized = JSON.stringify(cart);

        window.localStorage.setItem(STORAGE_KEY, serialized);

        if (userId === null || readyFor.current !== userId) {
            return;
        }

        if (serialized === lastSyncedPayload.current) {
            return;
        }

        const timer = window.setTimeout(() => {
            void cartRequest('PUT', '/api/cart', { items: toPayload(cart) })
                .then(() => {
                    lastSyncedPayload.current = serialized;
                })
                .catch(() => undefined);
        }, 700);

        return () => window.clearTimeout(timer);
    }, [cart, userId]);

    const addToCart = useCallback(
        (id: number, quantity = 1) => {
            const product = products.find((item) => item.id === id);

            setCart((current) => ({
                ...current,
                [id]: Math.min(99, (current[id] ?? 0) + quantity),
            }));
            setCartBump((bump) => bump + 1);
            showToast(
                product
                    ? `Agregado al carrito: ${product.name.slice(0, 42)}${product.name.length > 42 ? '…' : ''}`
                    : 'Producto agregado al carrito',
            );
        },
        [products, showToast],
    );

    const changeQty = useCallback((id: number, delta: number) => {
        setCart((current) => {
            const next = { ...current };
            const quantity = (next[id] ?? 0) + delta;

            if (quantity <= 0) {
                delete next[id];
            } else {
                next[id] = Math.min(99, quantity);
            }

            return next;
        });
    }, []);

    const removeItem = useCallback((id: number) => {
        setCart((current) => {
            const next = { ...current };
            delete next[id];

            return next;
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart({});
    }, []);

    const cartLines = useMemo<CartLine[]>(
        () =>
            products
                .filter((product) => (cart[product.id] ?? 0) > 0)
                .map((product) => {
                    const quantity = cart[product.id] ?? 0;

                    return {
                        product,
                        quantity,
                        lineTotal: product.price * quantity,
                    };
                }),
        [cart, products],
    );

    const cartQty = useMemo(
        () => Object.values(cart).reduce((total, quantity) => total + quantity, 0),
        [cart],
    );

    const cartTotal = useMemo(
        () => cartLines.reduce((total, line) => total + line.lineTotal, 0),
        [cartLines],
    );

    const cartIds = useMemo(
        () => Object.keys(cart).map((id) => Number(id)),
        [cart],
    );

    const value = useMemo<CartContextValue>(
        () => ({
            cart,
            cartLines,
            cartQty,
            cartTotal,
            cartIds,
            cartBump,
            addToCart,
            changeQty,
            removeItem,
            clearCart,
        }),
        [
            cart,
            cartLines,
            cartQty,
            cartTotal,
            cartIds,
            cartBump,
            addToCart,
            changeQty,
            removeItem,
            clearCart,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider.');
    }

    return context;
}
