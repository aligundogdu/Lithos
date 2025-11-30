export class AvatarGenerator {
    // Expanded color palettes
    private static skinColors = [
        '#fde7d6', // Very light
        '#f1c27d', // Light tan
        '#e0ac69', // Medium tan
        '#c68642', // Medium brown
        '#a67c52', // Brown
        '#8d5524', // Dark brown
        '#6b4423'  // Very dark
    ];

    private static hairColors = [
        '#1a1a1a', // Black
        '#2d1b0e', // Dark brown
        '#4a3728', // Brown
        '#8b6f47', // Light brown
        '#d4a574', // Blonde
        '#c0c0c0', // Gray
        '#f5f5f5'  // White
    ];

    private static tunicColors = [
        '#f4f4f4', // White
        '#800020', // Burgundy
        '#556b2f', // Olive
        '#d4af37', // Gold
        '#4a5568', // Gray
        '#8b4513', // Brown
        '#2c5f2d'  // Forest green
    ];

    private static bgColors = ['#f0e6d2', '#e6dcc3', '#d4c5a9', '#c9b896'];

    static generate(name: string): string {
        const hash = this._hash(name);
        const skinColor = this.skinColors[hash % this.skinColors.length];
        const hairColor = this.hairColors[(hash >> 2) % this.hairColors.length];
        const tunicColor = this.tunicColors[(hash >> 4) % this.tunicColors.length];
        const bgColor = this.bgColors[(hash >> 6) % this.bgColors.length];

        const beardStyle = (hash >> 8) % 4; // 0: None, 1: Full, 2: Goatee, 3: Mustache
        const hairStyle = (hash >> 10) % 5; // 0: Short, 1: Bald, 2: Tied, 3: Curly, 4: Long
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

        // Beard variations
        if (beardStyle === 1) { // Full beard
            svg += `<path d="M22 32 Q32 48 42 32 L42 30 L22 30 Z" fill="${hairColor}" opacity="0.8" />`;
        } else if (beardStyle === 2) { // Goatee
            svg += `<path d="M28 34 Q32 42 36 34 L36 32 L28 32 Z" fill="${hairColor}" opacity="0.8" />`;
        } else if (beardStyle === 3) { // Mustache
            svg += `<path d="M24 31 Q28 33 32 31 Q36 33 40 31" stroke="${hairColor}" stroke-width="2" fill="none" opacity="0.8" />`;
        }

        // Hair variations
        if (hairStyle === 0) { // Short
            svg += `<path d="M18 26 Q32 10 46 26" stroke="${hairColor}" stroke-width="4" fill="none" />`;
        } else if (hairStyle === 2) { // Tied / Bun
            svg += `<circle cx="32" cy="14" r="4" fill="${hairColor}" />`;
            svg += `<path d="M18 28 Q32 12 46 28" stroke="${hairColor}" stroke-width="3" fill="none" />`;
        } else if (hairStyle === 3) { // Curly
            svg += `<path d="M18 26 Q22 18 26 22 Q30 18 32 22 Q34 18 38 22 Q42 18 46 26" stroke="${hairColor}" stroke-width="3" fill="none" />`;
        } else if (hairStyle === 4) { // Long
            svg += `<path d="M18 26 Q32 12 46 26 L46 35 Q32 30 18 35 Z" fill="${hairColor}" />`;
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
