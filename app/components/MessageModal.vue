<template>
  <div v-if="currentMessage" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div class="bg-stone-900 border-2 border-amber-600 rounded-lg max-w-2xl w-full shadow-2xl flex flex-col md:flex-row overflow-hidden">
      <!-- Character Portrait Area -->
      <div class="w-full md:w-1/3 bg-stone-800 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-700">
        <div class="w-32 h-32 rounded-full bg-stone-700 border-4 border-amber-700 mb-4 flex items-center justify-center overflow-hidden">
          <!-- Placeholder for Scribe Image -->
          <span class="text-4xl">📜</span>
        </div>
        <div class="text-amber-500 font-serif text-xl font-bold text-center">{{ currentMessage.sender }}</div>
        <div class="text-stone-500 text-xs uppercase tracking-widest mt-1">Haberci</div>
      </div>

      <!-- Message Content -->
      <div class="w-full md:w-2/3 p-8 flex flex-col">
        <h2 class="text-2xl font-serif text-stone-200 mb-4 border-b border-stone-700 pb-2">{{ currentMessage.subject }}</h2>
        
        <div class="flex-1 text-stone-300 leading-relaxed font-serif text-lg mb-8">
          {{ currentMessage.body }}
        </div>

        <div class="flex justify-end">
          <button 
            @click="markRead"
            class="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-stone-100 font-bold rounded transition-colors shadow-lg hover:shadow-amber-900/20"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '~/stores/game';

const gameStore = useGameStore();

// Show the first unread message
const currentMessage = computed(() => {
  return gameStore.state.messages.find(m => !m.read);
});

function markRead() {
  if (currentMessage.value) {
    gameStore.markMessageRead(currentMessage.value.id);
  }
}
</script>
