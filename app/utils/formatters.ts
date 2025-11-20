export function formatNumber(value: number): string {
    return new Intl.NumberFormat('tr-TR').format(Math.floor(value));
}

export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
        return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
}
