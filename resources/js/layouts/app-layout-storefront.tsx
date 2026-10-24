import type { ReactNode } from 'react';
import BackToTopButton from '@/components/storefront/back-to-top-button';
import CartDrawer from '@/components/storefront/cart-drawer';
import Footer from '@/components/storefront/footer';
import Header from '@/components/storefront/header';
import ProductModal from '@/components/storefront/product-modal';
import SideDrawer from '@/components/storefront/side-drawer';
import Toast from '@/components/storefront/toast';
import { CartProvider } from '@/contexts/CartContext';
import { StorefrontProvider } from '@/contexts/StorefrontContext';
import { ToastProvider } from '@/contexts/ToastContext';
import type { Product } from '@/types';

export default function AppLayout({
    products,
    children,
}: {
    products: Product[];
    children: ReactNode;
}) {
    return (
        <ToastProvider>
            <StorefrontProvider products={products}>
                <CartProvider products={products}>
                    <div className="min-h-screen bg-amz-bg font-sans text-gray-900">
                        <SideDrawer />
                        <Header />
                        <main>{children}</main>
                        <Footer />
                        <ProductModal />
                        <CartDrawer />
                        <Toast />
                        <BackToTopButton />
                    </div>
                </CartProvider>
            </StorefrontProvider>
        </ToastProvider>
    );
}
