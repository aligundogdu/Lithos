import { useTranslation } from '~/composables/useTranslation';

export function useResearchTranslation() {
    const { t } = useTranslation();

    const getResearchName = (researchId: string): string => {
        const key = researchId as keyof typeof t.value.research;
        return t.value.research[key]?.name || researchId;
    };

    const getResearchDescription = (researchId: string): string => {
        const key = researchId as keyof typeof t.value.research;
        return t.value.research[key]?.description || '';
    };

    return {
        getResearchName,
        getResearchDescription
    };
}
