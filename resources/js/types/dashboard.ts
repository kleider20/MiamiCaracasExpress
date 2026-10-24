import type { Product } from './product';

export const DASHBOARD_SECTIONS = [
    'resumen',
    'pedidos',
    'direcciones',
    'deseos',
    'pagos',
    'configuracion',
] as const;

export type DashboardSection = (typeof DASHBOARD_SECTIONS)[number];

export type OrderStatus =
    | 'En camino'
    | 'Entregado'
    | 'Preparando envío'
    | 'Cancelado';

export type DashboardUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    email_verified_at: string | null;
    created_at: string | null;
    member_since: string | null;
    two_factor_enabled: boolean;
};

export type DashboardAddress = {
    id: number;
    name: string;
    person: string;
    street: string;
    city: string;
    zip: string;
    phone: string;
    is_default: boolean;
};

export type DashboardOrderItem = {
    id: number;
    product_id: number | null;
    name: string;
    emoji: string;
    qty: number;
    price: number;
    color: string;
    line_total: number;
};

export type DashboardOrder = {
    id: string;
    date: string | null;
    date_label: string | null;
    total: number;
    status: OrderStatus;
    eta: string | null;
    progress: number;
    shipping_address: DashboardAddress | null;
    items: DashboardOrderItem[];
};

export type WishlistEntry = {
    id: number;
    product: Product | null;
    in_stock: boolean;
    created_at: string | null;
};

export type PaymentMethod = {
    id: number;
    brand: 'Visa' | 'Mastercard' | 'Amex';
    last4: string;
    holder: string;
    exp_month: number;
    exp_year: number;
    exp_label: string;
    is_default: boolean;
    color: string;
};

export type DashboardProps = {
    section: DashboardSection;
    user: DashboardUser;
    orders: DashboardOrder[];
    addresses: DashboardAddress[];
    wishlist: WishlistEntry[];
    paymentMethods: PaymentMethod[];
    recommendedProducts: Product[];
    products: Product[];
};
