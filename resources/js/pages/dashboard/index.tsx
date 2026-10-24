import { Head } from '@inertiajs/react';
import AddressesSection from '@/components/dashboard/sections/addresses-section';
import OrdersSection from '@/components/dashboard/sections/orders-section';
import PaymentsSection from '@/components/dashboard/sections/payments-section';
import SettingsSection from '@/components/dashboard/sections/settings-section';
import SummarySection from '@/components/dashboard/sections/summary-section';
import WishlistSection from '@/components/dashboard/sections/wishlist-section';
import { useDashboard } from '@/contexts/DashboardContext';
import DashboardLayout from '@/layouts/dashboard-layout';
import type { DashboardProps } from '@/types';

export default function Dashboard(props: DashboardProps) {
    return (
        <>
            <Head title="Mi cuenta" />
            <DashboardLayout
                user={props.user}
                addresses={props.addresses}
                products={props.products}
                initialSection={props.section}
            >
                <DashboardContent {...props} />
            </DashboardLayout>
        </>
    );
}

function DashboardContent(props: DashboardProps) {
    const { section } = useDashboard();

    switch (section) {
        case 'pedidos':
            return <OrdersSection orders={props.orders} />;
        case 'direcciones':
            return <AddressesSection addresses={props.addresses} />;
        case 'deseos':
            return <WishlistSection wishlist={props.wishlist} />;
        case 'pagos':
            return <PaymentsSection paymentMethods={props.paymentMethods} />;
        case 'configuracion':
            return <SettingsSection user={props.user} />;
        default:
            return (
                <SummarySection
                    user={props.user}
                    orders={props.orders}
                    addresses={props.addresses}
                    wishlist={props.wishlist}
                    paymentMethods={props.paymentMethods}
                    recommendedProducts={props.recommendedProducts}
                />
            );
    }
}
