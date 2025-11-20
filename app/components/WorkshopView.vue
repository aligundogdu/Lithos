<template>
  <div class="p-6 h-full overflow-y-auto">
    <header class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-serif text-amber-500 mb-2">{{ t.game.title }}</h1>
        <div class="flex gap-4 text-sm text-stone-400">
          <span>{{ t.common.day }}: {{ gameStore.currentDay }}</span>
          <span>{{ t.common.hour }}: {{ gameStore.currentHour.toString().padStart(2, '0') }}:00</span>
          <span class="capitalize text-amber-600 font-bold">{{ gameStore.currentSeason }}</span>
        </div>
      </div>
      <LanguageSwitcher />
    </header>

    <!-- Visual Representation Area (Placeholder) -->
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="bg-stone-700/50 p-4 rounded border border-stone-600">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-serif text-stone-300">{{ t.workshop.inventory }}</h2>
            <!-- Storage Bar -->
            <div class="w-32 bg-stone-900 h-3 rounded-full overflow-hidden border border-stone-600 relative" :title="`${gameStore.currentStorageLoad} / ${gameStore.maxStorageCapacity} VU`">
                <div 
                class="h-full transition-all duration-500"
                :class="gameStore.storagePercentage > 90 ? 'bg-red-600' : 'bg-blue-600'"
                :style="{ width: `${gameStore.storagePercentage}%` }"
                ></div>
            </div>
        </div>
        
        <div class="grid grid-cols-3 gap-3">
           <div v-for="(amount, type) in gameStore.state.inventory" :key="type" class="bg-stone-800 p-3 rounded border border-stone-600 flex flex-col items-center text-center group relative hover:border-amber-500 transition-colors">
             <div class="w-16 h-16 mb-2 relative flex items-center justify-center">
                <img :src="`/images/materials/${type}.png`" :alt="getMaterialName(type)" class="max-w-full max-h-full drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
             </div>
             <span class="capitalize text-stone-300 font-bold text-sm mb-1">{{ getMaterialName(type) }}</span>
             <span class="font-mono text-amber-400 text-lg">{{ formatNumber(amount) }}</span>
             
             <!-- Sell Button (Overlay) -->
             <button 
               v-if="amount > 0"
               @click="gameStore.sellMaterial(type, 1)"
               class="absolute top-2 right-2 w-6 h-6 bg-stone-900/80 hover:bg-green-600 text-stone-400 hover:text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
               :title="t.common.sell"
             >
               $
             </button>
           </div>
        </div>
      </div>

      <div class="bg-stone-700/50 p-4 rounded border border-stone-600">
        <h2 class="text-xl font-serif text-stone-300 mb-4">{{ t.workshop.workers }}</h2>
        <div v-if="gameStore.state.workers.length === 0" class="text-stone-500 italic">
          {{ t.workshop.noWorkers }}
        </div>
        <div v-else class="grid grid-cols-4 gap-2">
          <div v-for="worker in gameStore.state.workers" :key="worker.id" class="bg-stone-800 p-2 rounded flex flex-col items-center text-center group relative hover:bg-stone-700 transition-colors cursor-default border border-stone-700 hover:border-stone-500">
            <div v-html="AvatarGenerator.generate(worker.name)" class="w-10 h-10 rounded overflow-hidden border border-stone-600 mb-1 shadow-sm"></div>
            <div class="text-stone-200 font-bold text-[10px] truncate w-full">{{ worker.name }}</div>
            
            <!-- Tooltip for details -->
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-stone-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-stone-600 shadow-xl">
              <div class="font-bold text-amber-500">{{ worker.name }}</div>
              <div class="text-[10px] capitalize">{{ getWorkerTypeName(worker.type) }}</div>
              <div class="text-[10px] font-mono">{{ t.common.skill }}: {{ worker.skill }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Productions -->
    <div class="bg-stone-700/50 p-4 rounded border border-stone-600">
      <h2 class="text-xl font-serif text-stone-300 mb-4">{{ t.workshop.productionLine }}</h2>
      <div v-if="gameStore.state.productionTasks.length === 0" class="text-stone-500 italic">
        {{ t.workshop.noProduction }}
      </div>
      <div v-else class="space-y-4">
        <div v-for="task in gameStore.state.productionTasks" :key="task.id" class="bg-stone-800 p-3 rounded border border-stone-600">
          <div class="flex justify-between mb-2">
            <div class="flex gap-3">
              <div v-html="ProductVisualizer.generate(task.productType, task.materialType)" class="w-12 h-12 rounded shrink-0 bg-stone-900/50 border border-stone-600"></div>
              <div>
                <span class="text-stone-300 font-bold">{{ getMaterialName(task.materialType) }} {{ PRODUCTS[task.productId]?.name || task.productType }}</span>
                <div class="text-xs text-stone-500 flex items-center gap-2">
                   {{ t.common.workers }}: {{ task.assignedWorkers.length }} | {{ t.common.risk }}: %{{ (task.risk * 100).toFixed(1) }}
                   <span class="px-2 py-0.5 rounded text-xs font-bold" :class="{
                     'bg-orange-900/50 text-orange-300': task.currentStage === 'roughing',
                     'bg-blue-900/50 text-blue-300': task.currentStage === 'detailing',
                     'bg-purple-900/50 text-purple-300': task.currentStage === 'inspection'
                   }">
                     {{ getStageLabel(task.currentStage) }}
                   </span>
                </div>
              </div>
            </div>
            <div class="text-xs text-stone-400">
              Aşama {{ getStageNumber(task.currentStage) }}/3 - %{{ getStageProgress(task).toFixed(1) }}
            </div>
            <span :class="{
              'text-amber-500': task.status === 'active',
              'text-green-500': task.status === 'completed',
              'text-red-500': task.status === 'failed',
              'text-stone-500': task.status === 'pending',
              'text-orange-500': task.status === 'pending_storage'
            }" class="text-xs capitalize font-bold">{{ t.status[task.status] }}</span>
          </div>
          
          <div class="w-full bg-stone-900 h-3 rounded-full overflow-hidden relative">
            <div 
              class="h-full transition-all duration-300" 
              :class="{
                'bg-orange-600': task.currentStage === 'roughing',
                'bg-blue-600': task.currentStage === 'detailing',
                'bg-purple-600': task.currentStage === 'inspection'
              }"
              :style="{ width: `${getStageProgress(task)}%` }"
            ></div>
          </div>
            <div class="text-xs text-stone-400 mt-1 flex justify-between">
              <span>{{ t.status[task.status] }}</span>
              <span>{{ formatDuration(Math.ceil(task.totalDuration - (task.progress / 100 * task.totalDuration))) }} {{ t.common.remaining }}</span>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game';
