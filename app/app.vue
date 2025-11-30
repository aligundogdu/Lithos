<template>
  <div>
    <!-- Splash Screen -->
    <SplashScreen v-if="showSplash" @complete="showSplash = false" />
    
    <!-- Main App (hidden during splash) -->
    <div v-show="!showSplash">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <NotificationContainer />
      <RankUpModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NotificationContainer from '~/components/NotificationContainer.vue';
import RankUpModal from '~/components/RankUpModal.vue';
import { useGameTime } from '~/composables/useGameTime';

const showSplash = ref(true);

// Initialize game loop
const { resume, calculateOfflineProgress } = useGameTime();

onMounted(() => {
  // Calculate offline progress when app loads
  calculateOfflineProgress();
  
  // Start the game loop
  resume();
});
</script>
