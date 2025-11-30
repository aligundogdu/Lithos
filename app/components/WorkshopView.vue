<template>
  <div class="p-3 sm:p-4 md:p-6 h-full overflow-y-auto">
    <header class="mb-4 md:mb-8 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-serif mb-2 transition-colors duration-500" :class="seasonalClasses.header">{{ t.game.title }}</h1>
        <div class="flex gap-2 sm:gap-4 text-xs sm:text-sm text-stone-400">
          <span>{{ t.common.day }}: {{ gameStore.currentDay }}</span>
          <span>{{ t.common.hour }}: {{ gameStore.currentHour.toString().padStart(2, '0') }}:00</span>
          <span class="capitalize font-bold transition-colors duration-500" :class="seasonalClasses.header">
            {{ getSeasonEmoji(gameStore.currentSeason) }} {{ gameStore.currentSeason }}
          </span>
        </div>
      </div>
      <LanguageSwitcher />
    </header>

    <!-- Visual Representation Area (Placeholder) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="p-4 rounded border transition-all duration-500" :class="seasonalClasses.card">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-serif text-stone-300">{{ t.workshop.inventory }}</h2>
            <!-- Storage Bar -->
            <div class="w-32 bg-stone-900 h-3 rounded-full overflow-hidden border transition-colors duration-500 relative" :class="seasonalClasses.border" :title="`${gameStore.currentStorageLoad} / ${gameStore.maxStorageCapacity} VU`">
                <div 
                class="h-full transition-all duration-500"
                :class="gameStore.storagePercentage > 90 ? 'bg-red-600' : seasonalClasses.progress"
                :style="{ width: `${gameStore.storagePercentage}%` }"
                ></div>
            </div>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
           <div 
             v-for="(amount, type) in gameStore.state.inventory" 
             :key="type" 
             class="relative p-2 rounded border border-stone-600 flex flex-col items-center justify-center text-center group hover:border-amber-500 transition-all aspect-square cursor-default"
             :style="{
               backgroundImage: `url(/images/materials/${getMaterialImageName(type)})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }"
           >
             <!-- Dark overlay for text readability -->
             <div class="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-stone-900/70 to-stone-900/90 group-hover:from-stone-900/70 group-hover:via-stone-900/60 group-hover:to-stone-900/80 transition-all overflow-hidden rounded"></div>
             
             <!-- Detailed Tooltip -->
             <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-stone-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 border border-stone-600 shadow-xl text-left min-w-[200px]">
               <div class="font-bold text-amber-500 mb-1">{{ getMaterialName(type) }}</div>
               <div class="text-[10px] text-stone-400 mb-2 italic">{{ MATERIALS[type]?.description }}</div>
               <div class="border-t border-stone-700 pt-1 mt-1 space-y-0.5">
                 <div class="text-[10px] flex justify-between">
                   <span class="text-stone-500">Hacim:</span>
                   <span class="font-mono">{{ MATERIALS[type]?.volume }} VU</span>
                 </div>
                 <div class="text-[10px] flex justify-between">
                   <span class="text-stone-500">Fiyat:</span>
                   <span class="font-mono text-amber-400">{{ MATERIALS[type]?.basePrice }} 💰</span>
                 </div>
                 <div class="text-[10px] flex justify-between">
                   <span class="text-stone-500">Sertlik:</span>
                   <span class="font-mono">{{ MATERIALS[type]?.hardness }}</span>
                 </div>
               </div>
             </div>
             
             <!-- Content: Only Number -->
             <div class="relative z-10 w-full">
               <span class="font-mono text-amber-400 text-2xl sm:text-3xl font-bold drop-shadow-lg">{{ formatNumber(amount) }}</span>
             </div>
             
             <!-- Sell Button (Overlay) -->
             <button 
               v-if="amount > 0"
               @click="gameStore.sellMaterial(type, 1)"
               class="absolute top-1 right-1 w-6 h-6 bg-stone-900/90 hover:bg-green-600 text-stone-400 hover:text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 text-xs z-20 shadow-lg"
               :title="t.common.sell"
             >
               $
             </button>
           </div>
        </div>
      </div>

      <div class="p-4 rounded border transition-all duration-500" :class="seasonalClasses.card">
        <h2 class="text-xl font-serif text-stone-300 mb-4">{{ t.workshop.workers }}</h2>
        <div v-if="gameStore.state.workers.length === 0" class="text-stone-500 italic">
          {{ t.workshop.noWorkers }}
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div v-for="worker in gameStore.state.workers" :key="worker.id" class="bg-stone-800 p-2 rounded flex flex-col items-center justify-center text-center group relative hover:bg-stone-700 transition-colors cursor-default border border-stone-700 hover:border-stone-500 aspect-square">
            <div v-html="AvatarGenerator.generate(worker.name)" class="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border border-stone-600 shadow-sm"></div>
            
            <!-- Tooltip for details -->
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-stone-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 border border-stone-600 shadow-xl text-left">
              <div class="font-bold text-amber-500 mb-1">{{ worker.name }}</div>
              <div class="text-[10px] capitalize mb-0.5">{{ getWorkerTypeName(worker.type) }}</div>
              <div class="text-[10px] font-mono mb-1">{{ t.common.skill }}: {{ worker.skill }}</div>
              
              <!-- Daily Mood -->
              <div v-if="worker.dailyState" class="border-t border-stone-700 pt-1 mt-1">
                <div class="flex items-center gap-1">
                    <span>{{ worker.dailyState.icon }}</span>
                    <span class="font-bold" :class="worker.dailyState.color">{{ worker.dailyState.text }}</span>
                </div>
                <div class="text-[9px] text-stone-400 italic">{{ worker.dailyState.description }}</div>
              </div>
            </div>
            
            <!-- Mood Dot -->
            <div v-if="worker.dailyState" class="absolute top-1 right-1 w-2 h-2 rounded-full" :class="worker.dailyState.color.replace('text-', 'bg-')"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Productions -->
    <div class="p-4 rounded border transition-all duration-500" :class="seasonalClasses.card">
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
            <div class="flex items-center gap-2">
              <span :class="{
                'text-amber-500': task.status === 'active',
                'text-green-500': task.status === 'completed',
                'text-red-500': task.status === 'failed',
                'text-stone-500': task.status === 'pending',
                'text-orange-500': task.status === 'pending_storage'
              }" class="text-xs capitalize font-bold">{{ t.status[task.status] }}</span>
              
              <!-- Cancel Button -->
              <button 
                v-if="task.status === 'active' || task.status === 'pending_storage'"
                @click="gameStore.cancelProduction(task.id)"
                class="px-2 py-1 bg-red-700 hover:bg-red-600 text-white rounded text-xs transition-colors"
                title="Üretimi İptal Et"
              >
                ✕
              </button>
            </div>
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
import { computed } from 'vue';
import { useGameStore } from '~/stores/game';
import { MATERIALS } from '~/constants/materials';
import { PRODUCTS } from '~/constants/products';
import { AvatarGenerator } from '~/utils/avatarGenerator';
import { ProductVisualizer } from '~/utils/productVisualizer';
import { useTranslation } from '~/composables/useTranslation';
import { useMaterialTranslation } from '~/composables/useMaterialTranslation';
import { useWorkerTranslation } from '~/composables/useWorkerTranslation';
import { useSeasonalColors } from '~/composables/useSeasonalColors';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';
import { formatNumber, formatDuration } from '~/utils/formatters';

const gameStore = useGameStore();
const { t } = useTranslation();
const { getMaterialName } = useMaterialTranslation();
const { getWorkerTypeName } = useWorkerTranslation();

// Seasonal colors
const { getSeasonalClasses } = useSeasonalColors(gameStore.currentSeason);
const seasonalClasses = computed(() => ({
  header: getSeasonalClasses('header'),
  card: getSeasonalClasses('card'),
  border: getSeasonalClasses('border'),
  progress: getSeasonalClasses('progress'),
}));

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

function getSeasonEmoji(season: string): string {
  const emojis: Record<string, string> = {
    spring: '🌸',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️'
  };
  return emojis[season] || '';
}

function getMaterialImageName(materialType: string): string {
  const imageMap: Record<string, string> = {
    'clay': 'nehir.webp',
    'limestone': 'kirec.webp',
    'marble_pentelic': 'mermer.webp',
    'basalt': 'bazalt.webp',
    'rubble': 'moloz.webp'
  };
  return imageMap[materialType] || 'mermer.webp';
}
</script>
