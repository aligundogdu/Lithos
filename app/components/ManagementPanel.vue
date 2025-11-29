<template>
  <div class="flex flex-col h-full relative">
    <!-- Night Mode Overlay -->
    <div v-if="!gameStore.isDaytime" class="absolute inset-0 bg-blue-900/30 pointer-events-none z-50 flex items-center justify-center">
        <div class="text-4xl font-serif text-blue-200 animate-pulse">💤 Gece - Üretim Durdu</div>
    </div>
    <!-- Tabs -->
    <div class="flex border-b border-stone-700 overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 min-w-[80px] py-4 text-xs sm:text-sm font-serif tracking-wider transition-colors duration-500',
          activeTab === tab.id 
            ? ['bg-stone-800 border-b-2', seasonalClasses.header, seasonalClasses.border] 
            : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-3 sm:p-4">
      <!-- Header Stats -->
      <div class="mb-6 p-4 rounded border transition-all duration-500 flex justify-between items-center" :class="seasonalClasses.card">
        <!-- Money -->
        <div>
          <div class="text-xs text-stone-500 uppercase tracking-widest">{{ t.common.money }}</div>
          <div class="text-2xl font-mono transition-colors duration-500" :class="seasonalClasses.header">{{ formatNumber(gameStore.state.money) }} <span class="text-sm" :class="seasonalClasses.header">D.</span></div>
        </div>

        <!-- Expenses -->
        <div @click="showExpensesModal = true" class="cursor-pointer hover:bg-stone-700/50 p-1 rounded transition-colors text-center">
          <div class="text-xs text-stone-500 uppercase tracking-widest">{{ t.notifications.monthlyExpenses }}</div>
          <div class="text-xl font-mono text-red-400">{{ formatNumber(gameStore.state.monthlyExpenses) }} <span class="text-sm text-red-600">D.</span></div>
        </div>

        <!-- Reputation -->
        <div @click="showReputationModal = true" class="cursor-pointer hover:bg-stone-700/50 p-1 rounded transition-colors text-right">
          <div class="text-xs text-stone-500 uppercase tracking-widest">{{ getRankTitle(gameStore.state.currentRankIndex + 1) }}</div>
          <div class="text-2xl font-mono text-purple-400">{{ formatNumber(gameStore.state.reputation) }}</div>
        </div>
      </div>

      <!-- Reputation Modal -->
      <div v-if="showReputationModal" class="absolute inset-0 bg-stone-900/95 z-30 flex flex-col items-center justify-center p-4">
        <div class="bg-stone-800 border border-stone-600 rounded p-6 w-full max-w-md relative">
          <button @click="showReputationModal = false" class="absolute top-2 right-2 text-stone-400 hover:text-stone-200">✕</button>
          
          <h3 class="text-xl font-serif text-purple-400 mb-1 text-center">{{ getRankTitle(gameStore.state.currentRankIndex + 1) }}</h3>
          <div class="text-center text-stone-400 text-sm mb-6">{{ t.common.reputation }}: {{ formatNumber(gameStore.state.reputation) }}</div>
          
          <div v-if="gameStore.nextRank" class="space-y-4">
            <div class="text-sm text-stone-300 flex justify-between">
              <span>{{ t.management.nextRank }}: {{ getRankTitle(gameStore.state.currentRankIndex + 2) }}</span>
              <span>{{ formatNumber(gameStore.nextRank.minReputation) }}</span>
            </div>
            
            <div class="w-full bg-stone-900 h-4 rounded-full overflow-hidden border border-stone-700 relative">
               <div 
                 class="h-full bg-purple-600 transition-all duration-500"
                 :style="{ width: `${calculateRankProgress()}%` }"
               ></div>
               <div class="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white drop-shadow-md">
                 %{{ Math.floor(calculateRankProgress()) }}
               </div>
            </div>
            
            <div class="mt-4 p-3 bg-stone-900/50 rounded border border-stone-700">
                <div class="text-xs text-stone-500 uppercase tracking-widest mb-2">{{ (t.management as any).nextRankUnlocks }}</div>
                <ul class="text-sm text-stone-300 space-y-1">
                    <li v-for="unlock in gameStore.nextRank.unlocks" :key="unlock" class="flex items-center gap-2">
                        <span class="text-amber-500">🔓</span> {{ unlock }}
                    </li>
                </ul>
            </div>
          </div>
          <div v-else class="text-center text-amber-500 font-bold mt-4">
              {{ (t.management as any).maxRankReached }}
          </div>
        </div>
      </div>

      <!-- Market Tab -->
      <div v-if="activeTab === 'market'" class="space-y-4">
        <h3 class="text-lg font-serif text-stone-300 mb-2">{{ t.management.marketTitle }}</h3>
        <div v-for="material in materialsList" :key="material.id" class="bg-stone-800 p-3 rounded border border-stone-700 hover:border-stone-500 transition-colors relative">
          <!-- Locked Overlay -->
          <div v-if="!gameStore.unlockedMaterials.includes(material.id)" class="absolute inset-0 bg-stone-900/90 backdrop-blur-[1px] flex items-center justify-center rounded z-10">
            <div class="text-xs text-stone-500 font-mono text-center px-2">
              <div class="mb-1">🔒 {{ t.common.locked }}</div>
              <div class="text-amber-500">{{ getMaterialUnlockCondition(material.id) }}</div>
            </div>
          </div>

          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-bold text-stone-200">{{ getMaterialName(material.id) }}</div>
              <div class="text-xs text-stone-500">{{ getMaterialDescription(material.id) }}</div>
            </div>
            <div class="text-right">
              <div class="text-amber-400 font-mono">{{ getSeasonalPrice(material.id, material.basePrice) }} D.</div>
              <div v-if="getSeasonalPrice(material.id, material.basePrice) > material.basePrice" class="text-xs text-blue-300">❄️ Kış +%30</div>
              <div class="text-xs text-stone-400 mt-1">{{ t.common.volume }}: {{ material.volume }} VU</div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-stone-400 mb-3">
            <span>{{ t.common.hardness }}: {{ material.hardness }}</span>
            <span>{{ t.common.brittleness }}: {{ Math.round(material.brittleness * 100) }}%</span>
          </div>
            <button 
              @click="gameStore.buyMaterial(material.id, 1)"
              class="w-full py-3 min-h-[44px] bg-stone-700 hover:bg-amber-700 text-stone-200 rounded transition-colors text-sm uppercase tracking-wide group relative"
              :disabled="gameStore.state.money < getSeasonalPrice(material.id, material.basePrice) || !gameStore.unlockedMaterials.includes(material.id) || (gameStore.currentStorageLoad + material.volume > gameStore.maxStorageCapacity)"
              :class="{ 'opacity-50 cursor-not-allowed': gameStore.state.money < getSeasonalPrice(material.id, material.basePrice) || !gameStore.unlockedMaterials.includes(material.id) || (gameStore.currentStorageLoad + material.volume > gameStore.maxStorageCapacity) }"
            >
            {{ t.common.buy }}
            
            <!-- Tooltip for Storage Full -->
            <span v-if="gameStore.currentStorageLoad + material.volume > gameStore.maxStorageCapacity" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {{ t.notifications.storageFull }}
            </span>
          </button>
        </div>
      </div>


      <div v-if="activeTab === 'workforce'" class="space-y-6">
        <!-- Hire Workers -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-stone-400 text-sm uppercase tracking-wider font-bold">{{ t.management.hireWorker }}</h3>
            <div class="text-xs text-stone-500">
              {{ t.common.workers }}: {{ gameStore.state.workers.length }} / {{ gameStore.maxWorkers }}
            </div>
          </div>
          
          <div class="space-y-3">
            <div v-for="workerType in workerTypes" :key="workerType.type" class="bg-stone-800 p-3 rounded border border-stone-700 flex justify-between items-center relative">
              
              <!-- Locked Overlay -->
              <div v-if="!gameStore.unlockedWorkerTypes.includes(workerType.type)" class="absolute inset-0 bg-stone-900/90 backdrop-blur-[1px] flex items-center justify-center rounded z-10">
                 <div class="text-xs text-stone-500 font-mono">🔒 {{ t.common.locked }}</div>
              </div>

              <div>
                <div class="font-bold text-stone-200 capitalize">{{ getWorkerTypeName(workerType.type) }}</div>
                <div class="text-xs text-stone-500">{{ t.workerDescriptions[workerType.type] }}</div>
              </div>
              <div class="text-amber-400 font-mono">{{ workerType.salary }} D./{{ t.common.month }}</div>
              <button 
                @click="hireWorker(workerType.type, workerType.salary)"
                class="w-full py-2 bg-stone-700 hover:bg-amber-700 text-stone-200 rounded transition-colors text-sm uppercase tracking-wide"
                :disabled="gameStore.state.money < workerType.salary || gameStore.state.workers.length >= gameStore.maxWorkers || !gameStore.unlockedWorkerTypes.includes(workerType.type)"
                :class="{ 'opacity-50 cursor-not-allowed': gameStore.state.money < workerType.salary || gameStore.state.workers.length >= gameStore.maxWorkers || !gameStore.unlockedWorkerTypes.includes(workerType.type) }"
              >
                {{ t.common.hire }}
              </button>
            </div>
          </div>
        </div>

        <!-- Current Workers Section -->
        <div class="space-y-4 pt-4 border-t border-stone-700">
          <h3 class="text-lg font-serif text-stone-300 mb-2">{{ t.management.workersTitle }} ({{ gameStore.state.workers.length }})</h3>
          
          <div v-if="gameStore.state.workers.length === 0" class="text-stone-500 text-sm italic text-center py-4">
            {{ t.workshop.noWorkers }}
          </div>

          <div v-else class="space-y-3">
            <div v-for="worker in gameStore.state.workers" :key="worker.id" class="bg-stone-800 p-3 rounded border border-stone-700 relative overflow-hidden">
              <!-- Negotiation Overlay -->
              <div v-if="worker.negotiationPending" class="absolute inset-0 bg-stone-900/90 z-10 flex flex-col items-center justify-center p-4 text-center">
                 <div class="text-amber-400 font-bold mb-2 animate-pulse">⚠️ ZAM TALEBİ!</div>
                 <p class="text-xs text-stone-300 mb-3">{{ worker.name }} seviye atladı ve maaş artışı istiyor.</p>
                 <div class="flex gap-2 w-full">
                    <button @click="gameStore.handleWageNegotiation(worker.id, true)" class="flex-1 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded">Kabul Et</button>
                    <button @click="gameStore.handleWageNegotiation(worker.id, false)" class="flex-1 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded">Reddet</button>
                 </div>
              </div>

              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-bold text-stone-200 flex items-center gap-2">
                    <div v-html="AvatarGenerator.generate(worker.name)" class="w-8 h-8 rounded overflow-hidden shrink-0"></div>
                    {{ worker.name }} 
                    <span class="text-xs px-1.5 py-0.5 bg-amber-900/50 text-amber-200 rounded border border-amber-800">Lvl {{ worker.level }}</span>
                  </div>
                  <div class="text-xs text-stone-500 capitalize flex items-center gap-2">
                    {{ getWorkerTypeName(worker.type) }}                     <span v-if="worker.skill < worker.baseSkill" class="text-red-400 flex items-center" title="Yetenek Köreliyor">
                        (Paslanıyor 📉)
                     </span>
                  </div>
                  <!-- Daily State -->
                  <div v-if="worker.dailyState" class="text-xs mt-1 px-2 py-0.5 rounded bg-stone-900 border border-stone-700 inline-block">
                      <span class="text-stone-400">{{ worker.dailyState.text }}</span>
                      <span v-if="worker.dailyState.effect.speed" :class="worker.dailyState.effect.speed > 0 ? 'text-green-400' : 'text-red-400'">
                          {{ worker.dailyState.effect.speed > 0 ? '+' : '' }}{{ worker.dailyState.effect.speed * 100 }}% Hız
                      </span>
                      <span v-if="worker.dailyState.effect.risk" :class="worker.dailyState.effect.risk < 0 ? 'text-green-400' : 'text-red-400'">
                          {{ worker.dailyState.effect.risk > 0 ? '+' : '' }}{{ worker.dailyState.effect.risk * 100 }}% Risk
                      </span>
                  </div>
                  
                  <!-- XP Bar -->
                  <div class="w-24 h-1.5 bg-stone-900 rounded-full mt-1 overflow-hidden">
                    <div class="h-full bg-blue-500/70" :style="{ width: `${(worker.experience / (worker.level * 100)) * 100}%` }"></div>
                  </div>
                  
                  <div class="flex gap-3 mt-1">
                     <div class="text-xs text-amber-500/80">{{ t.common.salary }}: {{ worker.salary }} D.</div>
                     <div class="text-xs" :class="{
                       'text-red-400': worker.loyalty <= 30,
                       'text-yellow-400': worker.loyalty > 30 && worker.loyalty <= 60,
                       'text-green-400': worker.loyalty > 60
                     }" :title="`${t.common.loyalty}: ${worker.loyalty}%`">♥ {{ worker.loyalty }}%</div>
                  </div>
                </div>
                
                <div class="flex flex-col items-end gap-2">
                  <div class="text-xs px-2 py-1 rounded bg-stone-900" :class="worker.status === 'idle' ? 'text-green-400' : 'text-amber-400'">
                    {{ worker.status === 'idle' ? t.status.idle : t.status.working }}
                  </div>
                  <button 
                    @click="fireWorker(worker.id)"
                    class="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-200 text-xs rounded transition-colors border border-red-900"
                    :disabled="worker.status !== 'idle'"
                    :class="{ 'opacity-50 cursor-not-allowed': worker.status !== 'idle' }"
                    title="Çalışan işçi kovulamaz"
                  >
                    {{ t.common.fire }}
                  </button>
                </div>
              </div>

              <!-- Equipment Slots -->
              <div class="mt-3 pt-3 border-t border-stone-700/50">
                <div class="text-xs text-stone-400 mb-2 font-bold tracking-wider">{{ t.management.equippedTools }} ({{ worker.equippedToolIds ? worker.equippedToolIds.length : 0 }}/2)</div>
                <div class="flex gap-2">
                  <!-- Slot 1 -->
                  <div class="flex-1 bg-stone-900/50 rounded p-2 border border-stone-700 flex items-center justify-between min-h-[40px]">
                    <div v-if="worker.equippedToolIds && worker.equippedToolIds[0]" class="flex items-center justify-between w-full">
                       <span class="text-xs text-stone-300">{{ getToolName(worker.equippedToolIds[0]) }}</span>
                       <button @click="gameStore.unequipTool(worker.id, worker.equippedToolIds[0])" class="text-red-400 hover:text-red-300 ml-2">✕</button>
                    </div>
                    <div v-else class="w-full">
                       <select 
                         @change="(e) => equipToolToWorker(worker.id, (e.target as HTMLSelectElement).value)"
                         class="w-full bg-transparent text-xs text-stone-500 outline-none cursor-pointer"
                       >
                         <option value="" selected disabled>{{ t.common.equip }}...</option>
                         <option 
                           v-for="tool in getAvailableToolsForWorker(worker)" 
                           :key="tool.id" 
                           :value="tool.id"
                         >
                           {{ tool.name }} ({{ gameStore.state.toolInventory[tool.id] }})
                         </option>
                       </select>
                    </div>
                  </div>

                  <!-- Slot 2 -->
                  <div class="flex-1 bg-stone-900/50 rounded p-2 border border-stone-700 flex items-center justify-between min-h-[40px]">
                    <div v-if="worker.equippedToolIds && worker.equippedToolIds[1]" class="flex items-center justify-between w-full">
                       <span class="text-xs text-stone-300">{{ getToolName(worker.equippedToolIds[1]) }}</span>
                       <button @click="gameStore.unequipTool(worker.id, worker.equippedToolIds[1])" class="text-red-400 hover:text-red-300 ml-2">✕</button>
                    </div>
                    <div v-else class="w-full">
                       <select 
                         @change="(e) => equipToolToWorker(worker.id, (e.target as HTMLSelectElement).value)"
                         class="w-full bg-transparent text-xs text-stone-500 outline-none cursor-pointer"
                       >
                         <option value="" selected disabled>{{ t.common.equip }}...</option>
                         <option 
                           v-for="tool in getAvailableToolsForWorker(worker)" 
                           :key="tool.id" 
                           :value="tool.id"
                         >
                           {{ tool.name }} ({{ gameStore.state.toolInventory[tool.id] }})
                         </option>
                       </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <!-- Tools Tab -->
      <div v-if="activeTab === 'tools'" class="space-y-4">
        <h3 class="text-lg font-serif text-stone-300 mb-2">{{ t.management.toolsTitle }}</h3>
        <div v-for="tool in toolsList" :key="tool.id" class="bg-stone-800 p-3 rounded border border-stone-700">
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-bold text-stone-200">{{ getToolName(tool.id) }}</div>
              <div class="text-xs text-stone-500">{{ getToolDescription(tool.id) }}</div>
              <div class="text-xs text-amber-500/80 mt-1">{{ t.management.stock }}: {{ gameStore.state.toolInventory[tool.id] || 0 }}</div>
            </div>
            <div class="text-amber-400 font-mono">{{ tool.cost }} D.</div>
          </div>
          
          <div class="flex items-center gap-2 mt-3">
             <input 
               type="number" 
               min="1" 
               v-model.number="toolPurchaseQuantities[tool.id]" 
               class="w-16 bg-stone-900 border border-stone-600 text-stone-200 text-center rounded py-1 text-sm"
               placeholder="1"
             >
             <button 
               @click="buyTool(tool.id)"
               class="flex-1 py-1 bg-stone-700 hover:bg-amber-700 text-stone-200 rounded transition-colors text-sm uppercase tracking-wide"
               :disabled="gameStore.state.money < tool.cost * (toolPurchaseQuantities[tool.id] || 1)"
               :class="{ 'opacity-50 cursor-not-allowed': gameStore.state.money < tool.cost * (toolPurchaseQuantities[tool.id] || 1) }"
             >
               {{ t.common.buy }} ({{ tool.cost * (toolPurchaseQuantities[tool.id] || 1) }} D.)
             </button>
          </div>
        </div>
      </div>

      <!-- Knowledge Tab -->
      <div v-if="activeTab === 'knowledge'" class="space-y-4">
        <h3 class="text-lg font-serif text-stone-300 mb-2">{{ t.management.researchTitle }}</h3>
        <div v-for="upgrade in Object.values(UPGRADES)" :key="upgrade.id" class="bg-stone-800 p-3 rounded border border-stone-700 relative">
          
          <!-- Locked Overlay -->
          <div v-if="upgrade.requirements && ((upgrade.requirements.rankIndex !== undefined && gameStore.state.currentRankIndex < upgrade.requirements.rankIndex) || (upgrade.requirements.previousUpgradeId && !gameStore.state.purchasedUpgradeIds.includes(upgrade.requirements.previousUpgradeId)))" class="absolute inset-0 bg-stone-900/90 backdrop-blur-[1px] flex items-center justify-center rounded z-10">
             <div class="text-xs text-stone-500 font-mono text-center px-4">
               <div class="mb-1">🔒 {{ t.common.locked }}</div>
               <div v-if="upgrade.requirements.rankIndex !== undefined && gameStore.state.currentRankIndex < upgrade.requirements.rankIndex" class="text-amber-500">
                 {{ t.management.requiredRank }}: {{ getRankTitle(upgrade.requirements.rankIndex + 1) }}
               </div>
               <div v-if="upgrade.requirements.previousUpgradeId && !gameStore.state.purchasedUpgradeIds.includes(upgrade.requirements.previousUpgradeId)" class="text-amber-500">
                 {{ t.management.requiredResearch }}: {{ getResearchName(upgrade.requirements.previousUpgradeId) }}
               </div>
             </div>
          </div>

           <div class="flex justify-between items-start mb-2">
             <div>
               <div class="font-bold text-stone-200 flex items-center gap-2">
                {{ getResearchName(upgrade.id) }}
                <span v-if="gameStore.state.purchasedUpgradeIds.includes(upgrade.id)" class="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-800">{{ t.management.purchased }}</span>
              </div>
               <div class="text-xs text-stone-500">{{ getResearchDescription(upgrade.id) }}</div>
             </div>
             <div v-if="!gameStore.state.purchasedUpgradeIds.includes(upgrade.id)" class="text-amber-400 font-mono">{{ upgrade.cost }} D.</div>
           </div>

           <!-- Research Progress -->
           <div v-if="gameStore.state.activeResearch && gameStore.state.activeResearch.upgradeId === upgrade.id" class="mb-2">
             <div class="flex justify-between text-xs text-stone-400 mb-1">
               <span>{{ t.management.researching }}</span>
               <span>%{{ Math.floor((gameStore.state.activeResearch.progress / gameStore.state.activeResearch.totalDuration) * 100) }}</span>
             </div>
             <div class="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-700">
               <div 
                 class="bg-blue-500 h-full transition-all duration-300 ease-linear"
                 :style="{ width: `${(gameStore.state.activeResearch.progress / gameStore.state.activeResearch.totalDuration) * 100}%` }"
               ></div>
             </div>
           </div>

           <div v-if="gameStore.state.purchasedUpgradeIds.includes(upgrade.id)">
             <div class="w-full py-2 bg-green-900/20 border border-green-900 text-green-400 rounded text-center text-sm uppercase tracking-wide">
               {{ t.management.purchased }}
             </div>
           </div>
           <button 
             v-else-if="!gameStore.state.activeResearch || gameStore.state.activeResearch.upgradeId !== upgrade.id"
             @click="gameStore.startResearch(upgrade.id)"
             class="w-full py-2 bg-stone-700 hover:bg-blue-700 text-stone-200 rounded transition-colors text-sm uppercase tracking-wide mt-2"
             :disabled="gameStore.state.money < upgrade.cost || !!gameStore.state.activeResearch"
             :class="{ 'opacity-50 cursor-not-allowed': gameStore.state.money < upgrade.cost || !!gameStore.state.activeResearch }"
           >
             {{ gameStore.state.activeResearch ? t.notifications.researchInProgress : t.common.start }}
           </button>
        </div>
      </div>

      <!-- Consultants Tab -->
      <div v-if="activeTab === 'consultants'" class="space-y-4">
        <h3 class="text-lg font-serif text-stone-300 mb-2">{{ t.management.consultantsTitle }}</h3>
        
        <!-- Active Consultants List -->
        <div v-if="gameStore.state.activeConsultantIds.length > 0" class="mb-6">
          <h3 class="text-lg font-serif text-stone-300 mb-3 border-b border-stone-700 pb-1">{{ t.management.activeConsultants }}</h3>
          <div class="grid grid-cols-1 gap-3">
            <div v-for="id in gameStore.state.activeConsultantIds" :key="id" class="bg-stone-800 p-3 rounded border border-stone-600 flex justify-between items-center">
              <div class="flex gap-3 items-center">
                <div v-html="AvatarGenerator.generate(getConsultantName(id))" class="w-10 h-10 rounded overflow-hidden shrink-0 border border-stone-600 bg-stone-900"></div>
                <div>
                  <div class="font-bold text-stone-200">{{ getConsultantName(id) }}</div>
                  <div class="text-xs text-stone-500">{{ getConsultantDescription(id) }}</div>
                </div>
              </div>
              <button 
                @click="gameStore.fireConsultant(id)"
                class="px-3 py-1 bg-red-900/30 hover:bg-red-900 text-red-400 hover:text-red-200 rounded border border-red-900 transition-colors text-xs"
              >
                {{ t.common.fire }}
              </button>
            </div>
          </div>
        </div>

        <!-- Supplier Settings (Only if Supplier is active) -->
        <div v-if="gameStore.state.activeConsultantIds.includes('supplier_1')" class="bg-stone-800/50 p-3 rounded border border-stone-700 mb-4">
            <h4 class="text-sm font-bold text-stone-300 mb-2 flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              {{ t.management.supplierSettings }} ({{ t.management.minStock }})
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="material in gameStore.unlockedMaterials" :key="material" v-show="material !== 'rubble'">
                <label class="block text-xs text-stone-400 mb-1">{{ getMaterialName(material) }}</label>
                <input 
                  type="number" 
                  min="0" 
                  :value="gameStore.state.supplierSettings[material] || 0"
                  @input="e => gameStore.updateSupplierSettings(material, parseInt((e.target as HTMLInputElement).value) || 0)"
                  class="w-full bg-stone-900 border border-stone-700 rounded px-2 py-1 text-sm text-stone-200 focus:border-amber-500 outline-none"
                >
              </div>
            </div>
        </div>

        <div class="text-xs text-stone-500 mb-4 italic">
          {{ t.management.consultantsInfo }}
        </div>

        <div v-for="consultant in consultantsList" :key="consultant.id" class="bg-stone-800 p-3 rounded border border-stone-700 relative">
          <!-- Locked Overlay -->
          <div v-if="gameStore.state.reputation < consultant.minReputation" class="absolute inset-0 bg-stone-900/90 backdrop-blur-[1px] flex items-center justify-center rounded z-10">
             <div class="text-xs text-stone-500 font-mono text-center px-2">
               <div class="mb-1">🔒 {{ t.common.locked }}</div>
               <div class="text-purple-500">{{ consultant.minReputation }} {{ t.management.requiredReputation }}</div>
             </div>
           </div>

           <div class="flex justify-between items-start mb-2">
             <div class="flex gap-3">
                <div v-html="AvatarGenerator.generate(getConsultantName(consultant.id))" class="w-10 h-10 rounded overflow-hidden shrink-0 border border-stone-600 bg-stone-900"></div>
                <div>
                  <div class="font-bold text-stone-200">{{ getConsultantName(consultant.id) }}</div>
                  <div class="text-xs text-stone-500">{{ getConsultantDescription(consultant.id) }}</div>
                </div>
              </div>
             <div class="text-right">
               <div v-if="!gameStore.state.activeConsultantIds.includes(consultant.id)" class="text-amber-400 font-mono">{{ consultant.cost }} D.</div>
               <div class="text-xs text-red-400 mt-1">{{ t.common.salary }}: {{ consultant.salary }} D./{{ t.common.month }}</div>
             </div>
           </div>

           <div v-if="gameStore.state.activeConsultantIds.includes(consultant.id)">
             <div class="w-full py-2 bg-green-900/20 border border-green-900 text-green-400 rounded text-center text-sm uppercase tracking-wide mb-2">
               {{ t.management.hired }}
             </div>
             <button 
               @click="gameStore.fireConsultant(consultant.id)"
               class="w-full py-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded transition-colors text-xs uppercase tracking-wide"
             >
               {{ t.common.fire }}
             </button>
           </div>
           <button 
             v-else
             @click="gameStore.hireConsultant(consultant.id)"
             class="w-full py-2 bg-stone-700 hover:bg-purple-700 text-stone-200 rounded transition-colors text-sm uppercase tracking-wide mt-2"
             :disabled="gameStore.state.money < consultant.cost"
             :class="{ 'opacity-50 cursor-not-allowed': gameStore.state.money < consultant.cost }"
           >
             {{ t.common.hire }}
           </button>
        </div>
      </div>

      <!-- Academy Tab -->
      <div v-if="activeTab === 'academy'" class="space-y-4">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-serif text-stone-300">{{ (t as any).academy.title }}</h3>
            <button 
              @click="gameStore.recruitStudent()"
              class="px-4 py-2 bg-stone-700 hover:bg-blue-600 text-stone-200 rounded transition-colors text-sm uppercase tracking-wide"
              :disabled="gameStore.state.students.length >= 3"
              :class="{ 'opacity-50 cursor-not-allowed': gameStore.state.students.length >= 3 }"
            >
              {{ (t as any).academy.recruit }}
            </button>
        </div>

        <div v-if="gameStore.state.students.length === 0" class="text-stone-500 text-sm italic text-center py-8 border border-stone-800 rounded bg-stone-900/30">
          {{ (t as any).academy.noStudents }}
        </div>

        <div v-else class="space-y-3">
          <div v-for="student in gameStore.state.students" :key="student.id" class="bg-stone-800 p-4 rounded border border-stone-700 relative overflow-hidden group">
            
            <div class="flex justify-between items-start mb-3 relative z-10">
              <div class="flex items-center gap-3">
                 <div v-html="AvatarGenerator.generate(student.name)" class="w-10 h-10 rounded overflow-hidden shrink-0 border border-stone-600 bg-stone-900"></div>
                 <div>
                    <div class="font-bold text-stone-200">{{ student.name }}</div>
                    <div class="text-xs text-stone-500">{{ (t as any).academy.tuition }}: {{ student.tuitionFee }} D.</div>
                 </div>
              </div>
              
              <div class="text-right">
                 <div class="text-xs text-stone-400 mb-1">{{ (t as any).academy.duration }}</div>
                 <div class="font-mono text-amber-500">{{ Math.ceil((student.duration - student.progress) / 1440) }} {{ t.common.day }}</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="relative w-full h-4 bg-stone-900 rounded-full overflow-hidden border border-stone-700 mb-3">
               <div 
                 class="h-full bg-blue-600 transition-all duration-500 ease-linear relative"
                 :style="{ width: `${(student.progress / student.duration) * 100}%` }"
               >
                 <div class="absolute inset-0 bg-white/10 animate-pulse"></div>
               </div>
               <div class="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white drop-shadow-md">
                 %{{ Math.floor((student.progress / student.duration) * 100) }}
               </div>
            </div>

            <!-- Actions (Only if graduated) -->
            <div v-if="student.progress >= student.duration" class="flex gap-2 mt-2 animate-fade-in">
                <button 
                  @click="gameStore.graduateStudent(student.id, 'hire')"
                  class="flex-1 py-2 bg-green-700 hover:bg-green-600 text-white rounded text-xs uppercase tracking-wide transition-colors"
                >
                  {{ (t as any).academy.hire }}
                </button>
                <button 
                  @click="gameStore.graduateStudent(student.id, 'release')"
                  class="flex-1 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs uppercase tracking-wide transition-colors"
                >
                  {{ (t as any).academy.release }}
                </button>
            </div>
            <div v-else class="text-center text-xs text-stone-500 italic py-1">
                {{ (t as any).academy.progress }}...
            </div>

          </div>
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'" class="space-y-4">
        <h3 class="text-lg font-serif text-stone-300 mb-2">{{ t.management.orders }}</h3>
        
        <div v-if="gameStore.state.activeOrders.length === 0" class="text-stone-500 text-sm italic text-center py-4">
          {{ t.management.noOrders }}
        </div>

        <div v-else class="space-y-3">
          <div v-for="order in gameStore.state.activeOrders" :key="order.id" class="bg-stone-800 p-3 rounded border border-stone-700">
            <div class="flex justify-between items-start mb-2">
              <div class="flex gap-3">
                <div v-html="ProductVisualizer.generate(order.productType, order.materialType)" class="w-12 h-12 rounded shrink-0 bg-stone-900/50 border border-stone-600"></div>
                <div>
                  <div class="font-bold text-stone-200">{{ getMaterialName(order.materialType) }} {{ PRODUCTS[order.productId]?.name || order.productType }}</div>
                  <div class="text-xs text-stone-500">{{ t.common.difficulty }}: {{ order.difficulty.toFixed(1) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-amber-400 font-mono">{{ order.reward }} D.</div>
                <div class="text-xs text-purple-400">+{{ order.reputationReward }} {{ t.common.reputation }}</div>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <div class="text-xs text-stone-400">
                {{ t.common.deadline }}: {{ order.deadline }} ({{ t.common.remaining }}: {{ order.deadline - Math.floor(gameStore.state.gameTime / 1440) }})
              </div>
              <button 
                @click="openAssignment(order)"
                :disabled="isOrderInProgress(order.id)"
                :class="[
                  'px-3 py-1 text-stone-100 text-xs rounded transition-colors',
                  isOrderInProgress(order.id)
                    ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-700 hover:bg-amber-600'
                ]"
              >
                {{ isOrderInProgress(order.id) ? t.status.working : t.management.selectOrder }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages Tab -->
      <div v-if="activeTab === 'messages'" class="space-y-4">
        <h3 class="text-lg font-serif text-stone-300 mb-2">{{ t.tabs.messages }}</h3>
        
        <div v-if="gameStore.state.messages.length === 0" class="text-stone-500 text-sm italic text-center py-4">
          {{ t.management.noMessages }}
        </div>

        <div v-else class="space-y-3">
          <div v-for="msg in gameStore.state.messages" :key="msg.id" class="bg-stone-800 p-3 rounded border border-stone-700" :class="{ 'opacity-75': msg.read }">
            <div class="flex justify-between items-start mb-1">
              <span class="font-bold text-stone-300">{{ msg.sender }}</span>
              <span class="text-xs text-stone-500">
                Gün {{ Math.floor(msg.timestamp / 1440) }}, Saat {{ Math.floor((msg.timestamp % 1440) / 60).toString().padStart(2, '0') }}:00
              </span>
            </div>
            <div class="text-sm font-bold text-amber-500 mb-1">{{ msg.subject }}</div>
            <div class="text-sm text-stone-400">{{ msg.body }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expenses Modal -->
    <div v-if="showExpensesModal" class="absolute inset-0 bg-stone-900/95 z-30 flex flex-col items-center justify-center p-4">
      <div class="bg-stone-800 border border-stone-600 rounded p-6 w-full max-w-md relative">
        <button @click="showExpensesModal = false" class="absolute top-2 right-2 text-stone-400 hover:text-stone-200">✕</button>
        
        <h3 class="text-xl font-serif text-amber-500 mb-4 text-center">{{ t.management.expensesBreakdown }}</h3>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center border-b border-stone-700 pb-2">
            <span class="text-stone-300">{{ t.management.workerSalaries }}</span>
            <span class="text-red-400 font-mono">-{{ gameStore.state.workers.reduce((sum, w) => sum + w.salary, 0) }} D.</span>
          </div>
          
          <div class="flex justify-between items-center border-b border-stone-700 pb-2">
            <div>
              <div class="text-stone-300">{{ t.management.taxes }}</div>
              <div class="text-xs text-stone-500">{{ t.common.reputation }} ({{ gameStore.state.reputation }} x 0.5)</div>
            </div>
            <span class="text-red-400 font-mono">-{{ gameStore.state.taxRate }} D.</span>
          </div>

          <div class="flex justify-between items-center pt-2 font-bold">
            <span class="text-stone-200">{{ t.management.total }}</span>
            <span class="text-red-500 font-mono">-{{ gameStore.state.monthlyExpenses }} D.</span>
          </div>
        </div>

        <div class="mt-6 text-xs text-stone-500 text-center">
          * {{ t.notifications.monthlyExpenses }}
        </div>
      </div>
    </div>

    <!-- Assignment Modal (Overlay) -->
    <div v-if="selectedOrder" class="absolute inset-0 bg-stone-900/95 z-20 flex flex-col p-4">
      <div class="flex justify-between items-center mb-4 border-b border-stone-700 pb-2">
        <h3 class="text-lg font-serif text-amber-500">Ekip Kur</h3>
        <button @click="selectedOrder = null" class="text-stone-400 hover:text-stone-200">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto mb-4">
        <div class="mb-4">
          <div class="text-sm text-stone-400 mb-1">Gereken Materyal:</div>
          <div class="flex justify-between items-center bg-stone-800 p-2 rounded border border-stone-700">
            <span class="text-stone-200">{{ MATERIALS[selectedOrder.materialType].name }}</span>
            <span :class="gameStore.state.inventory[selectedOrder.materialType] > 0 ? 'text-green-400' : 'text-red-400'">
              Stok: {{ gameStore.state.inventory[selectedOrder.materialType] }}
            </span>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-sm text-stone-400">Müsait İşçiler:</div>
          <div v-if="availableWorkers.length === 0" class="text-stone-500 text-xs italic">Boşta işçi yok.</div>
          <div 
            v-for="worker in availableWorkers" 
            :key="worker.id"
            @click="toggleWorkerSelection(worker.id)"
            :class="[
              'p-2 rounded border cursor-pointer transition-colors flex justify-between items-center',
              selectedWorkerIds.includes(worker.id) 
                ? 'bg-amber-900/50 border-amber-600' 
                : 'bg-stone-800 border-stone-700 hover:border-stone-500'
            ]"
          >
            <div>
              <div class="text-stone-200 text-sm flex items-center gap-2">
                <div v-html="AvatarGenerator.generate(worker.name)" class="w-6 h-6 rounded overflow-hidden shrink-0"></div>
                {{ worker.name }}
              </div>
              <div class="text-xs text-stone-500 capitalize">{{ worker.type }} (Skill: {{ worker.skill }})</div>
            </div>
            <div v-if="selectedWorkerIds.includes(worker.id)" class="text-amber-500">✓</div>
          </div>
        </div>
      </div>

      <div class="border-t border-stone-700 pt-4">
        <div class="flex justify-between text-xs text-stone-400 mb-2">
          <span>Tahmini Süre:</span>
          <span class="text-stone-200">{{ estimatedDuration }} dk</span>
        </div>
        <div class="flex justify-between text-xs text-stone-400 mb-4">
          <span>Risk:</span>
          <span class="text-stone-200">%{{ (estimatedRisk * 100).toFixed(1) }}</span>
        </div>

        <button 
          @click="confirmProduction"
          :disabled="!canStartProduction"
          :class="[
            'w-full py-3 rounded font-bold transition-colors',
            canStartProduction 
              ? 'bg-amber-600 hover:bg-amber-500 text-white' 
              : 'bg-stone-700 text-stone-500 cursor-not-allowed'
          ]"
        >
          {{ t.management.startProduction }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '~/stores/game';
import { useProduction } from '~/composables/useProduction';
import { useTranslation } from '~/composables/useTranslation';
import { useMaterialTranslation } from '~/composables/useMaterialTranslation';
import { useRankTranslation } from '~/composables/useRankTranslation';
import { useWorkerTranslation } from '~/composables/useWorkerTranslation';
import { useToolTranslation } from '~/composables/useToolTranslation';
import { useResearchTranslation } from '~/composables/useResearchTranslation';
import { useConsultantTranslation } from '~/composables/useConsultantTranslation';
import { useSeasonalColors } from '~/composables/useSeasonalColors';

import { MATERIALS } from '~/constants/materials';
import { TOOLS } from '~/constants/tools';
import { UPGRADES } from '~/constants/upgrades';
import { RANKS } from '~/constants/ranks';
import { PRODUCTS } from '~/constants/products';
import { CONSULTANTS } from '~/constants/consultants';
import { MaterialType, WorkerType, type Order, type Worker } from '~/types';
import { AvatarGenerator } from '~/utils/avatarGenerator';
import { ProductVisualizer } from '~/utils/productVisualizer';

import { formatNumber } from '~/utils/formatters';

const gameStore = useGameStore();
const { calculateDuration, calculateRisk } = useProduction();

const activeTab = ref('market');
const selectedOrder = ref<Order | null>(null);
const showExpensesModal = ref(false);
const showReputationModal = ref(false);
const selectedWorkerIds = ref<string[]>([]);
const toolPurchaseQuantities = ref<Record<string, number>>({});

const { t, format } = useTranslation();
const { getMaterialName, getMaterialDescription, getMaterialUnlockCondition } = useMaterialTranslation();
const { getRankTitle } = useRankTranslation();
const { getWorkerTypeName } = useWorkerTranslation();
const { getToolName, getToolDescription } = useToolTranslation();
const { getResearchName, getResearchDescription } = useResearchTranslation();
const { getConsultantName, getConsultantDescription } = useConsultantTranslation();

// Seasonal colors
const { getSeasonalClasses } = useSeasonalColors(gameStore.currentSeason);
const seasonalClasses = computed(() => ({
  header: getSeasonalClasses('header'),
  card: getSeasonalClasses('card'),
  border: getSeasonalClasses('border'),
  button: getSeasonalClasses('button'),
}));

const tabs = computed(() => [
  { id: 'market', label: t.value.tabs.market },
  { id: 'workforce', label: t.value.tabs.workers },
  { id: 'tools', label: t.value.tabs.tools },
  { id: 'knowledge', label: t.value.tabs.research },
  { id: 'consultants', label: t.value.tabs.consultants },
  { id: 'academy', label: (t.value as any).tabs.academy },
  { id: 'orders', label: t.value.tabs.orders },
  { id: 'messages', label: t.value.tabs.messages }
]);

const toolsList = Object.values(TOOLS);
const upgradesList = Object.values(UPGRADES);
const consultantsList = Object.values(CONSULTANTS);
// Initialize quantities
toolsList.forEach(t => toolPurchaseQuantities.value[t.id] = 1);

const materialsList = Object.values(MATERIALS);

const workerTypes = [
  { type: WorkerType.SLAVE, salary: 10 },
  { type: WorkerType.APPRENTICE, salary: 50 },
  { type: WorkerType.MASTER, salary: 200 }
];

// Computed
const availableWorkers = computed(() => {
  return gameStore.state.workers.filter(w => w.status === 'idle');
});

const selectedWorkers = computed(() => {
  return gameStore.state.workers.filter(w => selectedWorkerIds.value.includes(w.id));
});

const estimatedDuration = computed(() => {
  if (!selectedOrder.value || selectedWorkers.value.length === 0) return 0;
  return calculateDuration(selectedOrder.value.materialType, selectedWorkers.value);
});

const estimatedRisk = computed(() => {
  if (!selectedOrder.value) return 0;
  return calculateRisk(selectedOrder.value.materialType, selectedWorkers.value);
});

const canStartProduction = computed(() => {
  if (!selectedOrder.value) return false;
  const hasMaterial = gameStore.state.inventory[selectedOrder.value.materialType] > 0;
  const hasWorkers = selectedWorkerIds.value.length > 0;
  return hasMaterial && hasWorkers;
});

// Methods
function getSeasonalPrice(materialId: MaterialType, basePrice: number): number {
  let price = basePrice;
  
  // Winter: Stone materials +30%
  if (gameStore.currentSeason === 'winter') {
    if (materialId === MaterialType.LIMESTONE || 
        materialId === MaterialType.MARBLE_PENTELIC || 
        materialId === MaterialType.BASALT) {
      price = Math.floor(price * 1.30);
    }
  }
  
  return price;
}



function hireWorker(type: WorkerType, salary: number) {
  const id = Math.random().toString(36).substring(2, 9);
  
  const worker: Worker = {
    id,
    type,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id.substring(0, 3)}`,
    // cost removed
    skill: type === WorkerType.MASTER ? 10 : (type === WorkerType.APPRENTICE ? 3 : 1),
    salary,
    status: 'idle',
    equippedToolIds: [],
    experience: 0,
    level: 1,
    loyalty: 50,
    negotiationPending: false,
    lastWorkedAt: 0,
    lastRaiseDay: 0,
    baseSkill: type === WorkerType.MASTER ? 10 : (type === WorkerType.APPRENTICE ? 3 : 1)
  };

  gameStore.hireWorker(worker);
}

function fireWorker(workerId: string) {
  // Optional: Add confirmation dialog
  if (confirm('Bu işçiyi kovmak istediğinize emin misiniz?')) {
    gameStore.fireWorker(workerId);
  }
}

function openAssignment(order: Order) {
  selectedOrder.value = order;
  selectedWorkerIds.value = [];
}



function getAvailableToolsForWorker(worker: Worker) {
  return toolsList.filter(tool => {
    const inStock = (gameStore.state.toolInventory[tool.id] || 0) > 0;
    const isAllowed = tool.allowedWorkerTypes.includes(worker.type);
    const isNotEquipped = !worker.equippedToolIds?.includes(tool.id);
    return inStock && isAllowed && isNotEquipped;
  });
}

function equipToolToWorker(workerId: string, toolId: string) {
  if (!toolId) return;
  gameStore.equipTool(workerId, toolId);
  // Reset select? It might be tricky with v-model, but here we use @change
  // The UI will re-render and show the equipped item in the slot div instead of the select
}

function buyTool(toolId: string) {
  const qty = toolPurchaseQuantities.value[toolId] || 1;
  gameStore.buyTool(toolId, qty);
}

function toggleWorkerSelection(workerId: string) {
  const index = selectedWorkerIds.value.indexOf(workerId);
  if (index === -1) {
    selectedWorkerIds.value.push(workerId);
  } else {
    selectedWorkerIds.value.splice(index, 1);
  }
}

function confirmProduction() {
  if (!selectedOrder.value || !canStartProduction.value) return;

  const task = {
    id: Math.random().toString(36).substring(2, 9),
    orderId: selectedOrder.value.id,
    materialType: selectedOrder.value.materialType,
    productId: selectedOrder.value.productId,
    productType: selectedOrder.value.productType,
    assignedWorkers: [...selectedWorkerIds.value],
    progress: 0,
    totalDuration: estimatedDuration.value,
    currentDuration: 0,
    risk: estimatedRisk.value,
    status: 'pending' as const,
    currentStage: 'roughing' as const
  };

  if (gameStore.startProduction(task)) {
    selectedOrder.value = null;
    selectedWorkerIds.value = [];
    // Switch to workshop view or just close modal?
    // Maybe show a toast
  }
}

function isOrderInProgress(orderId: string) {
  return gameStore.state.productionTasks.some(t => t.orderId === orderId && t.status !== 'completed' && t.status !== 'failed');
}

function calculateRankProgress() {
  const currentRank = gameStore.currentRank;
  const nextRank = gameStore.nextRank;
  
  if (!nextRank) return 100;
  
  const currentRep = gameStore.state.reputation;
  const minRep = currentRank.minReputation;
  const nextRep = nextRank.minReputation;
  
  const totalNeeded = nextRep - minRep;
  const currentProgress = currentRep - minRep;
  
  return Math.min(100, Math.max(0, (currentProgress / totalNeeded) * 100));
}
</script>
