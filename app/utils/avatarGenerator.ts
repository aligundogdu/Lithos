export class AvatarGenerator {
    private static skinColors = ['#e0ac69', '#f1c27d', '#8d5524', '#c68642'];
    private static tunicColors = ['#f4f4f4', '#800020', '#556b2f', '#d4af37'];
    private static bgColors = ['#f0e6d2', '#e6dcc3'];

    static generate(name: string): string {
        const hash = this._hash(name);
        const skinColor = this.skinColors[hash % this.skinColors.length];
        const tunicColor = this.tunicColors[(hash >> 2) % this.tunicColors.length];
        const bgColor = this.bgColors[(hash >> 4) % this.bgColors.length];

        const hasBeard = (hash % 100) < 60; // 60% chance
        const hairStyle = (hash >> 6) % 3; // 0: Short, 1: Bald, 2: Tied
        const hasAccessory = name.toLowerCase().includes('master') || (hash % 100) < 5; // Rare

        let svg = `<svg width="100%" height="100%" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">`;

        // 1. Container
        svg += `<rect x="0" y="0" width="64" height="64" rx="8" fill="${bgColor}" />`;

        // 2. Body (Tunic)
        svg += `<path d="M12 64 Q32 40 52 64" fill="${tunicColor}" />`;
        svg += `<path d="M12 64 L12 50 Q32 35 52 50 L52 64 Z" fill="${tunicColor}" />`; // Shoulders

        // 3. Head
        svg += `<circle cx="32" cy="30" r="14" fill="${skinColor}" />`;

        // 4. Face Details
        // Eyes
        svg += `<circle cx="27" cy="28" r="1.5" fill="#3e2723" />`;
        svg += `<circle cx="37" cy="28" r="1.5" fill="#3e2723" />`;

        // Beard
        if (hasBeard) {
            const beardColor = '#3e2723'; // Dark brown
            // Simple beard shape
            svg += `<path d="M22 32 Q32 48 42 32 L42 30 L22 30 Z" fill="${beardColor}" opacity="0.8" />`;
        }

        // Hair
        const hairColor = '#2d1b0e'; // Very dark brown
        if (hairStyle === 0) { // Short
            svg += `<path d="M18 26 Q32 10 46 26" stroke="${hairColor}" stroke-width="4" fill="none" />`;
        } else if (hairStyle === 2) { // Tied / Bun
            svg += `<circle cx="32" cy="14" r="4" fill="${hairColor}" />`;
            svg += `<path d="M18 28 Q32 12 46 28" stroke="${hairColor}" stroke-width="3" fill="none" />`;
        }
        // hairStyle 1 is Bald, so no hair drawn

        // Accessory (Laurel Wreath)
        if (hasAccessory) {
            svg += `<path d="M16 26 Q32 16 48 26" stroke="#4caf50" stroke-width="2" fill="none" />`;
            svg += `<circle cx="16" cy="26" r="1" fill="#4caf50" />`;
            svg += `<circle cx="48" cy="26" r="1" fill="#4caf50" />`;
        }

        svg += `</svg>`;
        return svg;
    }

    private static _hash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
}
