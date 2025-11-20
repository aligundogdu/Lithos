<template>
  <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="notification in gameStore.state.notifications" 
        :key="notification.id"
        class="pointer-events-auto p-4 rounded shadow-lg border flex items-start gap-3"
        :class="{
          'bg-stone-800 border-stone-600 text-stone-200': notification.type === 'info',
          'bg-green-900/90 border-green-700 text-green-100': notification.type === 'success',
          'bg-amber-900/90 border-amber-700 text-amber-100': notification.type === 'warning',
          'bg-red-900/90 border-red-700 text-red-100': notification.type === 'error'
        }"
      >
        <div class="flex-1">
          <div class="font-bold text-sm mb-1">{{ notification.title }}</div>
          <div class="text-xs opacity-90">{{ notification.message }}</div>
        </div>
        <button @click="remove(notification.id)" class="text-xs opacity-50 hover:opacity-100">✕</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game';

const gameStore = useGameStore();

function remove(id: string) {
  const index = gameStore.state.notifications.findIndex(n => n.id === id);
  if (index !== -1) {
    gameStore.state.notifications.splice(index, 1);
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
