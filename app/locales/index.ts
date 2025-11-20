import { tr } from './tr';
import { en } from './en';

export const translations = {
    tr,
    en
};

export type TranslationKey = keyof typeof tr;
export type Translations = typeof tr;
