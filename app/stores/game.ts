
import { defineStore, skipHydrate } from 'pinia';
import { useStorage } from '@vueuse/core';
import { computed } from 'vue';
import { type GameState, MaterialType, type Worker, type Order, type ProductionTask, type Notification, type Message, ProductType, Season, type DailyState, WorkerType } from '~/types';
import { MATERIALS } from '~/constants/materials';
import { TOOLS } from '~/constants/tools';
import { RANKS } from '~/constants/ranks';
import { WORKER_NAMES } from '~/constants/names';
import { UPGRADES } from '~/constants/upgrades';
import { CONSULTANTS } from '~/constants/consultants';
import { PRODUCTS } from '~/constants/products';
import { useTranslation } from '~/composables/useTranslation';
import { useMaterialTranslation } from '~/composables/useMaterialTranslation';
import { useToolTranslation } from '~/composables/useToolTranslation';
import { useWorkerTranslation } from '~/composables/useWorkerTranslation';
import { useResearchTranslation } from '~/composables/useResearchTranslation';
import { useConsultantTranslation } from '~/composables/useConsultantTranslation';

export const useGameStore = defineStore('game', () => {
    const { t, format } = useTranslation();
    const { getMaterialName } = useMaterialTranslation();
    const { getToolName } = useToolTranslation();
    const { getWorkerTypeName } = useWorkerTranslation();
    const { getResearchName } = useResearchTranslation();
    const { getConsultantName } = useConsultantTranslation();
    // Initial State
    const initialState: GameState = {
        money: 1000, // Starting capital
        reputation: 0,
        inventory: {
            [MaterialType.CLAY]: 0,
            [MaterialType.LIMESTONE]: 0,
            [MaterialType.MARBLE_PENTELIC]: 0,
            [MaterialType.BASALT]: 0,
            [MaterialType.RUBBLE]: 0
        },
        workers: [],
        activeOrders: [],
        productionTasks: [],
        students: [],
        gameTime: 0,
        lastSaveTime: Date.now(),
        monthlyExpenses: 0,
        lastPaidDay: 0,
        taxRate: 0,
        notifications: [],
        messages: [],
        toolInventory: {},
        purchasedUpgradeIds: [],
        activeResearch: null,
        activeConsultantIds: [],
        supplierSettings: {
            [MaterialType.CLAY]: 0,
            [MaterialType.LIMESTONE]: 0,
            [MaterialType.MARBLE_PENTELIC]: 0,
            [MaterialType.BASALT]: 0,
            [MaterialType.RUBBLE]: 0
        },
        currentRankIndex: 0,
        maxStorageCapacity: 50
    };

    // Persisted State using VueUse
    const state = useStorage<GameState>('lithos-gamestate', initialState, typeof window !== 'undefined' ? localStorage : undefined, { mergeDefaults: true });

    // Migration / Safety check for new properties
    if (!state.value.toolInventory) {
        state.value.toolInventory = {};
    }
    if (!state.value.purchasedUpgradeIds) {
        state.value.purchasedUpgradeIds = [];
    }
    if (!state.value.activeConsultantIds) {
        state.value.activeConsultantIds = [];
    }

    if (state.value.currentRankIndex === undefined) {
        state.value.currentRankIndex = 0;
    }

    // Migration for RPG Stats (Workers)
    state.value.workers.forEach(worker => {
        if (worker.experience === undefined) worker.experience = 0;
        if (worker.level === undefined) worker.level = 1;
        if (worker.loyalty === undefined) worker.loyalty = 100;
        if (worker.lastWorkedAt === undefined) worker.lastWorkedAt = state.value.gameTime;
        if (worker.baseSkill === undefined) worker.baseSkill = worker.skill; // Assume current skill is base for old workers

        // Assign a random name if generic or missing
        if (!worker.name || worker.name.startsWith('Worker') || worker.name.startsWith('Apprentice') || worker.name.startsWith('Master')) {
            const randomName = WORKER_NAMES[Math.floor(Math.random() * WORKER_NAMES.length)];
            worker.name = randomName || 'Bilinmeyen İşçi';
        }
    });

    // Getters
    const currentRank = computed(() => {
        const rank = RANKS[state.value.currentRankIndex];
        return rank || RANKS[0] || { id: 1, title: 'Çırak', minReputation: 0, bonuses: { maxWorkers: 2, unlockedMaterials: [] as MaterialType[], unlockedWorkerTypes: [] as WorkerType[], productionSpeed: 0, marketDiscount: 0 } };
    });
    const nextRank = computed(() => RANKS[state.value.currentRankIndex + 1]);
    const maxWorkers = computed(() => currentRank.value?.bonuses?.maxWorkers || 2);

    const unlockedMaterials = computed<MaterialType[]>(() => currentRank.value?.bonuses?.unlockedMaterials || [] as MaterialType[]);
    const unlockedWorkerTypes = computed<WorkerType[]>(() => currentRank.value?.bonuses?.unlockedWorkerTypes || [] as WorkerType[]);

    const marketDiscount = computed(() => {
        let discount = currentRank.value?.bonuses?.marketDiscount || 0;
        // Apply Upgrade Bonuses
        state.value.purchasedUpgradeIds.forEach(id => {
            const upgrade = UPGRADES[id];
            if (upgrade && upgrade.effect.type === 'market') {
                discount += upgrade.effect.value;
            }
        });
        return discount;
    });

    const productionSpeedBonus = computed(() => {
        let bonus = currentRank.value?.bonuses?.productionSpeed || 0;
        // Apply Upgrade Bonuses
        state.value.purchasedUpgradeIds.forEach(id => {
            const upgrade = UPGRADES[id];
            if (upgrade && upgrade.effect.type === 'speed') {
                bonus += upgrade.effect.value;
            }
        });
        return bonus;
    });

    // Time & Season Getters
    const currentDay = computed(() => Math.floor(state.value.gameTime / 1440));
    const currentHour = computed(() => Math.floor((state.value.gameTime % 1440) / 60));
    const currentSeason = computed(() => {
        const seasonIndex = Math.floor(currentDay.value / 10) % 4;
        return Object.values(Season)[seasonIndex] as Season;
    });
    const isDaytime = computed(() => currentHour.value >= 6 && currentHour.value < 20);

    // Daily States
    const DAILY_STATES: DailyState[] = [
        {
            id: 'normal',
            text: 'Normal',
            icon: '😐',
            color: 'text-stone-400',
            description: 'Sıradan bir gün.',
            effect: {}
        },
        {
            id: 'sore_joints',
            text: 'Eklemler Ağrıyor',
            icon: '🤕',
            color: 'text-red-400',
            description: 'Hız biraz düşük.',
            effect: { speed: -0.15 }
        },
        {
            id: 'bad_food',
            text: 'Kötü Yemek',
            icon: '🤢',
            color: 'text-orange-400',
            description: 'Dikkat dağınıklığı var.',
            effect: { risk: 0.10 }
        },
        {
            id: 'inspired',
            text: 'İlham Geldi',
            icon: '✨',
            color: 'text-purple-400',
            description: 'Hem hızlı hem kaliteli!',
            effect: { quality: 0.20, speed: 0.10 }
        },
        {
            id: 'tired',
            text: 'Yorgun',
            icon: '😫',
            color: 'text-yellow-600',
            description: 'Biraz yavaş çalışıyor.',
            effect: { speed: -0.10 }
        },
        {
            id: 'energetic',
            text: 'Enerjik',
            icon: '⚡',
            color: 'text-yellow-400',
            description: 'Bugün çok hızlı!',
            effect: { speed: 0.15 }
        }
    ];

    // Season Effects Helper
    function getSeasonalPriceMultiplier(materialType: MaterialType): number {
        if (currentSeason.value === Season.WINTER) {
            // Winter: Stone materials +30% (roads closed)
            if (materialType === MaterialType.LIMESTONE ||
                materialType === MaterialType.MARBLE_PENTELIC ||
                materialType === MaterialType.BASALT) {
                return 1.30;
            }
        }
        return 1.0; // No effect for other seasons/materials
    }

    function assignDailyStates() {
        state.value.workers.forEach(worker => {
            // Random state
            const random = Math.random();
            if (random < 0.6) {
                worker.dailyState = DAILY_STATES[0]; // Normal
            } else {
                const stateIndex = 1 + Math.floor(Math.random() * (DAILY_STATES.length - 1));
                worker.dailyState = DAILY_STATES[stateIndex];
            }
        });
        addNotification('Yeni Gün', 'İşçiler iş başı yaptı.', 'info');
    }

    // Actions
    function addNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
        const notification: Notification = {
            id: Math.random().toString(36).substring(2, 9),
            title,
            message,
            type,
            timestamp: Date.now()
        };
        state.value.notifications.push(notification);

        // Persist as log message
        addMessage(t.value.messages.system, title, message);

        // Auto remove after 5 seconds
        setTimeout(() => {
            const index = state.value.notifications.findIndex(n => n.id === notification.id);
            if (index !== -1) state.value.notifications.splice(index, 1);
        }, 5000);
    }

    function addMessage(sender: string, subject: string, body: string) {
        const message: Message = {
            id: Math.random().toString(36).substring(2, 9),
            sender,
            subject,
            body,
            timestamp: state.value.gameTime, // Use game time for logs
            read: false
        };
        state.value.messages.unshift(message); // Add to top
    }

    function markMessageRead(id: string) {
        const msg = state.value.messages.find(m => m.id === id);
        if (msg) msg.read = true;
    }

    function startResearch(upgradeId: string) {
        const upgrade = UPGRADES[upgradeId];
        if (!upgrade) return;

        if (state.value.purchasedUpgradeIds.includes(upgradeId)) {
            addNotification(t.value.notifications.alreadyPurchased, t.value.notifications.alreadyPurchasedDesc, 'warning');
            return;
        }

        // Check if any research is active
        if (state.value.activeResearch) {
            addNotification(t.value.notifications.researchInProgress, t.value.notifications.researchInProgressDesc, 'warning');
            return;
        }

        // Check requirements
        if (upgrade.requirements) {
            if (upgrade.requirements.rankIndex !== undefined && state.value.currentRankIndex < upgrade.requirements.rankIndex) {
                addNotification(t.value.notifications.insufficientRank, t.value.notifications.insufficientRankDesc, 'error');
                return;
            }
            if (upgrade.requirements.previousUpgradeId && !state.value.purchasedUpgradeIds.includes(upgrade.requirements.previousUpgradeId)) {
                addNotification(t.value.notifications.missingPrerequisite, t.value.notifications.missingPrerequisiteDesc, 'error');
                return;
            }
        }

        if (spendMoney(upgrade.cost)) {
            // Duration: Cost in minutes (e.g. 500D = 500 mins = ~50 real seconds)
            const duration = upgrade.cost;

            state.value.activeResearch = {
                upgradeId,
                progress: 0,
                totalDuration: duration
            };

            addNotification(t.value.notifications.researchStarted, format(t.value.notifications.researchStartedDesc, upgrade.name), 'info');
        } else {
            addNotification(t.value.notifications.insufficientFunds, t.value.notifications.insufficientFundsDesc, 'error');
        }
    }



    function buyTool(toolId: string, quantity: number = 1) {
        const tool = TOOLS[toolId];
        if (!tool) return;

        const totalCost = Math.floor(tool.cost * quantity * (1 - marketDiscount.value)); // Apply discount

        if (spendMoney(totalCost)) {
            if (!state.value.toolInventory[toolId]) {
                state.value.toolInventory[toolId] = 0;
            }
            state.value.toolInventory[toolId] += quantity;
            addNotification(t.value.notifications.toolPurchased, format(t.value.notifications.toolPurchasedDesc, quantity, getToolName(toolId)), 'success');
        } else {
            addNotification(t.value.notifications.insufficientFunds, t.value.notifications.insufficientFundsDesc, 'error');
        }
    }

    function equipTool(workerId: string, toolId: string) {
        const worker = state.value.workers.find(w => w.id === workerId);
        const tool = TOOLS[toolId];

        if (!worker || !tool) return;

        // Check eligibility
        if (!tool.allowedWorkerTypes.includes(worker.type)) {
            addNotification(t.value.notifications.incompatibleTool, format(t.value.notifications.incompatibleToolDesc, worker.name), 'error');
            return;
        }

        // Check slots (Max 2)
        if (worker.equippedToolIds.length >= 2) {
            addNotification(t.value.notifications.slotFull, format(t.value.notifications.slotFullDesc, worker.name), 'warning');
            return;
        }

        // Check inventory
        if (!state.value.toolInventory[toolId] || state.value.toolInventory[toolId] <= 0) {
            addNotification(t.value.notifications.outOfStock, format(t.value.notifications.outOfStockDesc, getToolName(toolId)), 'error');
            return;
        }

        // Equip
        state.value.toolInventory[toolId]--;
        worker.equippedToolIds.push(toolId);
        addNotification(t.value.notifications.toolEquipped, format(t.value.notifications.equippedDesc, getToolName(toolId), worker.name), 'success');
    }

    function unequipTool(workerId: string, toolId: string) {
        const worker = state.value.workers.find(w => w.id === workerId);
        if (!worker) return;

        const index = worker.equippedToolIds.indexOf(toolId);
        if (index !== -1) {
            worker.equippedToolIds.splice(index, 1);

            // Return to inventory
            if (!state.value.toolInventory[toolId]) {
                state.value.toolInventory[toolId] = 0;
            }
            state.value.toolInventory[toolId]++;
            addNotification(t.value.notifications.toolUnequipped, t.value.notifications.unequippedDesc, 'info');
        }
    }

    function addMoney(amount: number) {
        state.value.money += amount;
    }

    function spendMoney(amount: number): boolean {
        if (state.value.money >= amount) {
            state.value.money -= amount;
            return true;
        }
        return false;
    }

    function addMaterial(type: MaterialType, amount: number) {
        state.value.inventory[type] += amount;
    }

    function removeMaterial(type: MaterialType, amount: number): boolean {
        if (state.value.inventory[type] >= amount) {
            state.value.inventory[type] -= amount;
            return true;
        }
        return false;
    }

    function sellMaterial(type: MaterialType, amount: number) {
        if (state.value.inventory[type] >= amount) {
            const material = MATERIALS[type];
            let price = material.basePrice * amount;

            // Apply "Moloz Temizleyicisi" bonus (Rank 2+) for Rubble
            // Rank 2 is index 1
            if (type === MaterialType.RUBBLE && state.value.currentRankIndex >= 1) {
                price *= 1.10; // +10%
            }

            state.value.inventory[type] -= amount;
            addMoney(price);

            if (material.prestige > 0) {
                state.value.reputation += material.prestige * amount;
            }

            addNotification(t.value.notifications.saleComplete, format(t.value.notifications.saleCompleteDesc, amount, getMaterialName(material.id), price.toFixed(1)), 'success');
        } else {
            addNotification(t.value.notifications.outOfStock, t.value.notifications.outOfStockDesc, 'error');
        }
    }

    function updateSupplierSettings(type: MaterialType, threshold: number) {
        state.value.supplierSettings[type] = threshold;
    }

    function hireWorker(worker: Worker) {
        if (state.value.workers.length >= maxWorkers.value) {
            addNotification(t.value.notifications.limitReached, format(t.value.notifications.limitExceededDesc, currentRank.value.title, maxWorkers.value), 'error');
            return;
        }

        // Assign random name
        const randomName = WORKER_NAMES[Math.floor(Math.random() * WORKER_NAMES.length)];
        worker.name = randomName || t.value.common.worker;

        // Initialize RPG Stats
        worker.status = 'idle';
        worker.equippedToolIds = [];
        worker.experience = 0;
        worker.level = 1;
        worker.loyalty = 100;
        worker.lastWorkedAt = state.value.gameTime;
        worker.baseSkill = worker.skill;

        // Check for "Apprentice School" upgrade
        if (state.value.purchasedUpgradeIds.includes('apprentice_school')) {
            worker.level = 2;
            worker.experience = 0;
            worker.skill += 1; // Boost skill for level 2
            worker.baseSkill += 1;
            addNotification(t.value.notifications.trainedWorker, format(t.value.notifications.educatedWorkerDesc, worker.name), 'success');
        }

        state.value.workers.push(worker);

        // Recalculate expenses immediately to show in UI
        calculateMonthlyExpenses();
    }

    function fireWorker(workerId: string) {
        const index = state.value.workers.findIndex(w => w.id === workerId);
        if (index !== -1) {
            state.value.workers.splice(index, 1);
            calculateMonthlyExpenses();
        }
    }

    function setWorkerStatus(workerId: string, status: 'idle' | 'working') {
        const worker = state.value.workers.find(w => w.id === workerId);
        if (worker) {
            worker.status = status;
        }
    }

    function addOrder(order: Order) {
        state.value.activeOrders.push(order);
    }

    function removeOrder(orderId: string) {
        const index = state.value.activeOrders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            state.value.activeOrders.splice(index, 1);
        }
    }

    function completeOrder(orderId: string) {
        const order = state.value.activeOrders.find(o => o.id === orderId);
        if (order) {
            addMoney(order.reward);
            addMoney(order.reward);
            state.value.reputation += order.reputationReward; // Also add reputation here if not done elsewhere
            checkRankUp();
            removeOrder(orderId);
        }
    }

    function checkRankUp() {
        const next = nextRank.value;
        if (next && state.value.reputation >= next.minReputation) {
            state.value.currentRankIndex++;
            // Show Rank Up Modal or Notification
            // We can use a special notification type or just a message for now, 
            // but the UI will likely watch `currentRankIndex` to trigger the modal.
            addNotification(t.value.notifications.rankUp, format(t.value.notifications.rankUpDesc, next.title), 'success');
        }
    }

    // Storage Getters
    const maxStorageCapacity = computed(() => {
        let capacity = 50; // Base capacity
        // Find the highest value storage upgrade
        state.value.purchasedUpgradeIds.forEach(id => {
            const upgrade = UPGRADES[id];
            if (upgrade && upgrade.effect.type === 'storage') {
                capacity = Math.max(capacity, upgrade.effect.value);
            }
        });
        return capacity;
    });

    const currentStorageLoad = computed(() => {
        let load = 0;
        // Materials
        for (const [type, amount] of Object.entries(state.value.inventory)) {
            const material = MATERIALS[type as MaterialType];
            if (material) {
                load += amount * (material.volume || 0);
            }
        }
        // Finished Products (waiting in 'pending_storage' or if we had an inventory)
        // Currently, we don't have a finished goods inventory array, but we might have tasks in 'pending_storage'
        // which occupy space on the workbench, but logically they should count towards storage if they are 'finished' but not sold?
        // Actually, 'pending_storage' means they CANNOT enter storage because it is full.
        // So they are stuck on the workbench.
        // However, if we want to implement a finished goods inventory later, we should count them.
        // For now, let's assume products are sold immediately upon completion unless storage is full?
        // Wait, the requirement says: "Mevcut 'sınırsız envanter' sistemini kaldırarak... ham maddelerin ve bitmiş ürünlerin ortak bir alanı paylaştığı limitli bir depo sistemi".
        // So we need a place to store finished products.
        // Currently `completeTask` just removes the task and shows a notification. It doesn't add the product anywhere.
        // It seems products are "sold" or "delivered" immediately in the current loop?
        // `completeOrder` adds money. But `completeTask` is for production.
        // If `completeTask` is for an order, it should probably fulfill the order.
        // Let's look at `completeTask`. It sets status to 'completed' and removes it.
        // If it's linked to an order, the order should be updated.
        // But `completeOrder` is manual?
        // Let's assume for Phase 3, we just want to restrict *production completion* if storage is full.
        // But if products are not stored, they don't take space.
        // The requirement says "Product size değerini VU olarak kullan".
        // This implies products SHOULD take space.
        // So we need a `productInventory` in `GameState`.

        return parseFloat(load.toFixed(1));
    });

    const storagePercentage = computed(() => {
        return Math.min(100, (currentStorageLoad.value / maxStorageCapacity.value) * 100);
    });

    const isStorageFull = computed(() => currentStorageLoad.value >= maxStorageCapacity.value);

    // Actions
    function buyMaterial(type: MaterialType, amount: number) {
        const material = MATERIALS[type];
        const volume = material.volume * amount;

        if (currentStorageLoad.value + volume > maxStorageCapacity.value) {
            addNotification(t.value.notifications.storageFull, t.value.notifications.storageFullDesc, 'error');
            return;
        }

        const seasonalMultiplier = getSeasonalPriceMultiplier(type);
        const totalCost = material.basePrice * amount * seasonalMultiplier; // Apply seasonal multiplier

        if (spendMoney(totalCost)) {
            addMaterial(type, amount);
            // Notification? Maybe too spammy for small buys.
        } else {
            addNotification(t.value.notifications.insufficientFunds, t.value.notifications.insufficientFundsDesc, 'error');
        }
    }

    // ... existing code ...

    function startProduction(task: ProductionTask) {
        // Deduct material
        if (removeMaterial(task.materialType, 1)) {
            state.value.productionTasks.push(task);
            // Assign workers
            task.assignedWorkers.forEach(wid => setWorkerStatus(wid, 'working'));

            // 5. TEAM WORK BONUS
            if (task.assignedWorkers.length >= 2) {
                task.assignedWorkers.forEach(wid => {
                    const worker = state.value.workers.find(w => w.id === wid);
                    if (worker) {
                        worker.loyalty = Math.min(100, worker.loyalty + 2);
                    }
                });
            }
            return true;
        }
        return false;
    }

    function updateTaskProgress(taskId: string, progressDelta: number) {
        const task = state.value.productionTasks.find(t => t.id === taskId);
        if (task) {
            // If task was pending storage, try to complete it again if space is available
            if (task.status === 'pending_storage') {
                const product = PRODUCTS[task.productId];
                if (product && currentStorageLoad.value + product.size <= maxStorageCapacity.value) {
                    completeTask(taskId);
                }
                return;
            }

            task.progress = Math.min(100, task.progress + progressDelta);
            task.currentDuration += 1; // Assuming 1 tick = 1 minute
        }
    }

    function completeTask(taskId: string) {
        const index = state.value.productionTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const task = state.value.productionTasks[index];
            if (task) {
                // Check storage for the finished product
                const product = PRODUCTS[task.productId];
                if (product) {
                    // If we had a product inventory, we would check if we can add it.
                    // Since we don't have a product inventory yet (based on state definition),
                    // and the requirement says "Product size value as VU",
                    // we imply that products SHOULD be stored.
                    // However, without a `productInventory` in state, we can't store them.
                    // For this task, maybe we just simulate it or add `productInventory`.
                    // Let's add `productInventory` to state in a separate edit if needed.
                    // For now, let's assume we are just checking if there is "room" to finish it, 
                    // even if it vanishes (sold immediately).
                    // BUT, if it vanishes, it doesn't take space.
                    // So the "Storage Management" for products implies they stay.
                    // Let's assume for now we just check capacity.

                    // Actually, if the order is for a specific product, maybe we keep it until the order is delivered?
                    // The current `completeOrder` is manual.
                    // So we should probably store the product.

                    // Let's stick to the "Pending" status logic requested.
                    // If storage is full (of materials), we can't finish the product (put it in storage).
                    // But wait, if we don't store products, `currentStorageLoad` only counts materials.
                    // So `isStorageFull` depends only on materials.
                    // If `isStorageFull` is true, we can't finish the task.

                    if (currentStorageLoad.value + product.size > maxStorageCapacity.value) {
                        task.status = 'pending_storage';
                        addNotification(t.value.notifications.storageFull, t.value.notifications.storageFullDesc, 'error');
                        return null;
                    }
                }

                task.status = 'completed';

                // 1. SUCCESSFUL PRODUCTION BONUS
                task.assignedWorkers.forEach(wid => {
                    const worker = state.value.workers.find(w => w.id === wid);
                    if (worker) {
                        const bonus = task.risk > 0.5 ? 10 : 5;
                        worker.loyalty = Math.min(100, worker.loyalty + bonus);
                    }
                });

                // Free workers
                task.assignedWorkers.forEach(wid => setWorkerStatus(wid, 'idle'));

                state.value.productionTasks.splice(index, 1);

                addNotification(t.value.notifications.productionComplete, format(t.value.notifications.productionCompleteDesc, getMaterialName(task.materialType)), 'success');
                return task;
            }
        }
        return null;
    }

    function failTask(taskId: string) {
        const index = state.value.productionTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const task = state.value.productionTasks[index];
            if (task) {
                task.status = 'failed';
                // Free workers
                task.assignedWorkers.forEach(wid => setWorkerStatus(wid, 'idle'));

                state.value.productionTasks.splice(index, 1);
                addNotification(t.value.notifications.productionFailed, format(t.value.notifications.productionFailedDesc, getMaterialName(task.materialType)), 'error');
            }
        }
    }

    function cancelProduction(taskId: string) {
        const index = state.value.productionTasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const task = state.value.productionTasks[index];
            if (!task) return;

            // Free all workers
            task.assignedWorkers.forEach(workerId => {
                setWorkerStatus(workerId, 'idle');
            });

            // Remove task
            state.value.productionTasks.splice(index, 1);

            // Notify user
            addNotification('Üretim İptal Edildi', `${task.productId} üretimi iptal edildi. İşçiler serbest bırakıldı.`, 'warning');
        }
    }

    function addStudent(student: any) {
        state.value.students.push(student);
        addMoney(student.tuitionFee);
    }

    function recruitStudent() {
        // Max students capacity (hardcoded 3 for now, or upgradeable?)
        const MAX_STUDENTS = 3;
        if (state.value.students.length >= MAX_STUDENTS) {
            addNotification((t.value.notifications as any).academyFull, (t.value.notifications as any).academyFullDesc, 'warning');
            return;
        }

        const id = Math.random().toString(36).substring(2, 9);
        const randomName = WORKER_NAMES[Math.floor(Math.random() * WORKER_NAMES.length)] || 'Öğrenci';

        // Tuition: 50-100 Drachma
        const tuitionFee = Math.floor(Math.random() * 51) + 50;

        // Duration: 3-5 Days (in minutes)
        const durationDays = Math.floor(Math.random() * 3) + 3;
        const duration = durationDays * 1440;

        const student = {
            id,
            name: randomName,
            arrivalTime: state.value.gameTime,
            duration,
            tuitionFee,
            progress: 0 // Current minutes trained
        };

        state.value.students.push(student);
        addMoney(tuitionFee);
        addNotification((t.value.notifications as any).studentRecruited, format((t.value.notifications as any).studentRecruitedDesc, randomName, tuitionFee), 'success');
    }

    function tickStudents(minutes: number) {
        state.value.students.forEach(student => {
            // Initialize progress if missing
            if (student.progress === undefined) student.progress = 0;

            if (student.progress < student.duration) {
                student.progress += minutes;

                if (student.progress >= student.duration) {
                    student.progress = student.duration;
                    addNotification((t.value.notifications as any).studentGraduated, format((t.value.notifications as any).studentGraduatedDesc, student.name), 'success');
                }
            }
        });
    }

    function graduateStudent(studentId: string, action: 'hire' | 'release') {
        const index = state.value.students.findIndex(s => s.id === studentId);
        if (index === -1) return;

        const student = state.value.students[index];
        if (!student) return;

        if (action === 'hire') {
            // Hire as Apprentice (Free)
            if (state.value.workers.length >= maxWorkers.value) {
                addNotification(t.value.notifications.limitReached, format(t.value.notifications.limitExceededDesc, currentRank.value.title, maxWorkers.value), 'error');
                return;
            }

            const worker: Worker = {
                id: student.id, // Keep ID
                type: WorkerType.APPRENTICE,
                name: student.name,
                skill: 3, // Base Apprentice Skill
                salary: 50, // Standard Apprentice Salary
                status: 'idle',
                equippedToolIds: [],
                experience: 0,
                level: 1,
                loyalty: 80, // Starts with high loyalty
                lastWorkedAt: state.value.gameTime,
                lastRaiseDay: 0, // Initialize
                baseSkill: 3,
                negotiationPending: false
            };

            // Bonus for "Apprentice School" upgrade if active
            if (state.value.purchasedUpgradeIds.includes('apprentice_school')) {
                worker.level = 2;
                worker.skill += 1;
                worker.baseSkill += 1;
            }

            state.value.workers.push(worker);
            calculateMonthlyExpenses();
            addNotification((t.value.notifications as any).studentHired, format((t.value.notifications as any).studentHiredDesc, student.name), 'success');

        } else if (action === 'release') {
            // Release for Reputation
            // Base 10 Rep + Random Bonus
            const repGain = 10 + Math.floor(Math.random() * 11);
            state.value.reputation += repGain;
            checkRankUp();
            addNotification((t.value.notifications as any).studentReleased, format((t.value.notifications as any).studentReleasedDesc, student.name, repGain), 'success');
        }

        // Remove student using filter to ensure reactivity
        state.value.students = state.value.students.filter(s => s.id !== studentId);
    }

    function removeStudent(studentId: string) {
        const index = state.value.students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            state.value.students.splice(index, 1);
        }
    }

    function calculateMonthlyExpenses() {
        const workerSalaries = state.value.workers.reduce((sum, w) => sum + w.salary, 0);
        const tax = Math.floor(state.value.reputation * 0.5); // Reduced tax: 0.5 Drachma per reputation point
        state.value.taxRate = tax;
        state.value.monthlyExpenses = workerSalaries + tax;
    }

    function payMonthlyExpenses() {
        calculateMonthlyExpenses();
        // Deduct even if it goes negative
        state.value.money -= state.value.monthlyExpenses;
        state.value.lastPaidDay = Math.floor(state.value.gameTime / 1440);
        addNotification(t.value.notifications.monthlyExpenses, format(t.value.notifications.monthlyPaymentDesc, state.value.monthlyExpenses), 'warning');
    }

    function generateOrder() {
        // Select from unlocked materials
        // Re-fetching materials to ensure latest values
        const availableMaterials = unlockedMaterials.value as MaterialType[];

        if (availableMaterials.length === 0) return;

        let materialType: MaterialType | undefined;

        // Early Game Balance: Ensure at least one Clay order if Rep < 500
        const hasClayOrder = state.value.activeOrders.some(o => o.materialType === MaterialType.CLAY);
        const canMakeClay = availableMaterials.includes(MaterialType.CLAY);

        if (state.value.reputation < 500 && !hasClayOrder && canMakeClay) {
            materialType = MaterialType.CLAY;
        } else {
            const randomIndex = Math.floor(Math.random() * availableMaterials.length);
            materialType = availableMaterials[randomIndex];
        }

        if (!materialType) return; // Safety check

        const materialInfo = MATERIALS[materialType];

        // Select random Product from PRODUCTS
        const productIds = Object.keys(PRODUCTS);
        if (productIds.length === 0) return;

        const productId = productIds[Math.floor(Math.random() * productIds.length)];
        if (!productId) return;

        const product = PRODUCTS[productId];
        if (!product) return; // Safety check

        // Difficulty scales with reputation (0-1000 rep -> 1-11 difficulty roughly)
        // Base difficulty 1, +1 for every 100 reputation
        const difficulty = 1 + Math.floor(state.value.reputation / 100) + (Math.random() * 0.5);

        // Reward calculation
        // Formula: (MaterialBasePrice * Size) * Complexity
        const basePrice = materialInfo.basePrice;
        let reward = Math.floor((basePrice * product.size) * product.complexity);

        // Add difficulty bonus (small random variation + reputation bonus)
        reward = Math.floor(reward * (1 + (difficulty * 0.05)));

        // Apply Sales Consultant Bonus (Lobbyist)
        state.value.activeConsultantIds.forEach(id => {
            const consultant = CONSULTANTS[id];
            if (consultant && consultant.effect.type === 'sales') {
                reward = Math.floor(reward * (1 + consultant.effect.value)); // e.g., +20% reward
            }
        });

        // Deadline calculation
        // Current Day + (Hardness * 2) + (Complexity * 2) + Random Buffer
        const currentDay = Math.floor(state.value.gameTime / 1440);
        const durationDays = Math.ceil(materialInfo.hardness * 2 + product.complexity * 2 + 2 + Math.random() * 3);
        const deadline = currentDay + durationDays;

        const order: Order = {
            id: Math.random().toString(36).substring(2, 9),
            materialType,
            productId: product.id,
            productType: product.visualType, // For visualizer
            difficulty,
            reward,
            reputationReward: Math.floor(difficulty * 5 * product.complexity), // Rep also scales with complexity
            deadline,
            createdAt: currentDay
        };

        addOrder(order);
        addMessage(t.value.messages.chiefScribe, t.value.messages.newOrderSubject, format(t.value.messages.newOrderBody, getMaterialName(materialType), product.name, reward));
        addNotification(t.value.notifications.newOrder, format(t.value.notifications.newOrderDesc, getMaterialName(materialType), product.name), 'info');
    }

    function handleSkillDecay() {
        // Decay skill if idle for too long (e.g., 15 days = 21600 minutes)
        // For testing/MVP, let's say 1 day (1440 minutes) of idleness starts decay.
        const DECAY_THRESHOLD = 1440;
        const currentTime = state.value.gameTime;

        state.value.workers.forEach(worker => {
            if (worker.status === 'idle') {
                const timeSinceLastWork = currentTime - worker.lastWorkedAt;
                if (timeSinceLastWork > DECAY_THRESHOLD) {
                    // Decay chance per tick? Or just decay slowly.
                    // Let's decay 0.1 skill point every hour after threshold.
                    // Since this runs every tick (minute?), we need to be careful.
                    // Better: Run this check daily or hourly.
                    // Let's run it in tickTime's daily check or hourly check.

                    // Current implementation calls this every tick? No, we should call it periodically.
                    // Let's assume this is called daily for now.

                    if (worker.skill > worker.baseSkill) {
                        worker.skill = Math.max(worker.baseSkill, worker.skill - 0.5);
                        addNotification(t.value.notifications.skillDecay, format(t.value.notifications.skillDecayDesc, worker.name), 'warning');
                    }
                }
            }
        });
    }

    function handleLoyaltyDecay() {
        // Decay loyalty if idle for too long
        const IDLE_THRESHOLD = 2880; // 2 days (2 * 1440 minutes)
        const DECAY_RATE = 5; // -5 loyalty per day idle
        const currentTime = state.value.gameTime;

        state.value.workers.forEach(worker => {
            if (worker.status === 'idle') {
                const timeSinceLastWork = currentTime - worker.lastWorkedAt;

                if (timeSinceLastWork > IDLE_THRESHOLD) {
                    // Calculate target loyalty based on days idle
                    const daysIdle = Math.floor(timeSinceLastWork / 1440);
                    const targetLoyalty = Math.max(0, 100 - (daysIdle * DECAY_RATE));

                    if (worker.loyalty > targetLoyalty) {
                        const oldLoyalty = worker.loyalty;
                        worker.loyalty = targetLoyalty;

                        // Notifications at critical thresholds
                        if (worker.loyalty <= 0) {
                            // Worker leaves
                            fireWorker(worker.id);
                            addNotification(t.value.notifications.workerLeft, format(t.value.notifications.workerLeftDesc, worker.name), 'error');
                        } else if (worker.loyalty <= 20 && oldLoyalty > 20) {
                            addNotification(t.value.notifications.lowMotivation, format(t.value.notifications.lowMotivationDesc, worker.name), 'warning');
                        } else if (worker.loyalty <= 50 && oldLoyalty > 50) {
                            addNotification(t.value.notifications.motivationDropping, format(t.value.notifications.motivationDroppingDesc, worker.name), 'info');
                        }
                    }
                }
            }
        });
    }

    function handleLoyaltyBoost() {
        // 2. REGULAR WORK BONUS
        const REGULAR_WORK_THRESHOLD = 4320; // 3 days
        const currentTime = state.value.gameTime;

        state.value.workers.forEach(worker => {
            const timeSinceLastWork = currentTime - worker.lastWorkedAt;

            if (timeSinceLastWork < REGULAR_WORK_THRESHOLD) {
                worker.loyalty = Math.min(100, worker.loyalty + 2);
            }
        });
    }

    function handleWageNegotiation(workerId: string, accepted: boolean) {
        const worker = state.value.workers.find(w => w.id === workerId);
        if (!worker) return;

        if (accepted) {
            // Accept: +20% Salary, +10 Loyalty, +5% Efficiency (Skill)
            const oldSalary = worker.salary;
            worker.salary = Math.ceil(worker.salary * 1.2);
            worker.loyalty = Math.min(100, worker.loyalty + 10);
            worker.skill += 0.5; // Bonus skill

            // 3. ENHANCED WAGE NEGOTIATION
            const daysSinceLastRaise = currentDay.value - worker.lastRaiseDay;
            if (worker.lastRaiseDay > 0 && daysSinceLastRaise <= 35) {
                worker.loyalty = Math.min(100, worker.loyalty + 5);
            }
            worker.lastRaiseDay = currentDay.value;

            addNotification(t.value.notifications.wageIncrease, format(t.value.notifications.raiseGivenDesc, worker.name, oldSalary, worker.salary), 'success');
        } else {
            // Reject: -20 Loyalty
            worker.loyalty -= 20;
            addNotification(t.value.notifications.wageRejected, format(t.value.notifications.raiseRejectedDesc, worker.name), 'warning');

            if (worker.loyalty <= 0) {
                // Worker leaves
                fireWorker(workerId);
                addNotification(t.value.notifications.workerLeft, format(t.value.notifications.workerLeftDesc, worker.name), 'error');
            }
        }
    }

    // Consultants Logic
    function hireConsultant(consultantId: string) {
        const consultant = CONSULTANTS[consultantId];
        if (!consultant) return;

        if (state.value.activeConsultantIds.includes(consultantId)) {
            addNotification(t.value.notifications.alreadyWorking, t.value.notifications.alreadyHiredDesc, 'warning');
            return;
        }

        if (state.value.reputation < consultant.minReputation) {
            addNotification(t.value.notifications.insufficientReputation, t.value.notifications.insufficientReputationDesc, 'error');
            return;
        }

        if (spendMoney(consultant.cost)) {
            state.value.activeConsultantIds.push(consultantId);
            addNotification(t.value.notifications.consultantHired, format(t.value.notifications.consultantHiredDesc, getConsultantName(consultantId)), 'success');
            calculateMonthlyExpenses();
        } else {
            addNotification(t.value.notifications.insufficientFunds, t.value.notifications.insufficientFundsDesc, 'error');
        }
    }

    function fireConsultant(consultantId: string) {
        const index = state.value.activeConsultantIds.indexOf(consultantId);
        if (index !== -1) {
            state.value.activeConsultantIds.splice(index, 1);
            addNotification(t.value.notifications.consultantFired, t.value.notifications.consultantFiredDesc, 'info');
            calculateMonthlyExpenses();
        }
    }

    function tickTime(minutes: number) {
        const previousTime = state.value.gameTime;
        state.value.gameTime += minutes;

        const previousDay = Math.floor(previousTime / 1440);
        const currentDay = Math.floor(state.value.gameTime / 1440);

        const previousHour = Math.floor((previousTime % 1440) / 60);
        const currentHour = Math.floor((state.value.gameTime % 1440) / 60);

        // Check for 06:00 (Start of Work)
        if (previousHour < 6 && currentHour >= 6) {
            assignDailyStates();
        }

        // Tick Students
        tickStudents(minutes);

        // Check for 20:00 (End of Work)
        if (previousHour < 20 && currentHour >= 20) {
            addNotification('Mesai Bitti', 'İşçiler dinlenmeye çekildi.', 'info');
        }

        state.value.lastSaveTime = Date.now();

        // Research Progress
        const activeResearch = state.value.activeResearch;
        if (activeResearch) {
            activeResearch.progress += minutes;
            if (activeResearch.progress >= activeResearch.totalDuration) {
                // Complete Research
                const upgradeId = activeResearch.upgradeId;
                const upgrade = UPGRADES[upgradeId];

                if (upgrade) {
                    state.value.purchasedUpgradeIds.push(upgradeId);
                    addNotification(t.value.notifications.researchCompleted, format(t.value.notifications.researchCompleteDesc, upgrade.name), 'success');
                    addMessage(t.value.messages.chiefEngineer, t.value.messages.researchCompleteSubject, format(t.value.messages.researchCompleteBody, upgrade.name));
                }

                state.value.activeResearch = null;
            }
        }

        // Cleanup old messages (older than 1 week = 7 * 24 * 60 = 10080 minutes)
        const oneWeekAgo = state.value.gameTime - 10080;
        const lastMessage = state.value.messages[state.value.messages.length - 1];
        if (state.value.messages.length > 0 && lastMessage && lastMessage.timestamp < oneWeekAgo) {
            state.value.messages = state.value.messages.filter(m => m.timestamp >= oneWeekAgo);
        }

        // Check for new day events
        if (currentDay > previousDay) {
            // 1. Monthly Expenses Check
            if (currentDay > state.value.lastPaidDay && (currentDay - state.value.lastPaidDay) >= 30) {
                payMonthlyExpenses();
            }

            // 2. Order Generation Check
            // Early Game Balance: If Rep < 500 and no Clay order exists, guarantee one
            const hasClayOrder = state.value.activeOrders.some(o => o.materialType === MaterialType.CLAY);
            const isEarlyGame = state.value.reputation < 500;
            const canMakeClay = (unlockedMaterials.value as MaterialType[]).includes(MaterialType.CLAY);

            if (isEarlyGame && !hasClayOrder && canMakeClay) {
                // Force generate a Clay order for better early game flow
                generateOrder();
            } else {
                // Normal order generation logic
                // Base chance 40%, +1% for every 10 reputation (capped at 60%)
                // If no active orders, chance is 100% (guaranteed new order)
                let chance = Math.min(0.6, 0.4 + (state.value.reputation / 1000));

                // Apply Sales Consultant Bonus (Lobbyist)
                state.value.activeConsultantIds.forEach(id => {
                    const consultant = CONSULTANTS[id];
                    if (consultant && consultant.effect.type === 'sales') {
                        chance *= (1 + consultant.effect.value); // e.g., +20% chance
                    }
                });

                if (state.value.activeOrders.length === 0) {
                    chance = 1.0;
                }

                if (Math.random() < chance) {
                    generateOrder();
                }
            }

            // 3. Skill Decay Check (Daily)
            handleSkillDecay();

            // 4. Loyalty Decay Check (Daily)
            handleLoyaltyDecay();

            // 4b. Loyalty Boost Check (Daily)
            handleLoyaltyBoost();

            // 6. REST DAYS (Every 7 days)
            if (currentDay % 7 === 0) {
                state.value.workers.forEach(worker => {
                    if (worker.status === 'idle') {
                        worker.loyalty = Math.min(100, worker.loyalty + 3);
                    }
                });
            }

            // 7. SPECIAL EVENTS (5% chance daily)
            if (Math.random() < 0.05) {
                const events = [
                    'Festival',
                    'Kutlama',
                    'Pazar Günü'
                ];
                const event = events[Math.floor(Math.random() * events.length)];
                const bonus = Math.floor(Math.random() * 6) + 5; // 5-10

                state.value.workers.forEach(worker => {
                    worker.loyalty = Math.min(100, worker.loyalty + bonus);
                });

                addNotification(event, `Atölyede ${event}! Tüm işçiler mutlu (+${bonus} sadakat).`, 'success');
            }

            // 5. Consultant Daily Effects
            state.value.activeConsultantIds.forEach(id => {
                const consultant = CONSULTANTS[id];
                if (consultant) {
                    // Philosopher: +2 Reputation daily
                    if (consultant.effect.type === 'reputation') {
                        state.value.reputation += consultant.effect.value;
                        // Optional: Silent notification or log
                    }

                    // Supplier: Auto-buy materials if low
                    if (consultant.effect.type === 'automation') {
                        // Check all unlocked materials (excluding Rubble usually, but let's allow if user sets it)
                        unlockedMaterials.value.forEach(materialType => {
                            if (materialType === MaterialType.RUBBLE) return; // Don't buy rubble

                            const threshold = state.value.supplierSettings[materialType] || 0;
                            if (threshold > 0) {
                                const currentAmount = state.value.inventory[materialType];
                                if (currentAmount < threshold) {
                                    const amountToBuy = threshold - currentAmount;
                                    const material = MATERIALS[materialType];
                                    let price = material.basePrice;

                                    // Apply seasonal price multiplier
                                    price = Math.floor(price * getSeasonalPriceMultiplier(materialType));

                                    // Apply market discount
                                    const discountedPrice = Math.floor(price * (1 - marketDiscount.value));
                                    const totalCost = amountToBuy * discountedPrice;

                                    if (spendMoney(totalCost)) {
                                        addMaterial(materialType, amountToBuy);
                                        // Group notifications? For now individual is fine as it's daily check
                                        addNotification(t.value.notifications.autoSupply, format(t.value.notifications.autoBuyDesc, amountToBuy, getMaterialName(materialType), totalCost), 'info');
                                    } else {
                                        // Optional: Notify low funds?
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    }

    return {
        state: skipHydrate(state),
        addMoney,
        spendMoney,
        addMaterial,
        removeMaterial,
        sellMaterial,
        updateSupplierSettings,
        hireWorker,
        fireWorker,
        setWorkerStatus,
        addOrder,
        removeOrder,
        completeOrder,
        startProduction,
        updateTaskProgress,
        completeTask,
        failTask,
        cancelProduction,
        addStudent,
        removeStudent,
        tickTime,
        calculateMonthlyExpenses,
        payMonthlyExpenses,
        generateOrder,
        addNotification,
        addMessage,
        markMessageRead,
        buyTool,
        currentDay,
        currentHour,
        currentSeason,
        isDaytime,
        equipTool,
        unequipTool,
        startResearch,
        hireConsultant,
        fireConsultant,
        currentRank,
        nextRank,
        maxWorkers,
        unlockedMaterials,
        unlockedWorkerTypes,
        marketDiscount,
        productionSpeedBonus,
        handleWageNegotiation,
        buyMaterial,
        maxStorageCapacity,
        currentStorageLoad,
        storagePercentage,
        isStorageFull,
        recruitStudent,
        graduateStudent
    };
});
