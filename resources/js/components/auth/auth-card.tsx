import type { ReactNode } from 'react';

export default function AuthCard({
    title,
    subtitle,
    children,
    footer,
}: {
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
}) {
    return (
        <section className="card rounded-lg border border-gray-300 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08)] sm:p-7">
            <h1 className="text-2xl leading-tight font-normal text-gray-900">
                {title}
            </h1>

            {subtitle && (
                <p className="mt-1.5 text-sm leading-5 text-gray-600">
                    {subtitle}
                </p>
            )}

            <div className="mt-5">{children}</div>

            {footer && (
                <div className="mt-5 border-t border-gray-200 pt-4 text-xs leading-5 text-gray-600">
                    {footer}
                </div>
            )}
        </section>
    );
}
