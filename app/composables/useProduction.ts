import { useGameStore } from '~/stores/game';
import { MATERIALS } from '~/constants/materials';
import { TOOLS } from '~/constants/tools';
import { type Worker, WorkerType, type ProductionTask, MaterialType } from '~/types';

export const useProduction = () => {
    const gameStore = useGameStore();

    function calculateDuration(materialType: MaterialType, assignedWorkers: Worker[]) {
        const material = MATERIALS[materialType];
        if (!material || assignedWorkers.length === 0) return 0;

        const gameStore = useGameStore();

        // Calculate total production power
        let totalPower = 0;

        assignedWorkers.forEach(worker => {
            let workerPower = 1; // Base power

            // Add skill bonus (simple implementation: each skill point adds 10% speed)
            workerPower += (worker.skill * 0.1);

            // Add tool bonuses
            if (worker.equippedToolIds) {
                worker.equippedToolIds.forEach(toolId => {
                    const tool = TOOLS[toolId];
                    if (tool && tool.effect.type === 'speed') {
                        workerPower += tool.effect.value;
                    }
                });
            }

            // Add Rank Bonus (Global)
            workerPower += gameStore.productionSpeedBonus;

            // Apply Daily State Effects
            if (worker.dailyState?.effect.speed) {
                workerPower *= (1 + worker.dailyState.effect.speed);
            }

            // Apply Winter Speed Penalty (-10%)
            if (gameStore.currentSeason === 'winter') {
                workerPower *= 0.90;
            }

            totalPower += workerPower;
        });

        // Base duration in minutes (Hardness * 60)
        const baseDuration = material.hardness * 60;

        // Duration = Base / Total Power
        return Math.ceil(baseDuration / totalPower);
    }

    function calculateRisk(materialType: MaterialType, assignedWorkers: Worker[]) {
        const material = MATERIALS[materialType];
        if (!material) return 0;

        let risk = material.brittleness;

        // Reduce risk based on worker skill and tools
        let totalRiskReduction = 0;

        assignedWorkers.forEach(worker => {
            // Skill reduction (each skill point reduces risk by 1%)
            totalRiskReduction += (worker.skill * 0.01);

            // Tool reduction
            if (worker.equippedToolIds) {
                worker.equippedToolIds.forEach(toolId => {
                    const tool = TOOLS[toolId];
                    if (tool && tool.effect.type === 'risk') {
                        totalRiskReduction += tool.effect.value;
                    }
                });
            }
        });

        // Average risk reduction across workers? Or sum?
        // Let's say risk is reduced by the average capability of the team.
        const averageReduction = assignedWorkers.length > 0 ? totalRiskReduction / assignedWorkers.length : 0;

        return Math.max(0.05, risk - averageReduction); // Minimum 5% risk always remains
    }

    function processProductionTick(task: ProductionTask) {
        // Check if it's daytime (06:00 - 20:00)
        if (!gameStore.isDaytime) {
            return; // Production stops at night
        }

        // Calculate effective speed based on workers
        // We can recalculate or store it. Recalculating is safer if workers change (though they shouldn't while working)

        // Simple progress: 1 tick = 1 minute.
        // We need to know the total duration to calculate percentage increase.
        // task.totalDuration is in minutes.

        if (task.status !== 'active' && task.status !== 'pending') return;
        if (task.status === 'pending') task.status = 'active';

        // Increment duration
        // task.currentDuration += 1; // This is done in store.updateTaskProgress

        // Calculate percentage delta
        // 1 minute / totalDuration * 100
        const progressDelta = (1 / task.totalDuration) * 100;

        gameStore.updateTaskProgress(task.id, progressDelta);

        // Award XP to workers (Organic Progression)
        task.assignedWorkers.forEach(workerId => {
            const worker = gameStore.state.workers.find(w => w.id === workerId);
            if (worker) {
                // Base XP + Random Variance
                let xpGain = 0.1 + (Math.random() * 0.05);

                // Tool Multiplier
                if (worker.equippedToolIds && worker.equippedToolIds.length > 0) {
                    // Simple bonus: 10% more XP per tool
                    xpGain *= (1 + (worker.equippedToolIds.length * 0.1));
                }

                // Apply XP
                worker.experience += xpGain;
                worker.lastWorkedAt = gameStore.state.gameTime;

                // Check Level Up
                // Formula: Level * 100 XP required for next level
                const xpRequired = worker.level * 100;
                if (worker.experience >= xpRequired) {
                    worker.level++;
                    worker.experience -= xpRequired; // Carry over excess XP? Or reset? Let's carry over.
                    // Actually, standard RPG is cumulative or reset. Let's do reset for simple "level * 100" formula.
                    // Wait, if I subtract, then level 2 needs 200 XP.

                    // Efficiency Boost
                    worker.skill += 1; // Permanent skill increase
                    worker.baseSkill += 1; // Update base skill too

                    gameStore.addNotification('Seviye Atladı!', `${worker.name} ${worker.level}. seviyeye ulaştı! Verimliliği arttı.`, 'success');

                    // Wage Negotiation Trigger for Masters (Level 5+)
                    if (worker.type === 'master' && worker.level >= 5) {
                        worker.negotiationPending = true;
                        gameStore.addNotification('Zam Talebi', `${worker.name} maaş zammı görüşmek istiyor.`, 'warning');
                    }
                }
            }
        });

        // Check for completion
        if (task.progress >= 100) {
            const completedTask = gameStore.completeTask(task.id);
            if (completedTask) {
                // Handle Rewards
                if (completedTask.orderId) {
                    // Find the order to get reward details? 
                    // Actually order might be gone if we didn't link it properly or if we just stored orderId.
                    // But we have activeOrders in store.
                    // Wait, if we are fulfilling an order, we should find it in activeOrders.

                    const order = gameStore.state.activeOrders.find(o => o.id === completedTask.orderId);
                    if (order) {
                        gameStore.addMoney(order.reward);
                        gameStore.state.reputation += order.reputationReward;
                        gameStore.completeOrder(order.id);
                        // Notify user? (Toast or log)
                        console.log(`Order completed! Earned ${order.reward} money.`);
                    }
                } else {
                    // Stock production
                    // Add finished good to inventory? 
                    // For now, just sell it immediately or add to a "Finished Goods" inventory.
                    // MVP: Sell immediately for base price.
                    const material = MATERIALS[completedTask.materialType];
                    const sellPrice = Math.floor(material.basePrice * 1.5); // Value added
                    gameStore.addMoney(sellPrice);
                    console.log(`Stock item sold for ${sellPrice}.`);
                }
            }
        }
    }

    return {
        calculateDuration,
        calculateRisk,
        processProductionTick
    };
};
