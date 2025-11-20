import { MaterialType, ProductType } from '~/types';

export class ProductVisualizer {
    static generate(productType: ProductType, materialType: MaterialType, quality: number = 1): string {
        const color = this._getMaterialColor(materialType);

        let svg = `<svg width="100%" height="100%" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">`;

        // Glow/Background
        svg += `<defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>`;
        svg += `<circle cx="64" cy="64" r="50" fill="${color}" opacity="0.1" filter="url(#glow)" />`;

        // Pedestal (Standard for all)
        svg += this._drawPedestal();

        // Product Shape
        switch (productType) {
            case ProductType.BUST:
                svg += this._drawBust(color);
                break;
            case ProductType.STATUE:
                svg += this._drawStatue(color);
                break;
            case ProductType.SARCOPHAGUS:
                svg += this._drawSarcophagus(color);
                break;
            case ProductType.AMPHORA:
                svg += this._drawAmphora(color);
                break;
            case ProductType.COLUMN:
                svg += this._drawColumn(color);
                break;
            case ProductType.RELIEF:
                svg += this._drawRelief(color);
                break;
        }

        // Cracks (Low Quality)
        if (quality < 0.5) {
            svg += this._drawCracks();
        }

        svg += `</svg>`;
        return svg;
    }

    private static _getMaterialColor(material: MaterialType): string {
        switch (material) {
            case MaterialType.CLAY: return '#d2691e';
            case MaterialType.LIMESTONE: return '#e8e4c9';
            case MaterialType.MARBLE_PENTELIC: return '#fffdd0';
            case MaterialType.BASALT: return '#2f2f2f';
            case MaterialType.RUBBLE: return '#7f7f7f';
            default: return '#cccccc';
        }
    }

    private static _drawPedestal(): string {
        return `
            <rect x="34" y="100" width="60" height="10" fill="#7f7f7f" />
            <rect x="29" y="110" width="70" height="5" fill="#5f5f5f" />
        `;
    }

    private static _drawBust(color: string): string {
        return `
            <!-- Base -->
            <path d="M44 100 L44 80 Q64 90 84 80 L84 100 Z" fill="${color}" />
            <!-- Shoulders -->
            <path d="M34 80 Q64 90 94 80 L94 60 Q64 70 34 60 Z" fill="${color}" />
            <!-- Head -->
            <circle cx="64" cy="40" r="20" fill="${color}" />
        `;
    }

    private static _drawStatue(color: string): string {
        return `
            <!-- Legs -->
            <rect x="54" y="70" width="8" height="30" fill="${color}" />
            <rect x="66" y="70" width="8" height="30" fill="${color}" />
            <!-- Torso -->
            <rect x="50" y="40" width="28" height="30" rx="2" fill="${color}" />
            <!-- Arms -->
            <rect x="42" y="40" width="6" height="25" fill="${color}" />
            <rect x="80" y="40" width="6" height="25" fill="${color}" />
            <!-- Head -->
            <circle cx="64" cy="30" r="10" fill="${color}" />
        `;
    }

    private static _drawSarcophagus(color: string): string {
        return `
            <!-- Box -->
            <rect x="24" y="60" width="80" height="40" fill="${color}" />
            <!-- Lid -->
            <path d="M20 60 L108 60 L100 40 L28 40 Z" fill="${color}" opacity="0.9" />
            <!-- Detail -->
            <rect x="34" y="70" width="60" height="20" fill="none" stroke="#000" stroke-opacity="0.1" stroke-width="2" />
        `;
    }

    private static _drawAmphora(color: string): string {
        return `
            <!-- Body -->
            <path d="M44 100 Q24 60 44 40 L84 40 Q104 60 84 100 Z" fill="${color}" />
            <!-- Neck -->
            <rect x="54" y="20" width="20" height="20" fill="${color}" />
            <!-- Handles -->
            <path d="M44 50 Q30 40 44 30" stroke="${color}" stroke-width="4" fill="none" />
            <path d="M84 50 Q98 40 84 30" stroke="${color}" stroke-width="4" fill="none" />
        `;
    }

    private static _drawColumn(color: string): string {
        return `
            <!-- Base -->
            <rect x="44" y="90" width="40" height="10" fill="${color}" />
            <!-- Shaft -->
            <rect x="50" y="30" width="28" height="60" fill="${color}" />
            <!-- Fluting (Lines) -->
            <line x1="57" y1="30" x2="57" y2="90" stroke="#000" stroke-opacity="0.1" />
            <line x1="64" y1="30" x2="64" y2="90" stroke="#000" stroke-opacity="0.1" />
            <line x1="71" y1="30" x2="71" y2="90" stroke="#000" stroke-opacity="0.1" />
            <!-- Capital -->
            <path d="M40 30 L88 30 L80 15 L48 15 Z" fill="${color}" />
        `;
    }

    private static _drawRelief(color: string): string {
        return `
            <!-- Slab -->
            <rect x="24" y="30" width="80" height="70" fill="${color}" />
            <!-- Frame -->
            <rect x="24" y="30" width="80" height="70" fill="none" stroke="#5f5f5f" stroke-width="4" />
            <!-- Art (Abstract figures) -->
            <path d="M34 50 Q44 40 54 50 T74 50 T94 50" stroke="#5f5f5f" stroke-width="2" fill="none" opacity="0.5" />
            <path d="M34 70 Q44 60 54 70 T74 70 T94 70" stroke="#5f5f5f" stroke-width="2" fill="none" opacity="0.5" />
            <circle cx="64" cy="60" r="5" fill="#5f5f5f" opacity="0.3" />
        `;
    }

    private static _drawCracks(): string {
        return `
            <path d="M50 50 L60 60 L55 70 L65 80" stroke="#3e2723" stroke-width="1" fill="none" opacity="0.6" />
        `;
    }
}
