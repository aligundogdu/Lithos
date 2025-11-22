import { computed } from 'vue';
import { Season } from '~/types';

export interface SeasonalColorPalette {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    accentLight: string;
    background: string;
    backgroundLight: string;
    border: string;
    text: string;
    textSecondary: string;
}

const SEASONAL_PALETTES: Record<Season, SeasonalColorPalette> = {
    [Season.SPRING]: {
        primary: '#10b981', // emerald-500
        primaryLight: '#34d399', // emerald-400
        primaryDark: '#059669', // emerald-600
        accent: '#ec4899', // pink-500
        accentLight: '#f9a8d4', // pink-300
        background: '#1c2e1c', // dark green-tinted
        backgroundLight: '#2d4a2d',
        border: '#10b981',
        text: '#d1fae5', // emerald-100
        textSecondary: '#6ee7b7', // emerald-300
    },
    [Season.SUMMER]: {
        primary: '#f59e0b', // amber-500
        primaryLight: '#fbbf24', // amber-400
        primaryDark: '#d97706', // amber-600
        accent: '#eab308', // yellow-500
        accentLight: '#fde047', // yellow-300
        background: '#2d2416', // warm dark brown
        backgroundLight: '#3d3420',
        border: '#f59e0b',
        text: '#fef3c7', // amber-100
        textSecondary: '#fcd34d', // amber-300
    },
    [Season.AUTUMN]: {
        primary: '#ea580c', // orange-600
        primaryLight: '#fb923c', // orange-400
        primaryDark: '#c2410c', // orange-700
        accent: '#dc2626', // red-600
        accentLight: '#f87171', // red-400
        background: '#1c1917', // stone-900
        backgroundLight: '#292524', // stone-800
        border: '#ea580c',
        text: '#fed7aa', // orange-200
        textSecondary: '#fdba74', // orange-300
    },
    [Season.WINTER]: {
        primary: '#0ea5e9', // sky-500
        primaryLight: '#38bdf8', // sky-400
        primaryDark: '#0284c7', // sky-600
        accent: '#60a5fa', // blue-400
        accentLight: '#93c5fd', // blue-300
        background: '#0c1e2e', // dark blue-tinted
        backgroundLight: '#1e3a4e',
        border: '#0ea5e9',
        text: '#e0f2fe', // sky-100
        textSecondary: '#7dd3fc', // sky-300
    },
};

export function useSeasonalColors(currentSeason: Season) {
    const palette = computed(() => SEASONAL_PALETTES[currentSeason]);

    // Helper to get Tailwind classes for specific elements
    const getSeasonalClasses = (element: 'header' | 'card' | 'border' | 'button' | 'progress') => {
        const season = currentSeason;

        switch (element) {
            case 'header':
                return {
                    [Season.SPRING]: 'text-emerald-400',
                    [Season.SUMMER]: 'text-amber-400',
                    [Season.AUTUMN]: 'text-orange-400',
                    [Season.WINTER]: 'text-sky-400',
                }[season];

            case 'card':
                return {
                    [Season.SPRING]: 'bg-emerald-900/20 border-emerald-600/50',
                    [Season.SUMMER]: 'bg-amber-900/20 border-amber-600/50',
                    [Season.AUTUMN]: 'bg-orange-900/20 border-orange-600/50',
                    [Season.WINTER]: 'bg-sky-900/20 border-sky-600/50',
                }[season];

            case 'border':
                return {
                    [Season.SPRING]: 'border-emerald-500',
                    [Season.SUMMER]: 'border-amber-500',
                    [Season.AUTUMN]: 'border-orange-500',
                    [Season.WINTER]: 'border-sky-500',
                }[season];

            case 'button':
                return {
                    [Season.SPRING]: 'bg-emerald-600 hover:bg-emerald-500 text-white',
                    [Season.SUMMER]: 'bg-amber-600 hover:bg-amber-500 text-white',
                    [Season.AUTUMN]: 'bg-orange-600 hover:bg-orange-500 text-white',
                    [Season.WINTER]: 'bg-sky-600 hover:bg-sky-500 text-white',
                }[season];

            case 'progress':
                return {
                    [Season.SPRING]: 'bg-emerald-500',
                    [Season.SUMMER]: 'bg-amber-500',
                    [Season.AUTUMN]: 'bg-orange-500',
                    [Season.WINTER]: 'bg-sky-500',
                }[season];

            default:
                return '';
        }
    };

    return {
        palette,
        getSeasonalClasses,
    };
}
