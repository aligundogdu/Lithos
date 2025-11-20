import { useGameStore } from '~/stores/game';
import { MaterialType, type Order, ProductType } from '~/types';
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
        // Logarithmic Reputation Bonus: 1 + log10(Reputation) * 0.2
        // This prevents prices from exploding at high reputation
        const reputationMultiplier = 1 + (Math.log10(Math.max(10, gameStore.state.reputation)) * 0.2);

        // Base Reward
        let reward = Math.ceil(material.basePrice * 2 * difficulty * reputationMultiplier);

        // Soft Cap for MVP to avoid game breaking numbers
        reward = Math.min(50000, reward);

        const id = Math.random().toString(36).substring(2, 9);

        const order: Order = {
            id,
            materialType: randomMaterial,
            difficulty,
            reward,
            reputationReward: Math.ceil(material.prestige * difficulty),
            deadline: Math.floor(gameStore.state.gameTime / 1440) + 7 + Math.floor(Math.random() * 7), // 7-14 days from now
            createdAt: Math.floor(gameStore.state.gameTime / 1440),
            productId: 'random_product', // Placeholder
            productType: ProductType.STATUE // Placeholder
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
