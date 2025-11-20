<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div class="bg-stone-900 border-2 border-amber-500 rounded-lg p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
      <div class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

      <h2 class="text-3xl font-serif text-amber-400 mb-2 tracking-widest uppercase">Tebrikler!</h2>
      <div class="text-stone-400 mb-6">Yeni bir rütbeye ulaştınız</div>

      <div class="py-6 border-y border-stone-800 mb-6 bg-stone-900/50">
        <div class="text-4xl font-bold text-white font-serif mb-2">{{ currentRank.title }}</div>
        <div class="text-amber-600 text-sm uppercase tracking-widest">Yeni Unvan</div>
      </div>

      <div class="space-y-3 mb-8 text-left bg-stone-800/50 p-4 rounded">
        <div class="text-xs text-stone-500 uppercase tracking-wide mb-2">Yeni Kilit Açılımları:</div>
        <div v-for="(unlock, index) in currentRank.unlocks" :key="index" class="flex items-center text-stone-300">
          <span class="text-amber-500 mr-2">✦</span>
          {{ unlock }}
        </div>
      </div>

      <button 
        @click="close"
        class="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded transition-colors w-full"
      >
        Harika!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useGameStore } from '~/stores/game';
import confetti from 'canvas-confetti';

const gameStore = useGameStore();
const show = ref(false);
const currentRankIndex = computed(() => gameStore.state.currentRankIndex);
const currentRank = computed(() => gameStore.currentRank);

// Watch for rank changes
watch(currentRankIndex, (newVal, oldVal) => {
  if (newVal > oldVal) {
    show.value = true;
    triggerConfetti();
  }
});

function triggerConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

function close() {
  show.value = false;
}
</script>
