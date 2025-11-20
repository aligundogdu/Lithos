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
        
        <ul class="space-y-2">
           <li v-for="(amount, type) in gameStore.state.inventory" :key="type" class="flex justify-between items-center">
             <span class="capitalize text-stone-400">{{ getMaterialName(type) }}</span>
             <div class="flex items-center gap-2">
               <span class="font-mono text-amber-400">{{ formatNumber(amount) }}</span>
               <button 
                 v-if="amount > 0"
                 @click="gameStore.sellMaterial(type, 1)"
                 class="px-2 py-0.5 bg-stone-800 hover:bg-green-900 text-stone-400 hover:text-green-400 text-xs rounded border border-stone-600 transition-colors"
                 :title="t.common.sell"
               >
                 {{ t.common.sell }}
               </button>
             </div>
           </li>
        </ul>
      </div>

      <div class="bg-stone-700/50 p-4 rounded border border-stone-600">
        <h2 class="text-xl font-serif text-stone-300 mb-4">{{ t.workshop.workers }}</h2>
        <div v-if="gameStore.state.workers.length === 0" class="text-stone-500 italic">
          {{ t.workshop.noWorkers }}
        </div>
        <ul v-else class="space-y-2">
          <li v-for="worker in gameStore.state.workers" :key="worker.id" class="flex justify-between items-center bg-stone-800 p-2 rounded">
            <div class="flex items-center gap-3">
              <div v-html="AvatarGenerator.generate(worker.name)" class="w-10 h-10 rounded overflow-hidden shrink-0 border border-stone-600"></div>
              <div>
                <div class="text-stone-200 font-bold">{{ worker.name }}</div>
                <div class="text-xs text-stone-500 capitalize">{{ getWorkerTypeName(worker.type) }}</div>
              </div>
            </div>
            <div class="text-xs font-mono text-stone-400">{{ t.common.skill }}: {{ worker.skill }}</div>
          </li>
        </ul>
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
          <div class="flex justify-between mt-1 text-xs text-stone-500">
            <span>%{{ Math.floor(task.progress) }}</span>
            <span>{{ Math.ceil(task.totalDuration - (task.totalDuration * task.progress / 100)) }} {{ t.workshop.minutesLeft }}</span>
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
import { formatNumber } from '~/utils/formatters';

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
