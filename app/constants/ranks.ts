import { MaterialType, WorkerType } from '~/types';

export interface Rank {
    id: number;
    title: string;
    minReputation: number;
    unlocks: string[];
    bonuses: {
        maxWorkers: number;
        unlockedMaterials: MaterialType[];
        unlockedWorkerTypes: WorkerType[];
        marketDiscount?: number;
        productionSpeed?: number;
    };
}

export const RANKS: Rank[] = [
    {
        id: 1,
        title: 'Çamur Toplayıcı',
        minReputation: 0,
        unlocks: ['Clay', 'Max İşçi: 2'],
        bonuses: {
            maxWorkers: 2,
            unlockedMaterials: [MaterialType.CLAY],
            unlockedWorkerTypes: [WorkerType.SLAVE]
        }
    },
    {
        id: 2,
        title: 'Moloz Temizleyicisi',
        minReputation: 500,
        unlocks: ['Market', 'Rubble Satış +%10'],
        bonuses: {
            maxWorkers: 2,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE],
            unlockedWorkerTypes: [WorkerType.SLAVE]
        }
    },
    {
        id: 3,
        title: 'Acemi Yontucu',
        minReputation: 2500,
        unlocks: ['Limestone', 'Max İşçi: 4'],
        bonuses: {
            maxWorkers: 4,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE],
            unlockedWorkerTypes: [WorkerType.SLAVE]
        }
    },
    {
        id: 4,
        title: 'Taş İşçisi',
        minReputation: 10000,
        unlocks: ['Sandstone (Gelecek)'], // Placeholder for Sandstone if not yet in enum
        bonuses: {
            maxWorkers: 4,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE],
            unlockedWorkerTypes: [WorkerType.SLAVE]
        }
    },
    {
        id: 5,
        title: 'Mezar Taşı Oyucusu',
        minReputation: 35000,
        unlocks: ['Çırak (Apprentice)'],
        bonuses: {
            maxWorkers: 4,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE]
        }
    },
    {
        id: 6,
        title: 'Atölye Kalfası',
        minReputation: 100000,
        unlocks: ['Atölye Görünümü: Ahşap Çatı', 'Max İşçi: 8'],
        bonuses: {
            maxWorkers: 8,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE]
        }
    },
    {
        id: 7,
        title: 'Agora Zanaatkarı',
        minReputation: 250000,
        unlocks: ['Prokonnesos Mermeri', 'Pazar İndirimi %5'],
        bonuses: {
            maxWorkers: 8,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC], // Using Pentelic as placeholder for Prokonnesos if needed, or just add to enum later
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE],
            marketDiscount: 0.05
        }
    },
    {
        id: 8,
        title: 'Mermer Ustası',
        minReputation: 750000,
        unlocks: ['Usta (Master)'],
        bonuses: {
            maxWorkers: 8,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
        }
    },
    {
        id: 9,
        title: 'Heykeltıraş',
        minReputation: 2000000,
        unlocks: ['Atölye Görünümü: Taş Bina', 'Üretim Hızı +%10'],
        bonuses: {
            maxWorkers: 8,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER],
            productionSpeed: 0.1
        }
    },
    {
        id: 10,
        title: 'Baş Heykeltıraş',
        minReputation: 5000000,
        unlocks: ['Pentelic Mermer', 'Max İşçi: 15'],
        bonuses: {
            maxWorkers: 15,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
        }
    },
    {
        id: 11,
        title: 'Şehir Mimarı',
        minReputation: 15000000,
        unlocks: ['Akademi Geliri x2', 'Vali Siparişleri'],
        bonuses: {
            maxWorkers: 15,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
        }
    },
    {
        id: 12,
        title: 'İmparatorluk Sanatçısı',
        minReputation: 50000000,
        unlocks: ['Bazalt', 'Granit', 'Atölye: Mermer Villa'],
        bonuses: {
            maxWorkers: 15,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC, MaterialType.BASALT],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
        }
    },
    {
        id: 13,
        title: 'Kraliyet Danışmanı',
        minReputation: 150000000,
        unlocks: ['Altın Kaplama', 'Fildişi'],
        bonuses: {
            maxWorkers: 15,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC, MaterialType.BASALT],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
        }
    },
    {
        id: 14,
        title: 'Yaşayan Efsane',
        minReputation: 500000000,
        unlocks: ['Dünya Harikası Görevi'],
        bonuses: {
            maxWorkers: 15,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC, MaterialType.BASALT],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
        }
    },
    {
        id: 15,
        title: 'Tanrıların Eli',
        minReputation: 1000000000,
        unlocks: ['Oyun Sonu / Prestige'],
        bonuses: {
            maxWorkers: 15,
            unlockedMaterials: [MaterialType.CLAY, MaterialType.RUBBLE, MaterialType.LIMESTONE, MaterialType.MARBLE_PENTELIC, MaterialType.BASALT],
            unlockedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
        }
    }
];
