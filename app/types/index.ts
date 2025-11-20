export enum MaterialType {
    CLAY = 'clay',
    LIMESTONE = 'limestone',
    MARBLE_PENTELIC = 'marble_pentelic',
    BASALT = 'basalt',
    RUBBLE = 'rubble'
}

export enum WorkerType {
    SLAVE = 'slave',
    APPRENTICE = 'apprentice',
    MASTER = 'master',
    CONSULTANT = 'consultant'
}

export enum Rank {
    NOVICE = 'novice',
    INTERMEDIATE = 'intermediate',
    EXPERT = 'expert'
}

export enum Season {
    SPRING = 'spring',
    SUMMER = 'summer',
    AUTUMN = 'autumn',
    WINTER = 'winter'
}

export interface DailyState {
    id: string;
    text: string;
    effect: {
        speed?: number;
        risk?: number;
        quality?: number;
    };
}

export interface Material {
    id: MaterialType;
    name: string;
    hardness: number; // Affects duration
    brittleness: number; // Affects risk
    prestige: number; // Affects reputation gain
    basePrice: number;
    description: string;
    unlockCondition?: string; // Text to show when locked
}

export interface Student {
    id: string;
    name: string;
    arrivalTime: number; // Game time when accepted
    duration: number; // How long they stay (in minutes)
    tuitionFee: number;
}

export interface Worker {
    id: string;
    type: WorkerType;
    name: string;
    // cost: number; // Removed: Workers are now hired for free (or maybe a small fee?) but paid monthly. For now, free to hire.
    skill: number; // Reduces risk, increases speed (for some types)
    salary: number; // Daily cost -> Monthly salary
    status: 'idle' | 'working';
    equippedToolIds: string[]; // Max 2
    // RPG Stats
    experience: number;
    level: number;
    loyalty: number; // 0-100
    lastWorkedAt: number; // Game time
    baseSkill: number;
    negotiationPending?: boolean;
    dailyState?: DailyState;
}

export enum ProductType {
    BUST = 'bust',
    STATUE = 'statue',
    SARCOPHAGUS = 'sarcophagus',
    AMPHORA = 'amphora',
    COLUMN = 'column',
    RELIEF = 'relief'
}

export interface Product {
    id: string;
    name: string;
    size: number;
    complexity: number;
    category: string;
    visualType: ProductType;
}

export interface Order {
    id: string;
    materialType: MaterialType;
    productId: string; // Added
    productType: ProductType; // Kept for visualizer compatibility
    difficulty: number; // Multiplier for duration
    reward: number;
    reputationReward: number;
    deadline: number; // Game days
    createdAt: number; // Game day
}

export interface ProductionTask {
    id: string;
    orderId: string | null; // Null if making for stock
    materialType: MaterialType;
    productId: string; // Product ID from PRODUCTS
    productType: ProductType; // Visual type for ProductVisualizer
    assignedWorkers: string[]; // Worker IDs
    progress: number; // 0-100
    totalDuration: number; // In game minutes (ticks)
    currentDuration: number;
    risk: number; // Calculated risk
    status: 'pending' | 'active' | 'completed' | 'failed';
    currentStage: 'roughing' | 'detailing' | 'inspection';
}

export interface GameState {
    money: number;
    reputation: number;
    inventory: Record<MaterialType, number>;
    workers: Worker[];
    activeOrders: Order[];
    productionTasks: ProductionTask[];
    students: Student[];
    gameTime: number; // Total minutes passed
    lastSaveTime: number; // Real timestamp
    monthlyExpenses: number;
    lastPaidDay: number; // Game day when expenses were last paid
    taxRate: number; // Percentage or fixed amount? Let's say fixed for now based on rep.
    notifications: Notification[];
    messages: Message[];
    toolInventory: Record<string, number>; // Tool ID -> Quantity
    purchasedUpgradeIds: string[];
    activeResearch: {
        upgradeId: string;
        progress: number; // Current minutes researched
        totalDuration: number; // Total minutes required
    } | null;
    activeConsultantIds: string[];
    supplierSettings: Record<MaterialType, number>; // MaterialType -> Threshold
    currentRankIndex: number; // 0-14
}

export enum ConsultantType {
    MERCHANT = 'merchant',
    PHILOSOPHER = 'philosopher',
    ARCHITECT = 'architect',
    SUPPLIER = 'supplier',
    LOBBYIST = 'lobbyist'
}

export interface Consultant {
    id: string;
    type: ConsultantType;
    name: string;
    description: string;
    cost: number; // Hiring cost
    salary: number; // Monthly salary
    minReputation: number;
    effect: {
        type: 'discount' | 'reputation' | 'speed' | 'automation' | 'sales';
        value: number; // Percentage or flat amount
        target?: string; // For automation (e.g., 'clay')
    };
}

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    reputationCost?: number;
    effect: {
        type: 'speed' | 'cost' | 'quality' | 'unlock' | 'efficiency' | 'market';
        value: number;
        target?: string;
    };
    requirements?: {
        rankIndex?: number;
        previousUpgradeId?: string;
    };
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: {
        type: 'speed' | 'risk' | 'quality';
        value: number; // Percentage (e.g., 0.1 for 10%)
    };
    allowedWorkerTypes: WorkerType[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: number;
}

export interface Message {
    id: string;
    sender: string;
    subject: string;
    body: string;
    timestamp: number;
    read: boolean;
    actions?: { label: string; action: string }[]; // For future interactivity
}
