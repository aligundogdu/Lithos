import { type Product, ProductType } from '~/types';

export const PRODUCTS: Record<string, Product> = {
    // --- ARENA VE GLADYATÖR ---
    'gladiator_bust_secutor': {
        id: 'gladiator_bust_secutor',
        name: 'Gladyatör Büstü (Secutor)',
        size: 1.2,
        complexity: 2.0,
        category: 'arena',
        visualType: ProductType.BUST
    },
    'gladiator_bust_murmillo': {
        id: 'gladiator_bust_murmillo',
        name: 'Gladyatör Büstü (Murmillo)',
        size: 1.3,
        complexity: 2.2,
        category: 'arena',
        visualType: ProductType.BUST
    },
    'gladiator_helmet_model': {
        id: 'gladiator_helmet_model',
        name: 'Taş Miğfer Modeli',
        size: 0.5,
        complexity: 1.8,
        category: 'arena',
        visualType: ProductType.BUST // Close enough
    },
    'victory_stele': {
        id: 'victory_stele',
        name: 'Zafer Steli (Arena)',
        size: 2.5,
        complexity: 1.5,
        category: 'arena',
        visualType: ProductType.RELIEF
    },
    'chariot_relief': {
        id: 'chariot_relief',
        name: 'Savaş Arabası Rölyefi',
        size: 3.0,
        complexity: 2.8,
        category: 'arena',
        visualType: ProductType.RELIEF
    },

    // --- ÖLÜM VE ANITLAR ---
    'cinerary_urn': {
        id: 'cinerary_urn',
        name: 'Kül Urnası (Urn)',
        size: 0.4,
        complexity: 1.5,
        category: 'funerary',
        visualType: ProductType.AMPHORA
    },
    'ossuary_box': {
        id: 'ossuary_box',
        name: 'Kemik Kutusu (Ossuary)',
        size: 0.6,
        complexity: 1.2,
        category: 'funerary',
        visualType: ProductType.SARCOPHAGUS
    },
    'weeping_figure': {
        id: 'weeping_figure',
        name: 'Ağlayan Kadın Heykeli',
        size: 2.5,
        complexity: 3.5,
        category: 'funerary',
        visualType: ProductType.STATUE
    },
    'grave_lion': {
        id: 'grave_lion',
        name: 'Mezar Aslanı',
        size: 3.0,
        complexity: 2.5,
        category: 'funerary',
        visualType: ProductType.STATUE
    },
    'family_sarcophagus': {
        id: 'family_sarcophagus',
        name: 'Aile Lahiti (Devasa)',
        size: 12.0,
        complexity: 3.0,
        category: 'funerary',
        visualType: ProductType.SARCOPHAGUS
    },

    // --- DUVAR SANATI VE DEKORASYON ---
    'relief_mythology': {
        id: 'relief_mythology',
        name: 'Mitolojik Duvar Rölyefi',
        size: 4.0,
        complexity: 4.0,
        category: 'relief',
        visualType: ProductType.RELIEF
    },
    'relief_harvest': {
        id: 'relief_harvest',
        name: 'Hasat Sahnesi Paneli',
        size: 3.5,
        complexity: 3.0,
        category: 'relief',
        visualType: ProductType.RELIEF
    },
    'mosaic_panel': {
        id: 'mosaic_panel',
        name: 'Taş Mozaik Panel',
        size: 2.0,
        complexity: 5.0,
        category: 'mosaic',
        visualType: ProductType.RELIEF
    },
    'theater_mask': {
        id: 'theater_mask',
        name: 'Tiyatro Maskı (Trajedi)',
        size: 0.8,
        complexity: 2.0,
        category: 'art',
        visualType: ProductType.BUST
    },
    'theater_mask_comedy': {
        id: 'theater_mask_comedy',
        name: 'Tiyatro Maskı (Komedi)',
        size: 0.8,
        complexity: 2.0,
        category: 'art',
        visualType: ProductType.BUST
    },

    // --- ŞEHİR VE BAHÇE ---
    'sundial': {
        id: 'sundial',
        name: 'Güneş Saati',
        size: 1.5,
        complexity: 3.5,
        category: 'civic',
        visualType: ProductType.COLUMN // Best fit
    },
    'milestone': {
        id: 'milestone',
        name: 'Roma Mil Taşı',
        size: 4.0,
        complexity: 0.5,
        category: 'civic',
        visualType: ProductType.COLUMN
    },
    'fountain_head': {
        id: 'fountain_head',
        name: 'Aslan Ağızlı Çeşme',
        size: 1.0,
        complexity: 2.5,
        category: 'garden',
        visualType: ProductType.BUST
    },
    'garden_nymph': {
        id: 'garden_nymph',
        name: 'Su Perisi (Nymph)',
        size: 2.0,
        complexity: 3.0,
        category: 'garden',
        visualType: ProductType.STATUE
    },
    'herma_boundary': {
        id: 'herma_boundary',
        name: 'Sınır Taşı (Herma)',
        size: 1.8,
        complexity: 1.5,
        category: 'civic',
        visualType: ProductType.COLUMN
    },

    // --- MİSTİK VE TIP ---
    'votive_foot': {
        id: 'votive_foot',
        name: 'Adak Ayak',
        size: 0.2,
        complexity: 1.0,
        category: 'votive',
        visualType: ProductType.BUST // Small object
    },
    'votive_ear': {
        id: 'votive_ear',
        name: 'Adak Kulak',
        size: 0.1,
        complexity: 0.9,
        category: 'votive',
        visualType: ProductType.BUST
    },
    'votive_bull': {
        id: 'votive_bull',
        name: 'Adak Boğa Figürü',
        size: 0.5,
        complexity: 1.5,
        category: 'votive',
        visualType: ProductType.STATUE
    }
};
