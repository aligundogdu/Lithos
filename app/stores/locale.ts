import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export type Locale = 'tr' | 'en';

export const useLocaleStore = defineStore('locale', () => {
    const currentLocale = useStorage<Locale>('lithos-locale', 'tr');

    function setLocale(locale: Locale) {
        currentLocale.value = locale;
    }

    return {
        currentLocale,
        setLocale
    };
});
