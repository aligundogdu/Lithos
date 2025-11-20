import { computed } from 'vue';
import { useTranslation } from '~/composables/useTranslation';
import { MATERIALS } from '~/constants/materials';
import { MaterialType } from '~/types';

export function useMaterialTranslation() {
    const { t } = useTranslation();

    const getMaterialName = (materialType: MaterialType): string => {
        const key = materialType.toLowerCase() as keyof typeof t.value.materials;
        return t.value.materials[key]?.name || MATERIALS[materialType]?.name || materialType;
    };

    const getMaterialDescription = (materialType: MaterialType): string => {
        const key = materialType.toLowerCase() as keyof typeof t.value.materials;
        return t.value.materials[key]?.description || MATERIALS[materialType]?.description || '';
    };

    const getMaterialUnlockCondition = (materialType: MaterialType): string => {
        const key = materialType.toLowerCase() as keyof typeof t.value.materials;
        // @ts-ignore
        return t.value.materials[key]?.unlockCondition || MATERIALS[materialType]?.unlockCondition || '';
    };

    return {
        getMaterialName,
        getMaterialDescription,
        getMaterialUnlockCondition
    };
}
