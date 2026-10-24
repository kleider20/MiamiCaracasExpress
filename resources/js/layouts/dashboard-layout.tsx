import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import BackToTopButton from '@/components/storefront/back-to-top-button';
import CartDrawer from '@/components/storefront/cart-drawer';
import Footer from '@/components/storefront/footer';
import Toast from '@/components/dashboard/toast';
import Breadcrumb from '@/components/dashboard/breadcrumb';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar';
import LogoutScreen from '@/components/dashboard/logout-screen';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import { CartProvider } from '@/contexts/CartContext';
import { StorefrontProvider } from '@/contexts/StorefrontContext';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import type {
    DashboardAddress,
    DashboardSection,
    DashboardUser,
    FlashMessages,
    Product,
} from '@/types';

export default function DashboardLayout({
    user,
    addresses,
    products,
    initialSection,
    children,
}: {
    user: DashboardUser;
    addresses: DashboardAddress[];
    products: Product[];
    initialSection: DashboardSection;
    children: ReactNode;
}) {
    return (
        <ToastProvider>
            <StorefrontProvider products={products}>
                <CartProvider products={products}>
                    <DashboardProvider initialSection={initialSection}>
                        <DashboardShell user={user} addresses={addresses}>
                            {children}
                        </DashboardShell>
                    </DashboardProvider>
                </CartProvider>
            </StorefrontProvider>
        </ToastProvider>
    );
}

function DashboardShell({
    user,
    addresses,
    children,
}: {
    user: DashboardUser;
    addresses: DashboardAddress[];
    children: ReactNode;
}) {
    const { loggedOut } = useDashboard();
    const { showToast } = useToast();
    const page = usePage();
    const flash = (page.props.flash ?? {}) as FlashMessages;

    useEffect(() => {
        const message = flash.success ?? flash.status ?? flash.error;

        if (message) {
            showToast(message);
        }
    }, [flash.success, flash.status, flash.error, showToast]);

    if (loggedOut) {
        return <LogoutScreen />;
    }

    return (
        <div className="mk-body flex min-h-screen flex-col bg-amz-bg">
            <DashboardHeader user={user} addresses={addresses} />
            <Breadcrumb />

            <div className="mx-auto flex w-full max-w-[1500px] flex-1 gap-6 px-4 py-5">
                <DashboardSidebar user={user} />

                <main className="min-w-0 flex-1">{children}</main>
            </div>

            <Footer />
            <CartDrawer />
            <Toast />
            <BackToTopButton />
        </div>
    );
}
