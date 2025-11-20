<template>
  <button 
    @click="toggleLocale"
    class="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded border border-stone-600 transition-colors text-sm font-medium"
    :title="t.common.language"
  >
    {{ locale === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN' }}
  </button>
</template>

<script setup lang="ts">
import { useTranslation } from '~/composables/useTranslation';

const { t, locale, setLocale } = useTranslation();

function toggleLocale() {
  setLocale(locale.value === 'tr' ? 'en' : 'tr');
}
</script>
