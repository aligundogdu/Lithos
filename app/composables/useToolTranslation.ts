import { computed } from 'vue';
import { useTranslation } from '~/composables/useTranslation';

export function useToolTranslation() {
    const { t } = useTranslation();

    const getToolName = (toolId: string): string => {
        const key = toolId as keyof typeof t.value.tools;
        return t.value.tools[key]?.name || toolId;
    };

    const getToolDescription = (toolId: string): string => {
        const key = toolId as keyof typeof t.value.tools;
        return t.value.tools[key]?.description || '';
    };

    return {
        getToolName,
        getToolDescription
    };
}
