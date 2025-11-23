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
import { ref } from 'vue';
import NotificationContainer from '~/components/NotificationContainer.vue';
import RankUpModal from '~/components/RankUpModal.vue';

const showSplash = ref(true);
</script>
