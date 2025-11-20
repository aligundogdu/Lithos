import { computed } from 'vue';
import { useTranslation } from '~/composables/useTranslation';

export function useRankTranslation() {
    const { t } = useTranslation();

    const getRankTitle = (rankId: number): string => {
        const key = `rank_${rankId}` as keyof typeof t.value.ranks;
        return t.value.ranks[key] || `Rank ${rankId}`;
    };

    return {
        getRankTitle
    };
}
