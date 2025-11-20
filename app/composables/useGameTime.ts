import { useIntervalFn } from '@vueuse/core';
import { useGameStore } from '~/stores/game';
import { useOrders } from '~/composables/useOrders';
import { useProduction } from '~/composables/useProduction';

export const useGameTime = () => {
    const gameStore = useGameStore();
    const { generateOrder, checkOrderExpiry } = useOrders();
    const { processProductionTick } = useProduction();

    const GAME_MINUTES_PER_REAL_SECOND = 12; // 1 Real Minute = 0.5 Game Day (720 mins) -> 120s = 1440m -> 1s = 12m

    // Game Loop
    const { pause, resume, isActive } = useIntervalFn(() => {
        // Tick time
        gameStore.tickTime(GAME_MINUTES_PER_REAL_SECOND);

        // Process production tasks
        gameStore.state.productionTasks.forEach(task => {
            processProductionTick(task);
        });

        // Order Management (Daily checks)
        // We can check every tick, but maybe limit generation frequency
        // Let's check every ~100 ticks or just randomly
        if (Math.random() < 0.05) { // 5% chance per second to generate order
            generateOrder();
        }

        // Check expiry occasionally
        if (gameStore.state.gameTime % 1440 < GAME_MINUTES_PER_REAL_SECOND) { // Once a day roughly
            checkOrderExpiry();
        }

    }, 1000);

    function calculateOfflineProgress() {
        const now = Date.now();
        const lastSave = gameStore.state.lastSaveTime;
        const deltaMs = now - lastSave;

        if (deltaMs > 0) {
            const deltaSeconds = Math.floor(deltaMs / 1000);
            const gameMinutesPassed = deltaSeconds * GAME_MINUTES_PER_REAL_SECOND;

            console.log(`Offline for ${deltaSeconds}s. Simulating ${gameMinutesPassed} game minutes.`);

            // Apply time
            gameStore.tickTime(gameMinutesPassed);

            // TODO: Simulate production progress for this duration
            // We might need to expose a method in useProduction to "fast forward" tasks
        }
    }

    return {
        pause,
        resume,
        isActive,
        calculateOfflineProgress
    };
};
