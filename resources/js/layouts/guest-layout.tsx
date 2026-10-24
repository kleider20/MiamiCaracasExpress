import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AuthFooter from '@/components/auth/auth-footer';
import AuthHeader from '@/components/auth/auth-header';
import BenefitsCard from '@/components/auth/benefits-card';

export default function GuestLayout({ children }: { children: ReactNode }) {
    const page = usePage();

    return (
        <div className="mk-body">
            <AuthHeader />

            <main className="flex flex-1 justify-center px-4 py-8 sm:px-6 sm:py-10">
                <div className="w-full max-w-[420px]">
                    <div
                        key={`${page.component}-${page.url}`}
                        className="fade-in"
                    >
                        {children}
                    </div>

                    <BenefitsCard />

                    <p className="mt-5 text-center text-[11px] leading-5 text-gray-500">
                        Al usar Miami Caracas Express aceptas nuestras
                        condiciones de uso y nuestro aviso de privacidad. Este
                        sitio es una demo educativa.
                    </p>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}
