<template>
  <div class="flex flex-col h-screen w-full md:flex-row">
    <!-- Mobile Tab Navigation -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-700 z-50 flex safe-area-inset-bottom">
      <button 
        @click="activeView = 'workshop'"
        :class="[
          'flex-1 py-4 text-sm font-bold transition-colors duration-200',
          activeView === 'workshop' ? 'bg-stone-800 text-amber-500' : 'text-stone-400'
        ]"
      >
        🏛️ Atölye
      </button>
      <button 
        @click="activeView = 'management'"
        :class="[
          'flex-1 py-4 text-sm font-bold transition-colors duration-200',
          activeView === 'management' ? 'bg-stone-800 text-amber-500' : 'text-stone-400'
        ]"
      >
        📋 Yönetim
      </button>
    </div>

    <!-- Workshop View -->
    <div 
      :class="activeView === 'workshop' ? 'block' : 'hidden md:block'"
      class="flex-1 relative bg-stone-800 md:border-r border-stone-700 pb-16 md:pb-0 overflow-hidden"
    >
      <WorkshopView />
    </div>

    <!-- Management Panel -->
    <div 
      :class="activeView === 'management' ? 'block' : 'hidden md:block'"
      class="w-full md:w-[700px] lg:w-[800px] bg-stone-900 md:border-l border-stone-700 pb-16 md:pb-0 overflow-hidden"
    >
      <ManagementPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameTime } from '~/composables/useGameTime';

const { calculateOfflineProgress, resume } = useGameTime();
const activeView = ref<'workshop' | 'management'>('workshop');

onMounted(() => {
  calculateOfflineProgress();
  resume();
});
</script>
