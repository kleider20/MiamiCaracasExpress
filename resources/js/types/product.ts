export type Product = {
    id: number;
    name: string;
    category: string;
    price: number;
    old_price: number | null;
    discount_percent: number;
    rating: number;
    reviews_count: number;
    emoji: string;
    gradient: string;
    is_prime: boolean;
    is_deal: boolean;
    description: string;
};

export type CartState = Record<number, number>;

export type CartLine = {
    product: Product;
    quantity: number;
    lineTotal: number;
};
