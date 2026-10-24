import { useToast } from '@/contexts/ToastContext';

export default function SellCTA() {
    const { showToast } = useToast();

    return (
        <section
            aria-label="Vende tus productos en Miami Caracas Express"
            className="mx-auto mt-8 max-w-[1500px] px-4"
        >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amz-dark via-amz-navy to-[#37475a] px-6 py-10 text-white shadow-lg sm:px-10 md:py-12">
                <div
                    className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-amz-orange/20 blur-2xl"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-amz-prime/10 blur-3xl"
                    aria-hidden="true"
                />

                <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="max-w-2xl">
                        <span className="mb-3 inline-block rounded-full bg-amz-orange/20 px-3 py-1 text-[11px] font-bold tracking-wide text-amz-orange uppercase">
                            MCE Marketplace
                        </span>
                        <h2 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl">
                            Vende tus productos a millones de clientes
                        </h2>
                        <p className="mt-3 max-w-xl text-sm text-gray-300 sm:text-base">
                            Únete al marketplace que está creciendo más rápido
                            en Venezuela. Abre tu tienda en minutos, llega a más
                            clientes y haz crecer tu negocio con nosotros.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-300">
                            <span>✓ Comisiones competitivas</span>
                            <span>✓ Logística y envíos incluidos</span>
                            <span>✓ Soporte para vendedores</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            showToast(
                                '¡Bienvenido! Completa tu registro de vendedor para comenzar.',
                            )
                        }
                        className="shrink-0 rounded-full bg-amz-yellow px-8 py-3 text-sm font-bold text-gray-900 shadow-md transition hover:bg-[#f7ca00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Comenzar a vender
                    </button>
                </div>
            </div>
        </section>
    );
}
