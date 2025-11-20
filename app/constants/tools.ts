import { type Tool, WorkerType } from '~/types';

export const TOOLS: Record<string, Tool> = {
    BRONZE_CHISEL: {
        id: 'BRONZE_CHISEL',
        name: 'Bronz Keski',
        description: 'Temel yontma aleti. Hızı %10 artırır.',
        cost: 50,
        effect: { type: 'speed', value: 0.1 },
        allowedWorkerTypes: [WorkerType.SLAVE, WorkerType.APPRENTICE, WorkerType.MASTER]
    },
    IRON_HAMMER: {
        id: 'IRON_HAMMER',
        name: 'Demir Çekiç',
        description: 'Daha sert vuruşlar. Hızı %25 artırır.',
        cost: 150,
        effect: { type: 'speed', value: 0.25 },
        allowedWorkerTypes: [WorkerType.APPRENTICE, WorkerType.MASTER]
    },
    STEEL_SET: {
        id: 'STEEL_SET',
        name: 'Çelik Alet Seti',
        description: 'Usta işi. Hızı %40 artırır, riski %10 azaltır.',
        cost: 500,
        effect: { type: 'speed', value: 0.4 }, // Note: Multi-effect handling might need logic update, for now primary is speed
        allowedWorkerTypes: [WorkerType.MASTER]
    },
    POLISHING_CLOTH: {
        id: 'POLISHING_CLOTH',
        name: 'Özel Cila Bezi',
        description: 'Son dokunuşlar. Kaliteyi/Prestiji %20 artırır.',
        cost: 200,
        effect: { type: 'quality', value: 0.2 },
        allowedWorkerTypes: [WorkerType.APPRENTICE, WorkerType.MASTER]
    }
};
