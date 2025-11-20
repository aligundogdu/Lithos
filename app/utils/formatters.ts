export function formatNumber(value: number): string {
    return new Intl.NumberFormat('tr-TR').format(Math.floor(value));
}
