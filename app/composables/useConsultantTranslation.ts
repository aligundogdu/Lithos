import { useTranslation } from '~/composables/useTranslation';

export function useConsultantTranslation() {
    const { t } = useTranslation();

    const getConsultantName = (consultantId: string): string => {
        const key = consultantId as keyof typeof t.value.consultants;
        return t.value.consultants[key]?.name || consultantId;
    };

    const getConsultantDescription = (consultantId: string): string => {
        const key = consultantId as keyof typeof t.value.consultants;
        return t.value.consultants[key]?.description || '';
    };

    return {
        getConsultantName,
        getConsultantDescription
    };
}
