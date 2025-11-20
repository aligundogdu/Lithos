import { computed } from 'vue';
import { useLocaleStore } from '~/stores/locale';
import { translations, type Translations } from '~/locales';

export function useTranslation() {
    const localeStore = useLocaleStore();

    const t = computed(() => translations[localeStore.currentLocale] as Translations);

    return {
        t,
        locale: computed(() => localeStore.currentLocale),
        setLocale: localeStore.setLocale,
        format: (text: string, ...args: (string | number)[]) => {
            return text.replace(/{(\d+)}/g, (match, number) => {
                return typeof args[number] !== 'undefined' ? String(args[number]) : match;
            });
        }
    };
}
