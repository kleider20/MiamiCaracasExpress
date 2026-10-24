import type { DashboardAddress } from '@/types';

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    onDefault,
}: {
    address: DashboardAddress;
    onEdit: () => void;
    onDelete: () => void;
    onDefault: () => void;
}) {
    return (
        <article className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            {address.is_default && (
                <span className="absolute top-3 right-3 rounded-full bg-amz-yellow px-2 py-0.5 text-[10px] font-bold text-gray-900">
                    Predeterminada
                </span>
            )}

            <div className="flex items-center gap-2 pr-24">
                <span className="text-xl" aria-hidden="true">
                    {address.name.toLowerCase() === 'oficina' ? '🏢' : '🏠'}
                </span>
                <h3 className="text-sm font-bold text-gray-900">
                    {address.name}
                </h3>
            </div>

            <address className="mt-3 space-y-0.5 text-xs leading-5 text-gray-700 not-italic">
                <p className="font-semibold text-gray-900">{address.person}</p>
                <p>{address.street}</p>
                <p>
                    {address.city} {address.zip}
                </p>
                <p>Tel. {address.phone}</p>
            </address>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-2 text-[11px] font-semibold">
                <button type="button" onClick={onEdit} className="link-mk">
                    Editar
                </button>

                {!address.is_default && (
                    <button
                        type="button"
                        onClick={onDefault}
                        className="link-mk"
                    >
                        Predeterminar
                    </button>
                )}

                <button
                    type="button"
                    onClick={onDelete}
                    className="ml-auto text-amz-red hover:underline"
                >
                    Eliminar
                </button>
            </div>
        </article>
    );
}
