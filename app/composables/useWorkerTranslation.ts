import { computed } from 'vue';
import { useTranslation } from '~/composables/useTranslation';
import { WorkerType } from '~/types';

export function useWorkerTranslation() {
    const { t } = useTranslation();

    const getWorkerTypeName = (workerType: WorkerType): string => {
        const key = workerType as keyof typeof t.value.workerTypes;
        return t.value.workerTypes[key] || workerType;
    };

    return {
        getWorkerTypeName
    };
}
