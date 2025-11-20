import { useGameStore } from '~/stores/game';
import { MATERIALS } from '~/constants/materials';
import { TOOLS } from '~/constants/tools';
import { type Worker, WorkerType, type ProductionTask, MaterialType } from '~/types';
import { formatNumber } from '~/utils/formatters';

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

        // Base duration in minutes (Hardness * 120)
        const baseDuration = material.hardness * 120;

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

        if (task.status !== 'active' && task.status !== 'pending') return;
        if (task.status === 'pending') task.status = 'active';

        // Multi-Stage Production Logic
        const workers = gameStore.state.workers.filter(w => task.assignedWorkers.includes(w.id));

        // Determine which workers can contribute to current stage
        let activeWorkers: Worker[] = [];

        if (task.currentStage === 'roughing') {
            // Roughing: Slaves and Apprentices (strength-based)
            activeWorkers = workers.filter(w => w.type === 'slave' || w.type === 'apprentice');
        } else if (task.currentStage === 'detailing') {
            // Detailing: Apprentices and Masters (skill-based)
            activeWorkers = workers.filter(w => w.type === 'apprentice' || w.type === 'master');
        } else if (task.currentStage === 'inspection') {
            // Inspection: Check if master is available
            const master = workers.find(w => w.type === 'master');

            // Get material info for difficulty adjustment
            const material = MATERIALS[task.materialType];
            const materialDifficulty = material.brittleness; // 0.1 (easy) to 0.5 (hard)

            // Use task's calculated risk (already considers material, workers, tools)
            const taskRisk = task.risk;

            // Reputation bonus: Higher reputation = better quality control
            // Every 100 reputation = +2% success chance
            const reputationBonus = Math.min(0.20, (gameStore.state.reputation / 100) * 0.02);

            // Team bonus: More workers + higher average skill = better quality
            const teamSize = workers.length;
            const averageSkill = workers.reduce((sum, w) => sum + w.skill, 0) / teamSize;
            const teamBonus = Math.min(0.10, (averageSkill * 0.01) + (teamSize * 0.02));
            if (master) {
                // Master available - perform quality control
                const skillBonus = master.skill * 0.05; // 5% per skill point

                // Base success rate depends on material difficulty
                // Easy materials (clay, rubble): 85% base
                // Hard materials (marble): 70% base
                let baseSuccess = 0.85 - (materialDifficulty * 0.30); // 0.85 for clay, 0.70 for marble

                let successChance = baseSuccess + skillBonus + reputationBonus + teamBonus;

                // Check for quality tools (polishing cloth, etc.)
                if (master.equippedToolIds) {
                    master.equippedToolIds.forEach(toolId => {
                        const tool = TOOLS[toolId];
                        if (tool && tool.effect.type === 'quality') {
                            successChance += tool.effect.value;
                        }
                    });
                }

                // Apply task risk as a penalty
                successChance = successChance * (1 - taskRisk * 0.5); // High risk reduces success

                const roll = Math.random();

                if (roll < successChance) {
                    // ✅ Success
                    const completedTask = gameStore.completeTask(task.id);
                    if (completedTask && completedTask.orderId) {
                        const order = gameStore.state.activeOrders.find(o => o.id === completedTask.orderId);
                        if (order) {
                            // Tip System
                            // Base chance 10% + (Reputation / 1000)%
                            const tipChance = 0.10 + (gameStore.state.reputation / 100000);
                            let tipAmount = 0;

                            if (Math.random() < tipChance) {
                                // Tip is 10-30% of order value
                                tipAmount = Math.floor(order.reward * (0.1 + Math.random() * 0.2));
                            }

                            gameStore.addMoney(order.reward + tipAmount);
                            gameStore.state.reputation += order.reputationReward;
                            gameStore.completeOrder(order.id);

                            if (tipAmount > 0) {
                                gameStore.addNotification('Sipariş Tamamlandı!', `+${formatNumber(order.reward)} D. (+${formatNumber(tipAmount)} D. Bahşiş)`, 'success');
                            } else {
                                gameStore.addNotification('Sipariş Tamamlandı!', `+${formatNumber(order.reward)} D.`, 'success');
                            }
                        }
                    }
                    return;
                } else if (roll < successChance + 0.15) {
                    // ⚠️ Minor Flaw
                    task.currentStage = 'detailing';
                    task.progress = 53.33;
                    gameStore.addNotification('Kusurlu Ürün', 'Kalite kontrolden geçemedi. Düzeltme gerekiyor.', 'warning');
                    return;
                } else {
                    // ❌ Critical Failure
                    gameStore.failTask(task.id);
                    gameStore.addMaterial('rubble' as any, 1);
                    gameStore.addNotification('ÜRETİM HATASI!', 'Ürün kırıldı ve moloza dönüştü.', 'error');
                    return;
                }
            } else {
                // No master - auto-pass but with risk-based success
                const apprentice = workers.find(w => w.type === 'apprentice');

                if (apprentice) {
                    // Apprentice: Base success depends on material + reputation
                    let baseSuccess = 0.60 - (materialDifficulty * 0.40); // 60% for clay, 40% for marble
                    const skillBonus = apprentice.skill * 0.02;
                    let successChance = baseSuccess + skillBonus + reputationBonus + teamBonus;

                    // Apply task risk
                    successChance = successChance * (1 - taskRisk * 0.6);

                    const roll = Math.random();

                    if (roll < successChance) {
                        const completedTask = gameStore.completeTask(task.id);
                        if (completedTask && completedTask.orderId) {
                            const order = gameStore.state.activeOrders.find(o => o.id === completedTask.orderId);
                            if (order) {
                                // Tip System (Lower chance for apprentice)
                                const tipChance = 0.05 + (gameStore.state.reputation / 100000);
                                let tipAmount = 0;

                                if (Math.random() < tipChance) {
                                    tipAmount = Math.floor(order.reward * (0.05 + Math.random() * 0.1));
                                }

                                gameStore.addMoney(order.reward + tipAmount);
                                gameStore.state.reputation += order.reputationReward;
                                gameStore.completeOrder(order.id);

                                if (tipAmount > 0) {
                                    gameStore.addNotification('Sipariş Tamamlandı!', `+${formatNumber(order.reward)} D. (+${formatNumber(tipAmount)} D. Bahşiş)`, 'success');
                                } else {
                                    gameStore.addNotification('Sipariş Tamamlandı!', `+${formatNumber(order.reward)} D.`, 'success');
                                }
                            }
                        }
                        gameStore.addNotification('Şanslı Geçti!', 'Çırak kontrolünden geçti ama riskli bir üretimdi.', 'warning');
                        return;
                    } else {
                        gameStore.failTask(task.id);
                        gameStore.addMaterial('rubble' as any, 1);
                        gameStore.addNotification('ÜRETİM HATASI!', 'Çırak kontrolü yetersiz kaldı. Ürün kırıldı.', 'error');
                        return;
                    }
                } else {
                    // Only slaves - very material-dependent
                    let baseSuccess = 0.50 - (materialDifficulty * 0.60); // 50% for clay, 20% for marble
                    let successChance = baseSuccess + reputationBonus + teamBonus;

                    // Apply task risk heavily
                    successChance = successChance * (1 - taskRisk * 0.8);

                    const roll = Math.random();
                    if (roll < successChance) {
                        const completedTask = gameStore.completeTask(task.id);
                        if (completedTask && completedTask.orderId) {
                            const order = gameStore.state.activeOrders.find(o => o.id === completedTask.orderId);
                            if (order) {
                                gameStore.addMoney(order.reward);
                                gameStore.state.reputation += order.reputationReward;
                                gameStore.completeOrder(order.id);
                            }
                        }
                        gameStore.addNotification('Mucize!', 'Köleler şans eseri başardı!', 'success');
                        return;
                    } else {
                        gameStore.failTask(task.id);
                        gameStore.addMaterial('rubble' as any, 1);
                        gameStore.addNotification('ÜRETİM HATASI!', 'Kalite kontrol olmadan ürün başarısız oldu.', 'error');
                        return;
                    }
                }
            }
        }

        if (activeWorkers.length === 0) {
            // No workers for this stage
            if (task.currentStage === 'detailing') {
                // Skip detailing if no apprentices/masters - go straight to inspection
                // But this increases risk significantly!
                task.currentStage = 'inspection';
                task.progress = 66.66; // Jump to inspection stage
                gameStore.addNotification('Detaylandırma Atlandı!', 'Çırak/Usta olmadığı için detaylandırma atlandı. Risk arttı!', 'warning');
                return;
            }
            return; // No workers can contribute to this stage
        }

        // Calculate progress for current stage
        let totalPower = 0;
        activeWorkers.forEach(worker => {
            let workerPower = 1;
            workerPower += (worker.skill * 0.1);

            // Tool bonuses
            if (worker.equippedToolIds) {
                worker.equippedToolIds.forEach(toolId => {
                    const tool = TOOLS[toolId];
                    if (tool && tool.effect.type === 'speed') {
                        workerPower += tool.effect.value;
                    }
                });
            }

            // Rank bonus
            workerPower += gameStore.productionSpeedBonus;

            // Daily state effects
            if (worker.dailyState?.effect.speed) {
                workerPower *= (1 + worker.dailyState.effect.speed);
            }

            // Winter penalty
            if (gameStore.currentSeason === 'winter') {
                workerPower *= 0.90;
            }

            totalPower += workerPower;
        });

        // Calculate progress for current stage
        // Each stage occupies a specific range: 0-33%, 33-66%, 66-100%
        const stageRanges = {
            roughing: { min: 0, max: 33.33 },
            detailing: { min: 33.33, max: 66.66 },
            inspection: { min: 66.66, max: 100 }
        };

        const currentRange = stageRanges[task.currentStage];
        const progressDelta = (totalPower / task.totalDuration) * 100;

        // Add progress but cap at current stage max
        task.progress = Math.min(currentRange.max, task.progress + progressDelta);

        // Check stage transitions
        if (task.currentStage === 'roughing' && task.progress >= currentRange.max) {
            task.currentStage = 'detailing';
            gameStore.addNotification('Aşama Geçişi', 'Kaba inşaat tamamlandı. Detaylandırma başlıyor.', 'info');
        } else if (task.currentStage === 'detailing' && task.progress >= currentRange.max) {
            task.currentStage = 'inspection';
            gameStore.addNotification('Kalite Kontrol', 'Detaylandırma tamamlandı. Usta kontrolü bekleniyor.', 'info');
        }

        // Award XP to active workers
        activeWorkers.forEach(worker => {
            let xpGain = 0.1 + (Math.random() * 0.05);
            if (worker.equippedToolIds && worker.equippedToolIds.length > 0) {
                xpGain *= (1 + (worker.equippedToolIds.length * 0.1));
            }

            worker.experience += xpGain;
            worker.lastWorkedAt = gameStore.state.gameTime;

            const xpRequired = worker.level * 100;
            if (worker.experience >= xpRequired) {
                worker.level++;
                worker.experience -= xpRequired;
                worker.skill += 1;
                worker.baseSkill += 1;

                gameStore.addNotification('Seviye Atladı!', `${worker.name} ${worker.level}. seviyeye ulaştı!`, 'success');

                if (worker.type === 'master' && worker.level >= 5) {
                    worker.negotiationPending = true;
                    gameStore.addNotification('Zam Talebi', `${worker.name} maaş zammı görüşmek istiyor.`, 'warning');
                }
            }
        });
    }

    return {
        calculateDuration,
        calculateRisk,
        processProductionTick
    };
};
