<template>
  <div class="min-h-screen text-stone-200 font-sans selection:bg-amber-900 selection:text-amber-100 overflow-hidden transition-colors duration-1000" :class="seasonalBackground">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '~/stores/game';
import { Season } from '~/types';

const gameStore = useGameStore();

const seasonalBackground = computed(() => {
  const season = gameStore.currentSeason;
  
  switch (season) {
    case Season.SPRING:
      return 'bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-900';
    case Season.SUMMER:
      return 'bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900';
    case Season.AUTUMN:
      return 'bg-gradient-to-br from-stone-900 via-orange-950 to-stone-900';
    case Season.WINTER:
      return 'bg-gradient-to-br from-stone-900 via-sky-950 to-stone-900';
    default:
      return 'bg-stone-900';
  }
});
</script>

<style>
body {
  @apply bg-stone-900;
}
</style>
