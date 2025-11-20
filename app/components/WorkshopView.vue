<template>
  <div class="p-6 h-full overflow-y-auto">
    <header class="mb-8 flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-serif text-amber-500 mb-2">{{ t.game.title }}</h1>
        <div class="flex gap-4 text-sm text-stone-400">
          <span>{{ t.common.day }}: {{ Math.floor(gameStore.state.gameTime / 1440) }}</span>
          <span>{{ t.common.hour }}: {{ Math.floor((gameStore.state.gameTime % 1440) / 60).toString().padStart(2, '0') }}:00</span>
        </div>
      </div>
      <LanguageSwitcher />
    </header>

    <!-- Visual Representation Area (Placeholder) -->
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div class="bg-stone-700/50 p-4 rounded border border-stone-600">
        <h2 class="text-xl font-serif text-stone-300 mb-4">{{ t.workshop.inventory }}</h2>
        <ul class="space-y-2">
           <li v-for="(amount, type) in gameStore.state.inventory" :key="type" class="flex justify-between items-center">
             <span class="capitalize text-stone-400">{{ getMaterialName(type) }}</span>
             <div class="flex items-center gap-2">
               <span class="font-mono text-amber-400">{{ Math.floor(amount) }}</span>
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
                <div class="text-xs text-stone-500">
                   {{ t.common.workers }}: {{ task.assignedWorkers.length }} | {{ t.common.risk }}: %{{ (task.risk * 100).toFixed(1) }}
                </div>
              </div>
            </div>
            <span :class="{
              'text-amber-500': task.status === 'active',
              'text-green-500': task.status === 'completed',
              'text-red-500': task.status === 'failed',
              'text-stone-500': task.status === 'pending'
            }" class="text-xs capitalize font-bold">{{ task.status }}</span>
          </div>
          
          <div class="w-full bg-stone-900 h-3 rounded-full overflow-hidden relative">
            <div 
              class="h-full transition-all duration-300" 
              :class="{
                'bg-amber-600': task.status === 'active' || task.status === 'pending',
                'bg-green-600': task.status === 'completed',
                'bg-red-600': task.status === 'failed'
              }"
              :style="{ width: `${task.progress}%` }"
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

const gameStore = useGameStore();
const { t } = useTranslation();
const { getMaterialName } = useMaterialTranslation();
const { getWorkerTypeName } = useWorkerTranslation();
</script>
