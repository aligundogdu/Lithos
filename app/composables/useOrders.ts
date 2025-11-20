import { useGameStore } from '~/stores/game';
import { MaterialType, type Order } from '~/types';
import { MATERIALS } from '~/constants/materials';

export const useOrders = () => {
    const gameStore = useGameStore();

    function generateOrder() {
        // Simple random generation logic
        // Chance to generate order based on reputation?
        // For MVP, let's just ensure there are always a few orders available

        if (gameStore.state.activeOrders.length >= 5) return;

        const materialTypes = Object.values(MaterialType);
        const randomMaterial = materialTypes[Math.floor(Math.random() * materialTypes.length)];

        if (!randomMaterial) return; // Safety check

        const material = MATERIALS[randomMaterial];

        // Difficulty based on material hardness + random variance
        const difficulty = material.hardness * (0.8 + Math.random() * 0.4);

        // Reward calculation
        // Base Price * 2 + Reputation Bonus
        const reputationMultiplier = 1 + (gameStore.state.reputation / 100);
        const reward = Math.ceil(material.basePrice * 2 * difficulty * reputationMultiplier);

        const id = Math.random().toString(36).substring(2, 9);

        const order: Order = {
            id,
            materialType: randomMaterial,
            difficulty,
            reward,
            reputationReward: Math.ceil(material.prestige * difficulty),
            deadline: Math.floor(gameStore.state.gameTime / 1440) + 7 + Math.floor(Math.random() * 7), // 7-14 days from now
            createdAt: Math.floor(gameStore.state.gameTime / 1440)
        };

        gameStore.addOrder(order);
    }

    function checkOrderExpiry() {
        const currentDay = Math.floor(gameStore.state.gameTime / 1440);

        // Iterate backwards to safely remove
        for (let i = gameStore.state.activeOrders.length - 1; i >= 0; i--) {
            const order = gameStore.state.activeOrders[i];
            if (order && currentDay > order.deadline) {
                gameStore.removeOrder(order.id);
                // Penalty for expired order?
                gameStore.state.reputation = Math.max(0, gameStore.state.reputation - 2);
            }
        }
    }

    return {
        generateOrder,
        checkOrderExpiry
    };
};
