<template>
  <NuxtLayout>
    <NuxtPage />
    <NotificationContainer />
    <RankUpModal />
  </NuxtLayout>
</template>

<script setup lang="ts">
import NotificationContainer from '~/components/NotificationContainer.vue';
import RankUpModal from '~/components/RankUpModal.vue';
</script>
