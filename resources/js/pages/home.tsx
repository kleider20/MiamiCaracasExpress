import { Head } from '@inertiajs/react';
import CategoryCards from '@/components/storefront/category-cards';
import DealsCarousel from '@/components/storefront/deals-carousel';
import HeroCarousel from '@/components/storefront/hero-carousel';
import InfoBanners from '@/components/storefront/info-banners';
import ProductGrid from '@/components/storefront/product-grid';
import SellCTA from '@/components/storefront/sell-cta';
import AppLayout from '@/layouts/app-layout-storefront';
import type { Product } from '@/types';

export default function Home({ products }: { products: Product[] }) {
    return (
        <>
            <Head title="Envíos gratis y ofertas todos los días">
                <meta
                    name="description"
                    content="Compra electrónica, hogar, moda, deportes y juguetes en Miami Caracas Express (MCE). Envíos gratis con Prime, ofertas del día y devoluciones sin complicaciones."
                />
            </Head>

            <AppLayout products={products}>
                <HeroCarousel />
                <CategoryCards />
                <DealsCarousel />
                <ProductGrid />
                <InfoBanners />
                <SellCTA />
            </AppLayout>
        </>
    );
}
