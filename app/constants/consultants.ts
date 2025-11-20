import { ConsultantType, type Consultant } from '~/types';

export const CONSULTANTS: Record<string, Consultant> = {
    'merchant_1': {
        id: 'merchant_1',
        type: ConsultantType.MERCHANT,
        name: 'Kurnaz Tüccar',
        description: 'Pazar bağlantıları sayesinde hammadde maliyetlerini %10 düşürür.',
        cost: 500,
        salary: 50,
        minReputation: 100,
        effect: { type: 'discount', value: 0.10 }
    },
    'philosopher_1': {
        id: 'philosopher_1',
        type: ConsultantType.PHILOSOPHER,
        name: 'Bilge Filozof',
        description: 'Atölyenizin prestijini artırır. Her gün +2 İtibar kazandırır.',
        cost: 800,
        salary: 80,
        minReputation: 300,
        effect: { type: 'reputation', value: 2 }
    },
    'architect_1': {
        id: 'architect_1',
        type: ConsultantType.ARCHITECT,
        name: 'Usta Mimar',
        description: 'Üretim süreçlerini optimize eder. Üretim hızını %20 artırır.',
        cost: 1200,
        salary: 150,
        minReputation: 600,
        effect: { type: 'speed', value: 0.20 }
    },
    'supplier_1': {
        id: 'supplier_1',
        type: ConsultantType.SUPPLIER,
        name: 'Sadık Tedarikçi',
        description: 'Belirlediğiniz stok seviyesinin altına düşen hammaddeleri otomatik olarak satın alır.',
        cost: 1000,
        salary: 100,
        minReputation: 400,
        effect: { type: 'automation', value: 0 } // Value unused, settings used instead
    },
    'lobbyist_1': {
        id: 'lobbyist_1',
        type: ConsultantType.LOBBYIST,
        name: 'Saray Temsilcisi',
        description: 'Saraydaki bağlantılarıyla daha sık ve karlı siparişler getirir.',
        cost: 1500,
        salary: 200,
        minReputation: 800,
        effect: { type: 'sales', value: 0.20 } // 20% bonus
    }
};
