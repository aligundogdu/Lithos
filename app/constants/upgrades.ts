import { type Upgrade } from '~/types';

export const UPGRADES: Record<string, Upgrade> = {
    'basic_techniques': {
        id: 'basic_techniques',
        name: 'Temel Yontma Teknikleri',
        description: 'İşçileriniz taşı daha hızlı yontmayı öğrenir. Üretim hızı %10 artar.',
        cost: 500,
        effect: {
            type: 'speed',
            value: 0.1
        },
        requirements: {
            rankIndex: 1 // Moloz Temizleyicisi
        }
    },
    'workshop_organization': {
        id: 'workshop_organization',
        name: 'Atölye Düzeni',
        description: 'Daha düzenli bir çalışma ortamı. Üretim hızı %5 artar.',
        cost: 1000,
        effect: {
            type: 'speed',
            value: 0.05
        },
        requirements: {
            rankIndex: 2,
            previousUpgradeId: 'basic_techniques'
        }
    },
    'market_connections': {
        id: 'market_connections',
        name: 'Pazar Bağlantıları',
        description: 'Pazardaki tüccarlarla iyi ilişkiler. Alet maliyetleri %5 düşer.',
        cost: 2000,
        effect: {
            type: 'market',
            value: 0.05
        },
        requirements: {
            rankIndex: 3
        }
    },
    'advanced_tools_training': {
        id: 'advanced_tools_training',
        name: 'Gelişmiş Alet Eğitimi',
        description: 'İşçiler aletleri daha verimli kullanır. Üretim hızı %15 artar.',
        cost: 5000,
        effect: {
            type: 'speed',
            value: 0.15
        },
        requirements: {
            rankIndex: 4,
            previousUpgradeId: 'workshop_organization'
        }
    },
    'apprentice_school': {
        id: 'apprentice_school',
        name: 'Çırak Okulu',
        description: 'Yeni alınan işçiler daha tecrübeli başlar (Seviye 2).',
        cost: 10000,
        effect: {
            type: 'unlock', // Special handling in hireWorker
            value: 1
        },
        requirements: {
            rankIndex: 5
        }
    }
};