import { MATERIALS } from '~/constants/materials';
import { PRODUCTS } from '~/constants/products';
import { AvatarGenerator } from '~/utils/avatarGenerator';
import { ProductVisualizer } from '~/utils/productVisualizer';
import { useTranslation } from '~/composables/useTranslation';
import { useMaterialTranslation } from '~/composables/useMaterialTranslation';
import { useWorkerTranslation } from '~/composables/useWorkerTranslation';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';
import { formatNumber, formatDuration } from '~/utils/formatters';

const gameStore = useGameStore();
const { t } = useTranslation();
const { getMaterialName } = useMaterialTranslation();
const { getWorkerTypeName } = useWorkerTranslation();

// Helper functions for stage display
function getStageProgress(task: any): number {
  const stageRanges = {
    roughing: { min: 0, max: 33.33 },
    detailing: { min: 33.33, max: 66.66 },
    inspection: { min: 66.66, max: 100 }
  };
  
  const range = stageRanges[task.currentStage as keyof typeof stageRanges];
  if (!range) return 0;
  
  // Normalize progress to 0-100 within current stage
  const stageProgress = ((task.progress - range.min) / (range.max - range.min)) * 100;
  return Math.max(0, Math.min(100, stageProgress));
}

function getStageNumber(stage: string): number {
  const stages = { roughing: 1, detailing: 2, inspection: 3 };
  return stages[stage as keyof typeof stages] || 1;
}

function getStageLabel(stage: string): string {
  const labels = {
    roughing: '🔨 Kaba İnşaat',
    detailing: '✨ Detaylandırma',
    inspection: '🔍 Kalite Kontrol'
  };
  return labels[stage as keyof typeof labels] || stage;
}
</script>
