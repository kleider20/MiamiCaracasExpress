export function money(value: number | string): string {
    const amount = typeof value === 'string' ? Number(value) : value;

    if (!Number.isFinite(amount)) {
        return 'Bs. 0,00';
    }

    return `Bs. ${amount.toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function stars(rating: number): string {
    const filled = Math.max(0, Math.min(5, Math.round(rating)));

    return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

export function compactNumber(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toLocaleString('es-VE', {
            maximumFractionDigits: 1,
        })} mil`;
    }

    return String(value);
}

export function deliveryDate(daysFromNow = 3): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);

    return date.toLocaleDateString('es-VE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}
