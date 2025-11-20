import { MaterialType, type Material } from '~/types';

export const MATERIALS: Record<MaterialType, Material> = {
    [MaterialType.CLAY]: {
        id: MaterialType.CLAY,
        name: 'Nehir Kili',
        hardness: 0.5,
        brittleness: 0.1,
        prestige: 1,
        basePrice: 10, // Small profit
        description: 'Nehir yatağından toplanan yumuşak çamur. Başlangıç için ideal.'
    },
    [MaterialType.LIMESTONE]: {
        id: MaterialType.LIMESTONE,
        name: 'Kireç Taşı',
        hardness: 2,
        brittleness: 0.3,
        prestige: 5,
        basePrice: 50,
        description: 'İşlemesi kolay, yaygın bulunan bir taş.',
        unlockCondition: 'Acemi Yontucu (Tier 3)'
    },
    [MaterialType.MARBLE_PENTELIC]: {
        id: MaterialType.MARBLE_PENTELIC,
        name: 'Pentelik Mermer',
        hardness: 5,
        brittleness: 0.6,
        prestige: 20,
        basePrice: 300,
        description: 'Atina\'nın gururu. Saf beyaz ve kusursuz.',
        unlockCondition: 'Agora Zanaatkarı (Tier 7)'
    },
    [MaterialType.BASALT]: {
        id: MaterialType.BASALT,
        name: 'Siyah Bazalt',
        hardness: 8,
        brittleness: 0.2,
        prestige: 50,
        basePrice: 800,
        description: 'Son derece sert ve işlemesi zor. Krallara layık.',
        unlockCondition: 'İmparatorluk Sanatçısı (Tier 12)'
    },
    [MaterialType.RUBBLE]: {
        id: MaterialType.RUBBLE,
        name: 'Moloz',
        hardness: 0,
        brittleness: 0,
        prestige: 1,
        basePrice: 8,
        description: 'Üretim artığı taş parçaları. Az da olsa bir değeri vardır.'
    }
};
