<template>
  <div class="flex h-screen w-full">
    <!-- Left/Center: Workshop Visualization -->
    <div class="flex-1 relative bg-stone-800 border-r border-stone-700">
      <WorkshopView />
    </div>

    <!-- Right: Management Panel -->
    <div class="w-[700px] bg-stone-900 border-l border-stone-700 shadow-2xl z-10 flex flex-col">
      <ManagementPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useGameTime } from '~/composables/useGameTime';

const { calculateOfflineProgress, resume } = useGameTime();

onMounted(() => {
  calculateOfflineProgress();
  resume();
});
</script>
